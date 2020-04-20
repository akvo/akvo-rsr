#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

function switch_cluster () {
    CLUSTER=$1
    log "Reading ${CLUSTER} version"
    log "running: gcloud container clusters get-credentials ${CLUSTER} --zone europe-west1-d --project akvo-lumen"
    if ! gcloud container clusters get-credentials "${CLUSTER}" --zone europe-west1-d --project akvo-lumen; then
        log "Could not change context to ${CLUSTER}. Nothing done."
        exit 3
    fi
}

function read_version () {
    VERSION=$(kubectl get deployments rsr -o jsonpath="{@.spec.template.metadata.labels['rsr-version']}")
}

function read_report_server_version () {
    VERSION=$(kubectl get deployments reportserver -o jsonpath="{@.spec.template.metadata.labels['akvo-report-server-version']}")
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

release_name=$1
restore_from=$2
rsr_version=${3:-prod}
report_server_version=${4:-prod}
HELM_EXTRA_OPTS=""

if [[ ! ${release_name} =~ ^rsr[1-4]$ ]]; then
    echo "Release must be one of rsr1,rsr2,rsr3 or rsr4"
    exit 1
fi

switch_cluster "test"
gcloud config set project akvo-lumen

if [[ $restore_from == "prod" ]]; then
    log Creating Production RSR DB dump
    gcloud sql export sql rsr-prod-database "gs://akvo-rsr-db-dump/rsr.prod.$release_name.dump.gz" --database=rsr_db
elif [[ $restore_from != "empty" ]]; then
    echo "restore_from param must be either empty or prod"
    exit 1
fi

if [[ ${rsr_version} == "prod" ]]; then
    switch_cluster "production"
    read_version
    rsr_version=${VERSION}
    switch_cluster "test"
elif [[ ${rsr_version} == "test" ]]; then
    read_version
    rsr_version=${VERSION}
fi

if [[ ${report_server_version} == "prod" ]]; then
    switch_cluster "production"
    read_report_server_version
    report_server_version=${VERSION}
    switch_cluster "test"
elif [[ ${report_server_version} == "test" ]]; then
    read_report_server_version
    report_server_version=${VERSION}
fi

kubectl get pods > /dev/null

log Creating Production ReportServer DB dump
gcloud sql export sql rsr-prod-database "gs://akvo-rsr-db-dump/reportserver.prod.$release_name.dump.gz" --database=rsr_reportserver_db

log Running helm ...
helm install . --dep-up --namespace rsr-demo --name ${release_name} --set restoreFrom="${restore_from}" \
    --set rsrVersion="${rsr_version}" \
    --set reportServerVersion="${report_server_version}" \
    ${HELM_EXTRA_OPTS}

log Waiting for new environment to be ready
${DIR}/helpers/wait-for-k8s-deployment-to-be-ready.sh ${release_name}

log Restarting pod so that ReportServer reconnects to the DB as when it was started the DB was not ready yet
kubectl --namespace=rsr-demo delete pod "$(kubectl get pods --namespace=rsr-demo -l "app.kubernetes.io/instance=rsr3" -o jsonpath="{.items[0].metadata.name}")"

log Waiting for new environment to be ready one last time
${DIR}/helpers/wait-for-k8s-deployment-to-be-ready.sh ${release_name}

echo
log RSR env available at https://${release_name}.akvotest.org/