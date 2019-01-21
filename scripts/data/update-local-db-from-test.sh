#!/usr/bin/env bash

## Update local RSR DB from ElephantSQL test DB

# Usage:
# `update-local-db-from-test.sh -f`: fetch data from test and store in dump file `rsr.dump.test.gz`.
#   Replace existing rsr_db data with the fetched data.
# `update-local-db-from-test.sh`: Replace existing rsr_db data with the fetched data using an
#   existing `rsr.dump.test.gz` dump file.

DB_HOST="spicy-ugli.db.elephantsql.com"
RSR_DB_NAME="rsr_local_test"
RSR_DB_USER="rsr_local_test"
DUMP_FILE="rsr.dump.test.gz"

# -f flag indicates that data should be fetched from EleSQL, otherwise use existing dump file
fetch=false;
while getopts 'f' flag; do
  case "${flag}" in
    f) fetch=true  ;;
  esac
done

/data-scripts/update-local-db-from-elephantsql.sh "${DB_HOST}" "${RSR_DB_NAME}" "${RSR_DB_USER}" \
    /data-scripts/"${DUMP_FILE}" "$fetch"
