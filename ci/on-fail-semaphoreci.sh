#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

export PROJECT_NAME=akvo-lumen
export TRAVIS_COMMIT=${SEMAPHORE_GIT_SHA}

if [ -f "log_docker_compose_ci_prod" ]; then
  docker-compose -p rsrciprod -f docker-compose.yaml -f docker-compose.ci.yaml -f docker-compose.ci.prod.images.yaml logs
fi