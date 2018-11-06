#!/usr/bin/env bash

set -eu

DB_HOST="${1}"
RSR_DB_NAME="${2}"
RSR_USER="${3}"
DUMP_FILE="${4}"

read -r -s -p "Password for ${RSR_USER} for DB ${RSR_DB_NAME}@${DB_HOST}: " PASSWORD

echo ""
echo "Starting dump ..."

PGPASSWORD="${PASSWORD}" pg_dump --schema=public --host="${DB_HOST}" --username="${RSR_USER}" --no-acl --no-owner "${RSR_DB_NAME}" | gzip > "${DUMP_FILE}"
