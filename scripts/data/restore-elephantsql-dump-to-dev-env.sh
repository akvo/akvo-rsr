#!/usr/bin/env bash

## Instructions:
### 1. Download backup from ElephantSQL to this directory
### 2. docker-compose exec rsrdbhost /data-scripts/restore-elephantsql-dump-to-dev-env.sh /data-scripts/filename.lzo
### 3. Restart RSR: docker-compose restart web

set -eu

DB_HOST="localhost"
RSR_DB_NAME="rsrdb"
RSR_DB_SUPERUSER="postgres"
RSR_DB_USER="rsruserdb"
DUMP_FILE="$1"
RSR_PASSWORD=mysecretpassword

export PGPASSWORD="${RSR_PASSWORD}"

psql_settings=("--username=${RSR_DB_SUPERUSER}" "--host=${DB_HOST}" "--dbname=${RSR_DB_NAME}" "--set" "ON_ERROR_STOP=on")

psql "${psql_settings[@]}" --command="DROP SCHEMA public CASCADE"
psql "${psql_settings[@]}" --command="CREATE SCHEMA public"

dump_owner=$(lzop -cd "${DUMP_FILE}" | head -n 2000 | grep "Owner: [a-z].*" -o | head -n 1 | cut -f 2 -d\ )

if [[ -z "${dump_owner}" ]]; then
    echo "Could not guess the owner of the dump file"
    exit 2
fi

lzop -cd "${DUMP_FILE}" | sed -e "s/${dump_owner}/${RSR_DB_USER}/" | sed -e "/^GRANT/d" | sed -e "/ALTER DEFAULT PRIVILEGES/d" | psql "${psql_settings[@]}"

psql "${psql_settings[@]}" --dbname="${RSR_DB_NAME}" --command="ALTER SCHEMA public OWNER TO ${RSR_DB_USER};"
psql "${psql_settings[@]}" --command="ALTER DATABASE ${RSR_DB_NAME} OWNER TO ${RSR_DB_USER};"