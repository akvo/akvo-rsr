#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [ -z "$TRAVIS_COMMIT" ]; then
    export TRAVIS_COMMIT=local
fi

log Creating Production Backend image
docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/rsr-backend:${TRAVIS_COMMIT} .
docker tag eu.gcr.io/${PROJECT_NAME}/rsr-backend:${TRAVIS_COMMIT} rsr-backend:develop

log Creating Production Nginx image
docker build nginx/ -t eu.gcr.io/${PROJECT_NAME}/rsr-nginx:${TRAVIS_COMMIT}

log Done
