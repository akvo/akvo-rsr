#!/usr/bin/env bash

set -eu

NEW_USER=$1
NEW_DB_NAME=$2
NEW_USER_PASSWORD=$3
DB_HOST=$4
SUPER_USER=$5

psql_settings="--username=${SUPER_USER} --host=${DB_HOST}"

psql ${psql_settings} -c "CREATE USER $NEW_USER WITH ENCRYPTED PASSWORD '$NEW_USER_PASSWORD'";
psql ${psql_settings}  -c "CREATE DATABASE $NEW_DB_NAME OWNER $NEW_USER;"
psql ${psql_settings} --dbname=${NEW_DB_NAME} -c "ALTER SCHEMA public OWNER TO $NEW_USER;"

