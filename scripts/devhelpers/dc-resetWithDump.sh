#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")" # Move to script dir
cd "$(git rev-parse --show-toplevel)" # Move to git root

./scripts/devhelpers/dc-reset.sh

sleep 20
docker-compose exec   rsrdbhost     /data-scripts/restore-from-dump.sh       /var/run/postgresql       rsrdb       rsruserdb       /data-scripts/dumps/db_dump.gz
docker-compose up -d
