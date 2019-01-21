#!/usr/bin/env bash

## Update local RSR DB from ElephantSQL live DB

# Usage:
# `update-local-db-from-live.sh -f`: fetch data from live and store in dump file `rsr.dump.live.gz`.
#   Replace existing rsr_db data with the fetched data.
# `update-local-db-from-live.sh`: Replace existing rsr_db data with the fetched data using an
#   existing `rsr.dump.live.gz` dump file.

DB_HOST="seasoned-sharon-fruit.db.elephantsql.com"
RSR_DB_NAME="rsr_db"
RSR_DB_USER="rsr_db_user"
DUMP_FILE="rsr.dump.live.gz"

# -f flag indicates that data should be fetched from EleSQL, otherwise use existing dump file
fetch=false;
while getopts 'f' flag; do
  case "${flag}" in
    f) fetch=true  ;;
  esac
done

/data-scripts/update-local-db-from-elephantsql.sh "${DB_HOST}" "${RSR_DB_NAME}" "${RSR_DB_USER}" \
    /data-scripts/"${DUMP_FILE}" "$fetch"
