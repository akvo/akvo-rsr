#!/usr/bin/env bash

set -u

function log {
   echo "$(date +"%T") - INFO - $*"
}

release_name=$1

gcloud container clusters get-credentials test --zone europe-west1-d --project akvo-lumen

log "Deleting helm chart..."
helm delete --purge ${release_name}
log "Deleting Postgress persistent volume claim..."
kubectl delete persistentvolumeclaims --namespace=rsr-demo data-${release_name}-postgresql-0