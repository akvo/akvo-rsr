#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - START INFO - $*"
}

_term() {
  echo "Caught SIGTERM signal!"
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM

if [ ! -z "${WAIT_FOR_DEPENDENCIES:-}" ]; then
    ./wait-for-dependencies.sh
fi

log Migrating
python manage.py migrate --noinput

log Adding to crontab
python manage.py crontab add
log Making all environment vars available to cron jobs
env >> /etc/environment
log Starting cron
/usr/sbin/cron
log Starting gunicorn in background
gunicorn akvo.wsgi --max-requests 200 --workers 6 --timeout 300 --bind 0.0.0.0:8000 ${GUNICORN_DEBUG_ARGS:-} &

child=$!
wait "$child"
