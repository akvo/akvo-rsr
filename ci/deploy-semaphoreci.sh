#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [[ "${CI_BRANCH}" != "develop" ]]; then
    exit 0
fi

if [[ "${CI_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

log Creating statsd to prometheus
docker build -t "eu.gcr.io/${PROJECT_NAME}/rsr-statsd-to-prometheus:${CI_COMMIT}" statsd-to-prometheus

log Authentication with gcloud and kubectl
gcloud auth activate-service-account --key-file=/home/semaphore/.secrets/gcp.json
gcloud config set project akvo-lumen
gcloud config set container/cluster europe-west1-d
gcloud config set compute/zone europe-west1-d
gcloud config set container/use_client_certificate False

if [[ "${CI_BRANCH}" == "master" ]]; then
    log Environment is production
    gcloud container clusters get-credentials production
else
    log Environement is test
    gcloud container clusters get-credentials test
fi

log Pushing images
gcloud auth configure-docker
docker push eu.gcr.io/${PROJECT_NAME}/rsr-backend
docker push eu.gcr.io/${PROJECT_NAME}/rsr-nginx
docker push eu.gcr.io/${PROJECT_NAME}/rsr-statsd-to-prometheus

sed -e "s/\${TRAVIS_COMMIT}/$CI_COMMIT/" ci/k8s/deployment.yml > deployment.yml.tmp

kubectl apply -f ci/k8s/media-disk.yml
kubectl apply -f ci/k8s/service.yml
kubectl apply -f deployment.yml.tmp
kubectl apply -f ci/k8s/grafana/main.yml

log Waiting for k8s to finish
./ci/k8s/helpers/wait-for-k8s-deployment-to-be-ready.sh
