#!/usr/bin/env bash

set -eu

_term() {
  echo "Caught SIGTERM signal!"
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM

./scripts/docker/dev/wait-for-dependencies.sh

python manage.py migrate --noinput
#python manage.py collectstatic

## Not running cron jobs in dev
#python manage.py crontab add
#env >> /etc/environment
#/usr/sbin/cron

python manage.py runserver 0.0.0.0:8000 &

child=$!
wait "$child"