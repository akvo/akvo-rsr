#!/usr/bin/env bash
set -eu

if [[ "${CI_TAG:-}" =~ promote-.* ]]; then
    echo "Skipping build as it is a prod promotion"
    exit 0
fi

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

function docker_build {
  echo "$CI_BRANCH" > .branch_name
  branch_md5=$(checksum .branch_name)
  image_branch="${1}:${branch_md5}"
  echo "master" > .branch_name
  master_branch_md5=$(checksum .branch_name)
  image_master="${1}:${master_branch_md5}"
  image_local="${1}:local"
  shift
  other_params=$*
  log Pulling "$image_branch"
  docker pull --quiet "$image_branch" || docker pull --quiet "$image_master" || true

  log Building "$image_branch"
  docker build --cache-from="$image_branch" --cache-from "$image_master" --rm=false -t "$image_branch" -t "$image_local" $other_params

  if [[ ! "${SKIP_DOCKER_PUSH:-}" = yes ]]; then
    log Pushing "$image_branch" container
    docker push "$image_branch"
  fi
}

export PROJECT_NAME=akvo-lumen

if [ -z "$CI_COMMIT" ]; then
    export CI_COMMIT=local
fi

if [[ ! "${SKIP_DOCKER_PUSH:-}" = yes ]]; then
  log Login to DockerHub
  docker login -u="${DOCKER_USERNAME}" -p="${DOCKER_PASSWORD}"
fi

docker_build akvo/rsr-backend-dev -t rsr-backend:dev -f Dockerfile-dev .
docker_build akvo/rsr-puppeteer-dev -t rsr-puppeteer:dev -f Dockerfile-e2e .


if [[ ! "${SKIP_BACKEND_TESTS:-}" = yes ]]; then
  log Starting docker-compose
  docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml up -d --build

  log Running tests
  docker-compose -p rsrci -f docker-compose.yaml -f docker-compose.ci.yaml exec -T web scripts/docker/dev/run-as-user.sh scripts/docker/ci/build.sh
fi


log Preparing deploy info file
echo "DEPLOY_COMMIT_FULL_ID = '`git rev-parse HEAD`'" > ._66_deploy_info.conf
echo "DEPLOY_COMMIT_ID = '`git rev-parse --short HEAD`'" >> ._66_deploy_info.conf
echo "DEPLOY_BRANCH = '$CI_BRANCH'" >> ._66_deploy_info.conf

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
touch "log_docker_compose_ci_prod"
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.yaml -f docker-compose.ci.prod.images.yaml up -d --build
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.yaml -f docker-compose.ci.prod.images.yaml ps
log Running end to end tests
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.yaml -f docker-compose.ci.prod.images.yaml exec -T web scripts/docker/dev/run-as-user.sh scripts/docker/ci/end-to-end.sh
docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.yaml -f docker-compose.ci.prod.images.yaml exec -T puppeteer npm run test -- --ci
rm "log_docker_compose_ci_prod"

log Done
