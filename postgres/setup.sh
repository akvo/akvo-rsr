#!/usr/bin/env bash

set -e

CLI_ERR_MSG="Postgres CLI tools not available (psql). Using Postgres.app, look
at http://postgresapp.com/documentation/cli-tools.html. Aborting."
hash psql 2>/dev/null || { echo >&2 $CLI_ERR_MSG ; exit 1; }

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR


# Provision

## Create lumen role
psql -c "CREATE ROLE rsruserdb WITH PASSWORD 'rsrpasswddb' CREATEDB LOGIN;"

createdb rsrdb -E UTF8 -O rsruserdb -T template0
psql --set ON_ERROR_STOP=on rsrdb < pg.dump

psql -d rsrdb -f $DIR/helpers/init.sql

echo ""
echo "----------"
echo "Done!"