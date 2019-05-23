#!/usr/bin/env bash

set -eu

DB_HOST=localhost
RSR_DB_NAME=rsrdb
RSR_USER=rsruserdb
DUMP_FILE=$1
PASSWORD=rsrpasswddb


echo ""
echo "Starting dump ..."

PGPASSWORD="${PASSWORD}" pg_dump --schema=public --host="${DB_HOST}" --username="${RSR_USER}" --no-acl --schema-only --no-owner "${RSR_DB_NAME}" > "${DUMP_FILE}"
