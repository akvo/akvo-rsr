#!/usr/bin/env bash

set -eu
python manage.py migrate
# python manage.py runserver 0.0.0.0:8000
gunicorn akvo.wsgi --max-requests 200 --workers 5 --timeout 300 --bind 127.0.0.1:8001