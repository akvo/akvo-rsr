#!/usr/bin/env bash

set -u

function log {
   echo "$(date +"%T") - INFO - $*"
}

release_name=$1
disk_name=rsr-${release_name}-1

gcloud container clusters get-credentials test --zone europe-west1-d --project akvo-lumen

log "Maybe deleting dangling snapshot"
snapshot_name=rsr-${release_name}-1
gcloud compute snapshots delete ${snapshot_name} --quiet

log "Deleting helm chart..."
helm delete --purge ${release_name}
log "Deleting Postgres persistent volume claim..."
kubectl delete persistentvolumeclaims --namespace=rsr-demo data-${release_name}-postgresql-0

starttime=$(date +%s)

if gcloud compute disks describe ${disk_name} --zone europe-west1-d --quiet > /dev/null 2>&1; then
    log "Deleting media disk ..."
    until gcloud compute disks delete ${disk_name} --zone europe-west1-d --quiet > /dev/null 2>&1
    do
        if [[ $(( $(date +%s) - 300 )) -lt "${starttime}" ]]; then
            echo "Waiting for env to stop before destroying disks"
            sleep 10
        else
            echo "Cannot delete disks after 5 mins. Giving up. Please check what is going on."
            exit 1
        fi
    done
fi