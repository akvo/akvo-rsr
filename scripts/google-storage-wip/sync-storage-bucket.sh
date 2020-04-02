#!/usr/bin/env bash

set -eu

echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
apt-get install apt-transport-https ca-certificates gnupg
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
apt-get update
apt-get install -y --no-install-recommends --no-install-suggests google-cloud-sdk
gcloud auth activate-service-account --key-file /var/akvo/rsr/code/akvo/akvo-lumen-service-account-credentials.json


nohup time gsutil -m rsync -r -d -e /var/akvo/rsr/mediaroot gs://akvo-rsr-testing-buckets
