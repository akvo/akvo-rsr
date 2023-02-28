#!/usr/bin/env bash
# Prepare and start the django server
set -eu

./scripts/docker/dev/wait-for-dependencies.sh

if [ -z "${IS_REPORTS_CONTAINER:-}" ] && [[ -z "${IS_WORKER:-}" ]] ; then
  pushd akvo/rsr/front-end
    if [[ ! -d "node_modules" ]]; then
      npm install
    fi
    if [[ ! -f "static/rsr/dist/vendors.js" ]]; then
      npm run dev
    fi
  popd

  SKIP_REQUIRED_AUTH_GROUPS=true python manage.py migrate --noinput
  SKIP_REQUIRED_AUTH_GROUPS=true python manage.py createcachetable || true

  python manage.py populate_local_db
  python manage.py loaddata --app rsr project_validations
fi

if [[ -z "${IS_WORKER:-}" ]] ; then
  python manage.py runserver 0.0.0.0:${DJANGO_PORT:-8000}
else
  ./manage.py qcluster
fi
