#!/usr/bin/env bash

set -eu
python manage.py migrate --noinput
# python manage.py runserver 0.0.0.0:8000
gunicorn akvo.wsgi --capture-output --max-requests 200 --workers 5 --timeout 300 --bind 0.0.0.0:8000