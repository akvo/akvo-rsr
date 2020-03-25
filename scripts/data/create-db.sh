#!/usr/bin/env bash

set -eu

DB_HOST="${1}"
SUPER_USER="${2}"
NEW_DB_NAME="${3}"
NEW_USER="${4}"

if [[ -z "${NEW_USER_PASSWORD:-}" ]]; then
    read -r -s -p "Password for the new user ${NEW_USER} for the new DB ${NEW_DB_NAME}@${DB_HOST}: " NEW_USER_PASSWORD
fi

echo ""

if [[ -z "${SUPER_USER_PASSWORD:-}" ]]; then
    read -r -s -p "Password for the **super** user ${SUPER_USER} for host ${DB_HOST}: " SUPER_USER_PASSWORD
fi

echo ""

psql_settings=("--username=${SUPER_USER}" "--host=${DB_HOST}")

export PGPASSWORD="${SUPER_USER_PASSWORD}"

psql "${psql_settings[@]}" --command="CREATE USER ${NEW_USER} WITH ENCRYPTED PASSWORD '${NEW_USER_PASSWORD}';"
psql "${psql_settings[@]}" --command="GRANT ${NEW_USER} TO ${SUPER_USER};"
psql "${psql_settings[@]}" --command="CREATE DATABASE ${NEW_DB_NAME} OWNER ${NEW_USER};"
psql "${psql_settings[@]}" --dbname="${NEW_DB_NAME}" --command="ALTER SCHEMA public OWNER TO ${NEW_USER};"

# Disable create objects and grant just to the db owner
psql "${psql_settings[@]}" --dbname="${NEW_DB_NAME}" --command="REVOKE CREATE ON SCHEMA public FROM public;"
