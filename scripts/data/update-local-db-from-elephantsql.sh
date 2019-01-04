#!/usr/bin/env bash

## Update local docker RSR DB

DB_HOST="${1}"
RSR_DB_NAME="${2}"
RSR_DB_USER="${3}"
DUMP_FILE="${4}"

LOCAL_RSR_PASSWORD="rsrpasswddb"
LOCAL_DB_HOST="localhost"
LOCAL_RSR_DB_NAME="rsrdb"
LOCAL_RSR_DB_USER="rsruserdb"

./make-dump.sh "${DB_HOST}" "${RSR_DB_NAME}" "${RSR_DB_USER}" "${DUMP_FILE}"

RSR_PASSWORD="${LOCAL_RSR_PASSWORD}" ./restore-from-dump.sh "${LOCAL_DB_HOST}" \
    "${LOCAL_RSR_DB_NAME}" "${LOCAL_RSR_DB_USER}" "${DUMP_FILE}"
