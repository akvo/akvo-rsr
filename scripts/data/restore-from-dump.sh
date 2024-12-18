#!/usr/bin/env bash

set -eu

DB_HOST="${1}"
RSR_DB_NAME="${2}"
RSR_USER="${3}"
DUMP_FILE="${4}"

echo ""

psql_settings=("--username=postgres" "--host=${DB_HOST}" "--dbname=${RSR_DB_NAME}" "--set" "ON_ERROR_STOP=on")

psql "${psql_settings[@]}" --command="DROP SCHEMA public CASCADE"
psql "${psql_settings[@]}" --command="CREATE SCHEMA public"
gunzip --stdout "${DUMP_FILE}" \
  | sed -e "/^REVOKE\ /d" \
  | sed -e "/^GRANT\ /d" \
  | sed -e "/ALTER DEFAULT PRIVILEGES FOR ROLE postgres/d" \
  | psql "${psql_settings[@]}"

# From here on, be sure to sync this with /ci/training-envs/templates/seedDatabase.yaml
# Don't shoot the messenger, it was like this before I arrived :(
echo "Setting the owner of public tables to ${RSR_USER}"
echo "
  select
    'Alter table '||t.schemaname||'.'||t.tablename ||' owner to ${RSR_USER};'
  from pg_tables t
  where schemaname='public';
" | psql "${psql_settings[@]}" \
  | grep Alter \
  | psql "${psql_settings[@]}"

echo "Setting the owner of public views to ${RSR_USER}"
echo "
  select
    'Alter view '||v.schemaname||'.'||v.viewname ||' owner to ${RSR_USER};'
  from pg_views v
  where schemaname='public';
" | psql "${psql_settings[@]}" \
  | grep Alter \
  | psql "${psql_settings[@]}"

echo "Granting access to all current and future public tables+sequences for user ${RSR_USER}"
echo "GRANT ALL ON schema public TO ${RSR_USER};" | psql "${psql_settings[@]}"
echo "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${RSR_USER};" | psql "${psql_settings[@]}"
echo "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ${RSR_USER};" | psql "${psql_settings[@]}"
