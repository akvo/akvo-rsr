#!/usr/bin/env bash

set -eu

echo "Copying docker-compose local dev settings from ./scripts/docker/dev/50-docker-local-dev.conf to ./akvo/settings/50-docker-local-dev.conf"
cp ./scripts/docker/dev/50-docker-local-dev.conf ./akvo/settings/50-docker-local-dev.conf

./scripts/docker/dev/wait-for-dependencies.sh

python manage.py migrate --noinput
#python manage.py collectstatic
python manage.py runserver 0.0.0.0:8000
