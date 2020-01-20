#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [[ "${TRAVIS_BRANCH}" != "develop" ]] && [[ "${TRAVIS_BRANCH}" != "master" ]]; then
    exit 0
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

log Creating statsd to prometheus
docker build -t "eu.gcr.io/${PROJECT_NAME}/rsr-statsd-to-prometheus:${TRAVIS_COMMIT}" statsd-to-prometheus

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

ENVIRONMENT=test
if [[ "${TRAVIS_BRANCH}" == "master" ]]; then
    log Environment is production
    gcloud container clusters get-credentials production
    ENVIRONMENT=production
    NGINX_POD_CPU_REQUESTS="200m"
    NGINX_POD_CPU_LIMITS="400m"
    NGINX_POD_MEM_REQUESTS="2Gi"
    NGINX_POD_MEM_LIMITS="3Gi"
    BACKEND_POD_CPU_REQUESTS="400m"
    BACKEND_POD_CPU_LIMITS="2000m"
    BACKEND_POD_MEM_REQUESTS="1024Mi"
    BACKEND_POD_MEM_LIMITS="2048Mi"
    REPORTS_POD_CPU_REQUESTS="200m"
    REPORTS_POD_CPU_LIMITS="2000m"
    REPORTS_POD_MEM_REQUESTS="512Mi"
    REPORTS_POD_MEM_LIMITS="1025Mi"
    MEMCACHED_POD_CPU_REQUESTS="200m"
    MEMCACHED_POD_CPU_LIMITS="300m"
    MEMCACHED_POD_MEM_REQUESTS="64Mi"
    MEMCACHED_POD_MEM_LIMITS="128Mi"
else
    log Environement is test
    gcloud container clusters get-credentials test
    NGINX_POD_CPU_REQUESTS="200m"
    NGINX_POD_CPU_LIMITS="400m"
    NGINX_POD_MEM_REQUESTS="1Gi"
    NGINX_POD_MEM_LIMITS="2Gi"
    BACKEND_POD_CPU_REQUESTS="400m"
    BACKEND_POD_CPU_LIMITS="1000m"
    BACKEND_POD_MEM_REQUESTS="768Mi"
    BACKEND_POD_MEM_LIMITS="1024Mi"
    REPORTS_POD_CPU_REQUESTS="100m"
    REPORTS_POD_CPU_LIMITS="1000m"
    REPORTS_POD_MEM_REQUESTS="512Mi"
    REPORTS_POD_MEM_LIMITS="768Mi"
    MEMCACHED_POD_CPU_REQUESTS="100m"
    MEMCACHED_POD_CPU_LIMITS="200m"
    MEMCACHED_POD_MEM_REQUESTS="64Mi"
    MEMCACHED_POD_MEM_LIMITS="96Mi"
fi

log Pushing images
gcloud auth configure-docker
docker push eu.gcr.io/${PROJECT_NAME}/rsr-backend
docker push eu.gcr.io/${PROJECT_NAME}/rsr-nginx
docker push eu.gcr.io/${PROJECT_NAME}/rsr-statsd-to-prometheus

kubectl apply -f ci/k8s/media-disk.yml
kubectl apply -f ci/k8s/service.yml

sed -e "s/\${TRAVIS_COMMIT}/$TRAVIS_COMMIT/"
  -e "s/\${ENVIRONMENT}/${ENVIRONMENT}/" \
  -e "s/\${NGINX_POD_CPU_REQUESTS}/${NGINX_POD_CPU_REQUESTS}/" \
  -e "s/\${NGINX_POD_MEM_REQUESTS}/${NGINX_POD_MEM_REQUESTS}/" \
  -e "s/\${NGINX_POD_CPU_LIMITS}/${NGINX_POD_CPU_LIMITS}/" \
  -e "s/\${NGINX_POD_MEM_LIMITS}/${NGINX_POD_MEM_LIMITS}/" \
  -e "s/\${BACKEND_POD_CPU_REQUESTS}/${BACKEND_POD_CPU_REQUESTS}/" \
  -e "s/\${BACKEND_POD_MEM_REQUESTS}/${BACKEND_POD_MEM_REQUESTS}/" \
  -e "s/\${BACKEND_POD_CPU_LIMITS}/${BACKEND_POD_CPU_LIMITS}/" \
  -e "s/\${BACKEND_POD_MEM_LIMITS}/${BACKEND_POD_MEM_LIMITS}/" \
  -e "s/\${REPORTS_POD_CPU_REQUESTS}/${REPORTS_POD_CPU_REQUESTS}/" \
  -e "s/\${REPORTS_POD_MEM_REQUESTS}/${REPORTS_POD_MEM_REQUESTS}/" \
  -e "s/\${REPORTS_POD_CPU_LIMITS}/${REPORTS_POD_CPU_LIMITS}/" \
  -e "s/\${REPORTS_POD_MEM_LIMITS}/${REPORTS_POD_MEM_LIMITS}/" \
  -e "s/\${MEMCACHED_POD_CPU_REQUESTS}/${MEMCACHED_POD_CPU_REQUESTS}/" \
  -e "s/\${MEMCACHED_POD_MEM_REQUESTS}/${MEMCACHED_POD_MEM_REQUESTS}/" \
  -e "s/\${MEMCACHED_POD_CPU_LIMITS}/${MEMCACHED_POD_CPU_LIMITS}/" \
  -e "s/\${MEMCACHED_POD_MEM_LIMITS}/${MEMCACHED_POD_MEM_LIMITS}/" \
  ci/k8s/deployment.yaml.template > ci/k8s/deployment.yaml

kubectl apply -f ci/k8s/deployment.yml

kubectl apply -f ci/k8s/grafana/main.yml

log Waiting for k8s to finish
./ci/k8s/helpers/wait-for-k8s-deployment-to-be-ready.sh
