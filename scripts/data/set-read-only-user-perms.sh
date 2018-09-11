#!/usr/bin/env bash

set -eu

DB_HOST=$1
SUPER_USER=$2
DB_NAME=$3
RO_USER=$4

if [ -z "${SUPER_USER_PASSWORD:-}" ]; then
    read -s -p "Password for the **super** user ${SUPER_USER} for host ${DB_HOST}: " SUPER_USER_PASSWORD
fi

echo ""

export PGPASSWORD=${SUPER_USER_PASSWORD}

psql_settings="--username=${SUPER_USER} --host=${DB_HOST} --dbname=${DB_NAME}"

psql ${psql_settings} -c "GRANT USAGE ON SCHEMA public TO $RO_USER;";
psql ${psql_settings} -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO $RO_USER;";
psql ${psql_settings} -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO $RO_USER;";