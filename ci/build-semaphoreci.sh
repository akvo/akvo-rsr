#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [ -z "$CI_COMMIT" ]; then
    export CI_COMMIT=local
fi

log Pulling akvo/rsr-backend:dev
docker pull --quiet akvo/rsr-backend:dev || true

log Building dev image
docker build --cache-from akvo/rsr-backend:dev --rm=false -t akvo/rsr-backend:dev -t rsr-backend:dev -f Dockerfile-dev .  | while read line ; do if [[ $line =~ ^Step ]]; then log "$line"; fi; done;

log Starting docker-compose
docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml up -d --build | while read line ; do if [[ $line =~ ^Step ]]; then log "$line"; fi; done;

log Running tests
docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml run web scripts/docker/dev/run-as-user.sh scripts/docker/ci/build.sh
#log Stopping docker-compose
#docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml down

log Preparing deploy info file
echo "DEPLOY_COMMIT_FULL_ID = '`git rev-parse HEAD`'" > ._66_deploy_info.conf
echo "DEPLOY_COMMIT_ID = '`git rev-parse --short HEAD`'" >> ._66_deploy_info.conf
echo "DEPLOY_BRANCH = '$CI_BRANCH'" >> ._66_deploy_info.conf
echo "DEPLOY_TAG = '$CI_TAG'" >> ._66_deploy_info.conf

log Pulling akvo/rsr-backend:prod-no-code
docker pull --quiet akvo/rsr-backend:prod-no-code || true

log Creating Production Backend image without code
docker build --rm=false --cache-from akvo/rsr-backend:prod-no-code -t akvo/rsr-backend:prod-no-code Dockerfile-prod-no-code | while read line ; do if [[ $line =~ ^Step ]]; then log "$line"; fi; done;

log Creating Production Backend image with code
docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/rsr-backend:${CI_COMMIT} -t rsr-backend:prod . | while read line ; do if [[ $line =~ ^Step ]]; then log "$line"; fi; done;

log Creating Production Nginx image
docker build --rm=false nginx/ -t eu.gcr.io/${PROJECT_NAME}/rsr-nginx:${CI_COMMIT} | while read line ; do if [[ $line =~ ^Step ]]; then log "$line"; fi; done;

log Starting docker-compose for end to end tests
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.prod.images.yaml up -d --build
log Running end to end tests
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.prod.images.yaml run --no-deps web scripts/docker/dev/run-as-user.sh scripts/docker/ci/end-to-end.sh

log Pushing rsr-backend:dev container
docker login -u="${DOCKER_USERNAME}" -p="${DOCKER_PASSWORD}"
docker push akvo/rsr-backend:dev
docker push akvo/rsr-backend:prod-no-code
log Done