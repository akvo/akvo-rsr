#!/usr/bin/env bash

## Instructions:
## You must have access to the Google akvo-lumen project and read access to the database.
## Then just run this script
set -eu

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONFIG_DIR="${DIR}/config/gcloud"
DUMP_DIR="${DIR}/dumps"

# Create dirs and make sure they are world writable
# The docker users might have different IDs
for _dir in "$CONFIG_DIR" "$DUMP_DIR"; do
  mkdir -p "$_dir"
  chmod 777 "$_dir"
done

# Dump into ./dumps/
docker run \
  --rm \
  -it \
  -v "$DUMP_DIR":/data \
  -v "$CONFIG_DIR":/root/.config/gcloud \
  -v "$DIR"/helper/make-gcp-dump.sh:/commands.sh:ro \
    gcr.io/google.com/cloudsdktool/google-cloud-cli bash /commands.sh

## Run just these two commands if you already have a dump and you want to restore it.
docker-compose exec \
  rsrdbhost \
    /data-scripts/restore-from-dump.sh \
      /var/run/postgresql \
      rsrdb \
      rsruserdb \
      /data-scripts/dumps/db_dump.gz
docker-compose restart web