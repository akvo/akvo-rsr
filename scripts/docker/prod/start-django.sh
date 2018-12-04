#!/usr/bin/env bash

set -eu
python manage.py migrate --noinput
# python manage.py runserver 0.0.0.0:8000
gunicorn akvo.wsgi --access-logfile '-' --access-logformat '%(p)s %(l)s %(t)s "%(U)s%(q)s" %(s)s %(b)s %(L)s' --max-requests 200 --workers 5 --backlog 1 --timeout 300 --bind 0.0.0.0:8000