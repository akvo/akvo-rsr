#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

release_name=$1
snapshot_name=rsr-${release_name}-1
disk_name=rsr-${release_name}-1

log Creating snapshot of Media disk in Prod
gcloud compute disks snapshot gke-production-24b6e45-pvc-4f1fdb7d-d5fe-11e8-bbc7-42010a8400de --zone europe-west1-d --snapshot-names=${snapshot_name}
log Creating new disk with previous snaphost
gcloud compute disks create ${disk_name} --source-snapshot=${snapshot_name} --zone europe-west1-d
log Deleting snapshot
gcloud compute snapshots delete ${snapshot_name} --quiet

kubectl get pods > /dev/null

log Running helm ...
docker run -it -v /Users/dlebrero/projects/akvo/akvo-rsr/ci/rsrchart:/apps -v ~/.kube/config:/root/.kube/config -v ~/.helm:/root/.helm alpine/helm:2.12.3 install . --dep-up --namespace rsr-demo --name ${release_name} --set gcePersistentDiskName=${disk_name}

log Waiting for new environment to be ready
${DIR}/helpers/wait-for-k8s-deployment-to-be-ready.sh ${release_name}