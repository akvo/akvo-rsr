#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

function docker_build {
  echo "$CI_BRANCH" > .branch_name
  branch_md5=$(checksum .branch_name)
  image_branch="${1}:${branch_md5}"
  image_develop="${1}:develop"
  image_local="${1}:local"
  shift
  other_params=$*
  log Pulling "$image_branch"
  docker pull --quiet "$image_branch" || docker pull --quiet "$image_develop" || true

  log Building "$image_branch"
  docker build --cache-from="$image_branch" --cache-from "$image_develop" --rm=false -t "$image_branch" -t "$image_local" $other_params

  log Pushing "$image_branch" container
  docker push "$image_branch"
}

export PROJECT_NAME=akvo-lumen

if [ -z "$CI_COMMIT" ]; then
    export CI_COMMIT=local
fi

log Login to DockerHub
docker login -u="${DOCKER_USERNAME}" -p="${DOCKER_PASSWORD}"

docker_build akvo/rsr-backend-dev -t rsr-backend:dev -f Dockerfile-dev .

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

docker_build akvo/rsr-backend-prod-no-code -f Dockerfile-prod-no-code .

log Creating Production Backend image with code
docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/rsr-backend:${CI_COMMIT} -t rsr-backend:prod -f Dockerfile-prod .

docker_build akvo/rsr-backend-prod-no-code-with-nodejs -f Dockerfile-prod-no-code-with-nodejs .
docker_build akvo/rsr-backend-front-end -f Dockerfile-front-end .
docker_build akvo/rsr-backend-dir -f Dockerfile-dir .
docker_build akvo/rsr-backend-spa -f Dockerfile-spa .

log Creating Production Nginx image
docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/rsr-nginx:${CI_COMMIT} -f Dockerfile-nginx .

log Starting docker-compose for end to end tests
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.prod.images.yaml up -d --build
log Running end to end tests
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.prod.images.yaml run --no-deps web scripts/docker/dev/run-as-user.sh scripts/docker/ci/end-to-end.sh

log Done