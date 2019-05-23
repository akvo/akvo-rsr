#!/usr/bin/env bash

set -eu

DB_HOST="localhost"
RSR_DB_NAME="rsrdb"
RSR_DB_SUPERUSER="postgres"
RSR_USER="rsruserdb"
RSR_PASSWORD=mysecretpassword

DUMP_FILE=migration-script.sql

export PGPASSWORD="${RSR_PASSWORD}"

echo ""

psql_settings=("--username=${RSR_USER}" "--host=${DB_HOST}" "--dbname=${RSR_DB_NAME}" "--set" "ON_ERROR_STOP=on" "--single-transaction")

cat $DUMP_FILE | psql "${psql_settings[@]}"