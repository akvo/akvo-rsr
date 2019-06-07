#!/usr/bin/env bash


starttime=$(date +%s)
RELEASE_NAME=$1

while [ $(( $(date +%s) - 600 )) -lt "${starttime}" ]; do

   rsr_status=$(kubectl get pods --namespace=rsr-demo -l "app.kubernetes.io/name=rsrchart,app.kubernetes.io/instance=${RELEASE_NAME}" -o jsonpath='{range .items[*].status.containerStatuses[*]}{@.name}{" ready="}{@.ready}{"\n"}{end}')

    if [[ ${rsr_status} =~ "ready=true" ]] && ! [[ ${rsr_status} =~ "ready=false" ]] ; then
        echo "all good!"
        exit 0
    else
        echo "Waiting for the containers to be ready"
        sleep 10
    fi
done

echo "Containers not ready after 10 minutes. Please investigate the issue"

kubectl get pods --namespace=rsr-demo -l "app.kubernetes.io/name=rsrchart,app.kubernetes.io/instance=${RELEASE_NAME}" -o jsonpath='{range .items[*].status.containerStatuses[*]}{@.name}{" ready="}{@.ready}{"\n"}{end}'

exit 1