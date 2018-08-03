#!/usr/bin/env bash

# Used in the docker-compose environment to make sure that Django starts after Postgres is ready

set -e

MAX_ATTEMPTS=120
ATTEMPTS=0
PG=""
SQL="SELECT * FROM thumbnail_kvstore"

echo "Waiting for PostgreSQL ..."
while [[ -z "${PG}" && "${ATTEMPTS}" -lt "${MAX_ATTEMPTS}" ]]; do
    PG=$(psql --username=rsruserdb --host=rsrdbhost --dbname=rsrdb -c "${SQL}" >/dev/null 2>&1 && echo "works!" || echo "")
    let ATTEMPTS+=1
    sleep 1
done

if [[ -z "${PG}" ]]; then
    echo "PostgreSQL is not available: "
    psql --username=rsruserdb --host=rsrdbhost --dbname=rsrdb -c "${SQL}"
    exit 1
fi

echo "PostgreSQL is ready!"