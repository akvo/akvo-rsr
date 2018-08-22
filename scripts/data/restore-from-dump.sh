#!/usr/bin/env bash

set -eu

RSR_USER=$1
RSR_DB_NAME=$2
DB_HOST=$3
DUMP_FILE=$4

psql_settings="--username=${RSR_USER} --host=${DB_HOST} --dbname=${RSR_DB_NAME}"

psql ${psql_settings} -c 'DROP SCHEMA public CASCADE'
psql ${psql_settings} -c 'CREATE SCHEMA public'
psql ${psql_settings} --set ON_ERROR_STOP=on < "${DUMP_FILE}"


