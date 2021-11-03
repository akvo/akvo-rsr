#!/usr/bin/env bash
# Prepare and start the django server
set -eu

./scripts/docker/dev/wait-for-dependencies.sh

if [ -z "${IS_REPORTS_CONTAINER:-}" ]; then
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
fi


python manage.py runserver 0.0.0.0:${DJANGO_PORT:-8000}
