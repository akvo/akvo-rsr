#!/usr/bin/env bash

set -e

CLI_ERR_MSG="Postgres CLI tools not available (psql). Using Postgres.app, look
at http://postgresapp.com/documentation/cli-tools.html. Aborting."
hash psql 2>/dev/null || { echo >&2 $CLI_ERR_MSG ; exit 1; }

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR


# Provision

SUPER_USER_PASSWORD=mysecretpassword NEW_USER_PASSWORD=rsrpasswddb /data-scripts/create-db.sh localhost postgres rsrdb rsruserdb

RSR_PASSWORD=rsrpasswddb /data-scripts/restore-from-dump.sh localhost rsrdb rsruserdb $(pwd)/pg.dump.gz

PGPASSWORD=mysecretpassword psql -c "ALTER USER rsruserdb CREATEDB;"
PGPASSWORD=mysecretpassword psql -d rsrdb -f $DIR/helpers/init.sql

echo ""
echo "----------"
echo "Done!"