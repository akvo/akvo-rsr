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
if [ ! -f "/var/akvo/rsr/mediaroot/fake-migration-flag" ]; then
    log Running fake initial migrations at last here
    python manage.py migrate --fake-initial --noinput
    mkdir -p /var/akvo/rsr/mediaroot
    touch "/var/akvo/rsr/mediaroot/fake-migration-flag"
fi
python manage.py migrate --noinput

log Adding to crontab
python manage.py crontab add
log Making all environment vars available to cron jobs
env >> /etc/environment
log Starting cron
/usr/sbin/cron
log Starting gunicorn in background
gunicorn akvo.wsgi ${GUNICORN_DEBUG_ARGS:-} --max-requests 200 --workers 6 --timeout 300 --bind 0.0.0.0:8000 &

child=$!
wait "$child"
