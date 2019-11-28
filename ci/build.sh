#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [ -z "$TRAVIS_COMMIT" ]; then
    export TRAVIS_COMMIT=local
fi

log Building dev image
docker build --rm=false -t rsr-backend:dev -f Dockerfile-dev .

log Starting docker-compose
docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml up -d --build

log Running tests
docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml run web scripts/docker/dev/run-as-user.sh scripts/docker/ci/build.sh
#log Stopping docker-compose
#docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml down

log Preparing deploy info file
echo "DEPLOY_COMMIT_FULL_ID = '`git rev-parse HEAD`'" > ._66_deploy_info.conf
echo "DEPLOY_COMMIT_ID = '`git rev-parse --short HEAD`'" >> ._66_deploy_info.conf
echo "DEPLOY_BRANCH = '$TRAVIS_BRANCH'" >> ._66_deploy_info.conf
echo "DEPLOY_TAG = '$TRAVIS_TAG'" >> ._66_deploy_info.conf

log Creating Production Backend image
docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/rsr-backend:${TRAVIS_COMMIT} -t rsr-backend:prod .

log Creating Production Nginx image
docker build --rm=false nginx/ -t eu.gcr.io/${PROJECT_NAME}/rsr-nginx:${TRAVIS_COMMIT}

log Starting docker-compose for end to end tests
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.prod.images.yaml up -d --build
log Running end to end tests
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.prod.images.yaml run --no-deps web scripts/docker/dev/run-as-user.sh scripts/docker/ci/end-to-end.sh

log Done
