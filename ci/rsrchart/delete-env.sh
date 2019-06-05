#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

release_name=$1
disk_name=rsr-${release_name}-1

log "Deleting helm chart..."
docker run -it -v /Users/dlebrero/projects/akvo/akvo-rsr/ci/rsrchart:/apps -v ~/.kube/config:/root/.kube/config -v ~/.helm:/root/.helm alpine/helm:2.12.3 delete --purge ${release_name}
log "Deleting Postgress persistent volume claim..."
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