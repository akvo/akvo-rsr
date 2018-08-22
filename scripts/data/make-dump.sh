#!/usr/bin/env bash

set -eu

DB_HOST=$1
RSR_DB_NAME=$2
RSR_USER=$3
DUMP_FILE=$4

read -s -p "Password for ${RSR_USER} for DB ${RSR_DB_NAME}@${DB_HOST}: " PASSWORD

PGPASSWORD=${PASSWORD} pg_dump -n public --host=${DB_HOST} --username=${RSR_USER} ${RSR_DB_NAME} --no-owner --no-acl | gzip > "${DUMP_FILE}"