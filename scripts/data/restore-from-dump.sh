#!/usr/bin/env bash

set -eu

DB_HOST=$1
RSR_DB_NAME=$2
RSR_USER=$3
DUMP_FILE=$4

if [ -z "${RSR_PASSWORD:-}" ]; then
    read -s -p "Password for user ${RSR_USER} for the new DB ${RSR_DB_NAME}@${DB_HOST}: " RSR_PASSWORD
fi

export PGPASSWORD=${RSR_PASSWORD}

echo ""

psql_settings="--username=${RSR_USER} --host=${DB_HOST} --dbname=${RSR_DB_NAME}"

psql ${psql_settings} -c 'DROP SCHEMA public CASCADE'
psql ${psql_settings} -c 'CREATE SCHEMA public'
gunzip -c "${DUMP_FILE}" | psql ${psql_settings} --set ON_ERROR_STOP=on


