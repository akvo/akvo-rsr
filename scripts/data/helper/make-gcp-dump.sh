#!/usr/bin/env bash

set -eux

filename="prod-dump.$(date +%s)"
dump_file="${filename}.gz"
if [[ -z "$(gcloud config list --format='value(core.account)')" ]]; then
  gcloud auth login
fi

gcloud config set project akvo-lumen

gcloud sql export sql rsr-prod-database-2024 "gs://akvo-rsr-db-dump/${dump_file}" --database=rsr_db
gsutil cp "gs://akvo-rsr-db-dump/$dump_file" /data/$dump_file
gsutil rm "gs://akvo-rsr-db-dump/$dump_file"

cd /data

# Point db_dump to the last dump
ln -nfs $dump_file db_dump.gz
