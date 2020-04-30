#!/usr/bin/env bash

set -eux

dump_file="prod-dump.$(date +%s).gz"
if [[ -z "$(gcloud config list --format='value(core.account)')" ]]; then
  gcloud auth login
fi

gcloud config set project akvo-lumen

gcloud sql export sql rsr-prod-database "gs://akvo-rsr-db-dump/${dump_file}" --database=rsr_db
gsutil cp "gs://akvo-rsr-db-dump/$dump_file" /data/db_dump.gz
gsutil rm "gs://akvo-rsr-db-dump/$dump_file"
