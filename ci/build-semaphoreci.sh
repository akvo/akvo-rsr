#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

function build {
  image_develop="$1:develop"
  image_branch="$1:${CI_BRANCH}"
  shift
  log Pulling "$image_branch"
  docker pull --quiet "$image_branch" || docker pull --quiet "$image_develop" || true

  log Building "$image_branch"
  docker build --cache-from="$image_branch" --cache-from "$image_develop" --rm=false -t "$image_branch" $*

  log Pushing "$image_branch" container
  docker push "$image_branch"
}

export PROJECT_NAME=akvo-lumen

if [ -z "$CI_COMMIT" ]; then
    export CI_COMMIT=local
fi

log Login to DockerHub
docker login -u="${DOCKER_USERNAME}" -p="${DOCKER_PASSWORD}"

build akvo/rsr-backend-dev -t rsr-backend:dev -f Dockerfile-dev .

log Starting docker-compose
docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml up -d --build 

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

log Creating Production Backend image_develop without code
docker build --rm=false --cache-from akvo/rsr-backend:prod-no-code -t akvo/rsr-backend:prod-no-code -f Dockerfile-prod-no-code . 

log Push akvo/rsr-backend:prod-no-code
docker push akvo/rsr-backend:prod-no-code

log Creating Production Backend image_develop with code
docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/rsr-backend:${CI_COMMIT} -t rsr-backend:prod . 

log Pulling akvo/rsr-backend:prod-no-code-with-nodejs
docker pull --quiet akvo/rsr-backend:prod-no-code-with-nodejs || true

log Creating npm base build image_develop
docker build --rm=false --cache-from akvo/rsr-backend:prod-no-code-with-nodejs -t akvo/rsr-backend:prod-no-code-with-nodejs -f Dockerfile-prod-no-code-with-nodejs . 

log Push akvo/rsr-backend:prod-no-code-with-nodejs
docker push akvo/rsr-backend:prod-no-code-with-nodejs

log Pulling akvo/rsr-backend:front-end
docker pull --quiet akvo/rsr-backend:front-end || true

log Creating front-end image_develop
docker build --rm=false --cache-from akvo/rsr-backend:front-end -t akvo/rsr-backend:front-end -f Dockerfile-front-end . 

log Push akvo/rsr-backend:front-end
docker push akvo/rsr-backend:front-end

log Pulling akvo/rsr-backend:dir
docker pull --quiet akvo/rsr-backend:dir || true

log Creating dir image_develop
docker build --rm=false --cache-from akvo/rsr-backend:dir -t akvo/rsr-backend:dir -f Dockerfile-dir . 

log Push akvo/rsr-backend:dir
docker push akvo/rsr-backend:dir

log Pulling akvo/rsr-backend:spa
docker pull --quiet akvo/rsr-backend:spa || true

log Creating spa image_develop
docker build --rm=false --cache-from akvo/rsr-backend:spa -t akvo/rsr-backend:spa -f Dockerfile-spa . 

log Push akvo/rsr-backend:spa
docker push akvo/rsr-backend:spa

log Creating Production Nginx image_develop
docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/rsr-nginx:${CI_COMMIT} -f Dockerfile-nginx .

log Starting docker-compose for end to end tests
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.prod.images.yaml up -d --build
log Running end to end tests
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.prod.images.yaml run --no-deps web scripts/docker/dev/run-as-user.sh scripts/docker/ci/end-to-end.sh

log Done