#!/usr/bin/env bash

## Instructions:
## You must have access to the Google akvo-lumen project and read access to the database.
## Then just run this script
set -eu

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run --rm -it -v "$DIR":/data -v ~/.config:/home/gkh/.config -v "$DIR"/helper/make-gcp-dump.sh:/data/commands.sh:ro kiwigrid/gcloud-kubectl-helm:2.12.3-234.0.0-88

## Run just these two commands if you already have a dump and you want to restore it.
docker-compose exec -e RSR_PASSWORD=rsrpasswddb rsrdbhost /data-scripts/restore-from-dump.sh /var/run/postgresql rsrdb rsruserdb /data-scripts/db_dump.gz
docker-compose restart web