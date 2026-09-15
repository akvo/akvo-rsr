#!/usr/bin/env bash

set -eu

DB_HOST="${1}"
RSR_DB_NAME="${2}"
RSR_USER="${3}"
DUMP_FILE="${4}"

echo ""

psql_settings=("--username=postgres" "--host=${DB_HOST}" "--dbname=${RSR_DB_NAME}" "--set" "ON_ERROR_STOP=on")

# The August 2025 PostgreSQL security releases (14.19, 15.14, 16.10, 17.6 and later) added
# the \restrict and \unrestrict meta-commands, and pg_dump now wraps every dump in them so
# that a dump cannot smuggle psql meta-commands past the restore. A dump taken by one of
# those newer pg_dumps therefore aborts on its very first line when restored with an older
# psql:
#
#     invalid command \restrict
#
# Cloud SQL exports with a current pg_dump, so this bites whenever the local postgres image
# lags behind production. Ask this psql whether it understands the pair rather than checking
# version numbers - the release that introduced them differs per major version. Where it
# does, the commands are left in place and keep doing their job; only an older psql that
# would choke on them gets them stripped.
if printf '%s\n' '\restrict rsr_feature_probe' '\unrestrict rsr_feature_probe' \
     | psql "${psql_settings[@]}" --quiet >/dev/null 2>&1; then
  restrict_filter=(cat)
else
  echo "This psql ($(psql --version | awk '{print $3}')) predates \\restrict; stripping it from the dump."
  echo "Consider matching the local postgres version to production instead."
  restrict_filter=(sed -e "/^\\\\restrict /d" -e "/^\\\\unrestrict /d")
fi

psql "${psql_settings[@]}" --command="DROP SCHEMA public CASCADE"
psql "${psql_settings[@]}" --command="CREATE SCHEMA public"
gunzip --stdout "${DUMP_FILE}" \
  | "${restrict_filter[@]}" \
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
