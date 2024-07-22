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

if [ -z "${IS_REPORTS_CONTAINER:-}" ] && [[ -z "${IS_WORKER:-}" ]] ; then
  log Migrating
  SKIP_REQUIRED_AUTH_GROUPS=true python manage.py migrate --noinput
  SKIP_REQUIRED_AUTH_GROUPS=true python manage.py createcachetable || true
fi

if [ -z "${IS_REPORTS_CONTAINER:-}" ] && [[ -z "${IS_WORKER:-}" ]] ; then
  # Legacy crontab tasks - being replaced by django-q schedules
  log Adding to crontab
  python manage.py crontab add
  log Making all environment vars available to cron jobs
  env >> /etc/environment
  log Starting cron
  /usr/sbin/cron

  # Sync re-occurring tasks to be run by django-q from the 90-finish.conf
  python manage.py sync_django_q_schedules
fi

if [[ -z "${IS_WORKER:-}" ]] ; then
  log Starting gunicorn in background
  gunicorn akvo.wsgi --max-requests 200 --workers 6 --timeout 300 --bind 0.0.0.0:${DJANGO_PORT:-8000} ${GUNICORN_DEBUG_ARGS:-} &
else
  log Starting probe server
  ./manage.py django_q_probettp &
  trap "echo 'Killing probe server'; kill $!" SIGINT

  log Starting worker process in background
  ./manage.py qcluster &
fi

child=$!
wait "$child"
