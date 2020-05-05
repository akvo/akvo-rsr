#!/usr/bin/env bash

## Instructions:
## You must have access to the Google akvo-lumen project
## Then just run this script
set -eu

# gcloud auth login
gcloud container clusters get-credentials test --zone europe-west1-d --project akvo-lumen
KUBECTL_CONTEXT=$(kubectl config view -o=jsonpath='{.current-context}')
if [ "${KUBECTL_CONTEXT}" != "gke_akvo-lumen_europe-west1-d_test" ]; then
    echo "Please ensure you are in the test context. Use kubectx for easy context switches"
    exit 1
fi

POD=$(kubectl get pods --namespace=rsr-demo -l "app.kubernetes.io/instance=rsr3" -o jsonpath="{.items[0].metadata.name}" --field-selector=status.phase=Running)
echo "Found RSR POD: ${POD}"

kubectl exec "${POD}" --namespace=rsr-demo --container rsr-backend -it -- python manage.py dumpdata --indent 2 -o data/dev-db.json -e rsr.PeriodActualValue -e rsr.PeriodDisaggregation

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

DEFAULT_FIXTURE_PATH="${DIR}/../dev-db.json"
FIXTURE_PATH=${FIXTURE_PATH:-$DEFAULT_FIXTURE_PATH}
echo "Copying DB fixture to ${FIXTURE_PATH}..."
kubectl cp -c rsr-backend rsr-demo/"${POD}":/var/akvo/rsr/code/data/dev-db.json "${FIXTURE_PATH}"
