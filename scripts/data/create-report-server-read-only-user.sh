#!/usr/bin/env bash

set -eu

DB_HOST=$1
SUPER_USER=$2
DB_NAME=$3
NEW_USER=$4

if [ -z "${NEW_USER_PASSWORD:-}" ]; then
    read -s -p "Password for the new read-only user ${NEW_USER} for the DB ${DB_NAME}@${DB_HOST}: " NEW_USER_PASSWORD
fi

echo ""

if [ -z "${SUPER_USER_PASSWORD:-}" ]; then
    read -s -p "Password for the **super** user ${SUPER_USER} for host ${DB_HOST}: " SUPER_USER_PASSWORD
fi

echo ""

psql_settings="--username=${SUPER_USER} --host=${DB_HOST}"

export PGPASSWORD=${SUPER_USER_PASSWORD}

psql ${psql_settings} -c "CREATE USER $NEW_USER WITH ENCRYPTED PASSWORD '$NEW_USER_PASSWORD'";

export SUPER_USER_PASSWORD=${SUPER_USER_PASSWORD}

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
"${SCRIPT_DIR}/set-read-only-user-perms.sh" $DB_HOST $SUPER_USER $DB_NAME $NEW_USER