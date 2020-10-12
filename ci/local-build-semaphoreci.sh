#!/usr/bin/env bash
set -euo pipefail

# This is a script to run the semaphore build locally.
# 
# Usage:
#     DOCKER_PASSWORD=value ./ci/local-build-semaphoreci.sh
#
# The DOCKER_PASSWORD can be obtained from the password vault, or by getting a
# remote debug session of Semaphore CI.

export PROJECT_NAME=akvo-lumen
export CI_BRANCH=$(git branch --show-current)
export CI_TAG=
export CI_COMMIT=$(git rev-parse HEAD)
export TRAVIS_COMMIT="${CI_COMMIT}"
export DOCKER_USERNAME=akvodevops
export SKIP_DOCKER_PUSH=yes
export SKIP_BACKEND_TESTS=yes
./ci/build-semaphoreci.sh
