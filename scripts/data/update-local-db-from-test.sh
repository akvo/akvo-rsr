#!/usr/bin/env bash

## Update local RSR DB from ElephantSQL test DB

DB_HOST="spicy-ugli.db.elephantsql.com"
RSR_DB_NAME="rsr_local_test"
RSR_DB_USER="rsr_local_test"
DUMP_FILE="rsr.dump.test.gz"

./update-local-db-from-elephantsql.sh "${DB_HOST}" "${RSR_DB_NAME}" "${RSR_DB_USER}" \
    /data-scripts/"${DUMP_FILE}"
