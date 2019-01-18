#!/usr/bin/env bash

set -eu

_term() {
  echo "Caught SIGTERM signal!"
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM

python manage.py migrate --noinput
python manage.py crontab add
## Making all environment vars available to cron jobs
env >> /etc/environment
/usr/sbin/cron
gunicorn akvo.wsgi --max-requests 200 --workers 5 --timeout 300 --bind 0.0.0.0:8000 &

child=$!
wait "$child"