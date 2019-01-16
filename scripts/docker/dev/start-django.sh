#!/usr/bin/env bash

set -eu

./scripts/docker/dev/wait-for-dependencies.sh

python manage.py migrate --noinput
#python manage.py collectstatic

## Not running cron jobs in dev
#python manage.py crontab add
#env >> /etc/environment
#/usr/sbin/cron

python manage.py runserver 0.0.0.0:8000
