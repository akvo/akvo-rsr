#!/usr/bin/env bash

set -eu

_term() {
  echo "Caught SIGTERM signal!"
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM

./scripts/docker/dev/wait-for-dependencies.sh

if [ -z "${IS_REPORTS_CONTAINER:-}" ]; then
  pushd akvo/rsr/front-end
  if [[ ! -d "node_modules" ]]; then
    npm install
  fi
  if [[ ! -f "static/rsr/dist/vendors.js" ]]; then
    npm run dev
  fi
  npm run devw&
  popd

  pushd akvo/rsr/spa
  (
  npm install
  npm start
  ) &
  popd

  pushd akvo/rsr/dir
  (
      npm install
      npm start
  ) &
  popd
fi

if [ -z "${IS_REPORTS_CONTAINER:-}" ]; then
    SKIP_REQUIRED_AUTH_GROUPS=true pypy manage.py migrate --noinput
    SKIP_REQUIRED_AUTH_GROUPS=true pypy manage.py createcachetable || true
fi
#pypy manage.py collectstatic

## Not running cron jobs in dev
#pypy manage.py crontab add
#env >> /etc/environment
#/usr/sbin/cron

if [ -z "${IS_REPORTS_CONTAINER:-}" ]; then
    pypy manage.py populate_local_db
fi

pypy manage.py runserver 0.0.0.0:${DJANGO_PORT:-8000} &

child=$!
wait "$child"
