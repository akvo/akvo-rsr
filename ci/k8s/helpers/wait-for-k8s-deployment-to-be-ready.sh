#!/usr/bin/env bash


starttime=$(date +%s)

while [ $(( $(date +%s) - 300 )) -lt "${starttime}" ]; do

   rsr_status=$(kubectl get pods -l "rsr-version=$TRAVIS_COMMIT,run=rsr" -ao jsonpath='{range .items[*].status.containerStatuses[*]}{@.name}{" ready="}{@.ready}{"\n"}{end}')
   old_rsr_status=$(kubectl get pods -l "rsr-version!=$TRAVIS_COMMIT,run=rsr" -ao jsonpath='{range .items[*].status.containerStatuses[*]}{@.name}{" ready="}{@.ready}{"\n"}{end}')

    if [[ ${rsr_status} =~ "ready=true" ]] && ! [[ ${rsr_status} =~ "ready=false" ]] && ! [[ ${old_rsr_status} =~ "ready" ]] ; then
        echo "all good!"
        exit 0
    else
        echo "Waiting for the containers to be ready"
        sleep 10
    fi
done

echo "Containers not ready after 5 minutes or old containers not stopped"

kubectl get pods -l "run=rsr" -ao jsonpath='{range .items[*].status.containerStatuses[*]}{@.name}{" ready="}{@.ready}{"\n"}{end}'

exit 1