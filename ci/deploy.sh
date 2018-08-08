#!/usr/bin/env bash

function log {
   echo "$(date +"%T") - INFO - $*"
}

export PROJECT_NAME=akvo-lumen

#if [[ "${TRAVIS_BRANCH}" != "develop" ]] && [[ "${TRAVIS_BRANCH}" != "master" ]]; then
#    exit 0
#fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

log Making sure gcloud and kubectl are installed and up to date
gcloud components install kubectl
gcloud components update
gcloud version
which gcloud kubectl

log Authentication with gcloud and kubectl
openssl aes-256-cbc -K $encrypted_12c8071d2874_key -iv $encrypted_12c8071d2874_iv \
	-in ci/gcloud-service-account.json.enc -out ci/gcloud-service-account.json -d
gcloud auth activate-service-account --key-file ci/gcloud-service-account.json
gcloud config set project akvo-lumen
gcloud config set container/cluster europe-west1-d
gcloud config set compute/zone europe-west1-d
gcloud config set container/use_client_certificate True

if [[ "${TRAVIS_BRANCH}" == "master" ]]; then
    log Environment is production
    gcloud container clusters get-credentials production
else
    log Environement is test
    gcloud container clusters get-credentials test
fi

log Pushing images
gcloud docker -- push eu.gcr.io/${PROJECT_NAME}/rsr-backend
gcloud docker -- push eu.gcr.io/${PROJECT_NAME}/rsr-nginx

sed -e "s/\${TRAVIS_COMMIT}/$TRAVIS_COMMIT/" ci/k8s/deployment.yml > deployment.yml.tmp

kubectl apply -f ci/k8s/media-disk.yml
kubectl apply -f deployment.yml.tmp

log Waiting for k8s to finish
./ci/k8s/helpers/wait-for-k8s-deployment-to-be-ready.sh
log Waiting for k8s to be healthy
./ci/helpers/wait-for-k8s-deployment-to-be-healthy.sh

#kubectl create secret generic  --dry-run rsr-test-secret --from-file=ci/k8s/rsr-test-config -o yaml | kubectl apply -f -