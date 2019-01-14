#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [ -z "$TRAVIS_COMMIT" ]; then
    export TRAVIS_COMMIT=local
fi

log Starting docker-compose
docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml up -d --build

log Running tests
docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml run web scripts/docker/dev/run-as-user.sh scripts/docker/ci/build.sh
#log Stopping docker-compose
#docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml down
log Done
