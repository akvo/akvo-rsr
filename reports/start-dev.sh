#!/usr/bin/env bash

set -eu

_term() {
  echo "Caught SIGTERM signal!"
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM

./scripts/docker/dev/wait-for-dependencies.sh

python manage.py runserver 0.0.0.0:9000 &

child=$!
wait "$child"
