#!/usr/bin/env bash

./scripts/docker/dev/wait-for-dependencies.sh

python manage.py migrate
#python manage.py collectstatic
python manage.py runserver 0.0.0.0:8000
