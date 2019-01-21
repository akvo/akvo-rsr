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

fetch=${5:false}
if [[ $fetch == true ]]; then
  /data-scripts/make-dump.sh "${DB_HOST}" "${RSR_DB_NAME}" "${RSR_DB_USER}" "${DUMP_FILE}"
fi

RSR_PASSWORD="${LOCAL_RSR_PASSWORD}" /data-scripts/restore-from-dump.sh "${LOCAL_DB_HOST}" \
    "${LOCAL_RSR_DB_NAME}" "${LOCAL_RSR_DB_USER}" "${DUMP_FILE}"
