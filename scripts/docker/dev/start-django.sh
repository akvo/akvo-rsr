#!/usr/bin/env bash

set -eu

_term() {
  echo "Caught SIGTERM signal!"
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM

./scripts/docker/dev/wait-for-dependencies.sh

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
if [[ ! -d "node_modules" ]]; then
  npm install
fi
npm start &
popd

python manage.py migrate --noinput
#python manage.py collectstatic

## Not running cron jobs in dev
#python manage.py crontab add
#env >> /etc/environment
#/usr/sbin/cron

python manage.py runserver 0.0.0.0:8000 &

child=$!
wait "$child"
