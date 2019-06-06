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

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

release_name=$1
restore_from=$2
rsr_version=${3:-prod}
HELM_EXTRA_OPTS=""

if [[ ! $release_name =~ ^rsr[1-4]$ ]]; then
    echo "Release must be one of rsr1,rsr2,rsr3 or rsr4"
    exit 1
fi

switch_cluster "test"

if [[ $restore_from == "prod" ]]; then

    snapshot_name=rsr-${release_name}-1
    disk_name=rsr-${release_name}-1
    log Creating snapshot of Media disk in Prod
    gcloud compute disks snapshot gke-production-24b6e45-pvc-4f1fdb7d-d5fe-11e8-bbc7-42010a8400de --zone europe-west1-d --snapshot-names=${snapshot_name}
    log Creating new disk with previous snaphost
    gcloud compute disks create ${disk_name} --source-snapshot=${snapshot_name} --zone europe-west1-d
    log Deleting snapshot
    gcloud compute snapshots delete ${snapshot_name} --quiet
    HELM_EXTRA_OPTS="--set gcePersistentDiskName=${disk_name}"

elif [[ $restore_from != "empty" ]]; then
    echo "restore_from param must be either empty or prod"
    exit 1
fi

if [[ ${rsr_version} == "prod" ]]; then
    switch_cluster "production"
    read_version
    rsr_version=${VERSION}
    switch_cluster "test"
fi

kubectl get pods > /dev/null

log Running helm ...
helm install . --dep-up --namespace rsr-demo --name ${release_name} --set restoreFrom="${restore_from}" --set rsrVersion="${rsr_version}" ${HELM_EXTRA_OPTS}

log Waiting for new environment to be ready
${DIR}/helpers/wait-for-k8s-deployment-to-be-ready.sh ${release_name}