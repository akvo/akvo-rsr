#!/usr/bin/env bash
set -euo pipefail

# Run the CI build locally, the way GitHub Actions runs it.
#
# Usage:
#     ./ci/local-build-ci.sh
#
# No registry credentials are needed: SKIP_DOCKER_PUSH is forced on below, so
# nothing is pushed and no login happens. Backend tests are skipped by
# default; set SKIP_BACKEND_TESTS=no to include them.

export PROJECT_NAME=akvo-lumen
export CI_BRANCH=$(git branch --show-current)
export CI_TAG=
export CI_COMMIT=$(git rev-parse HEAD)
export TRAVIS_COMMIT="${CI_COMMIT}"
export DOCKER_USERNAME=akvodevops
export SKIP_DOCKER_PUSH=yes
export SKIP_BACKEND_TESTS="${SKIP_BACKEND_TESTS:-yes}"
./ci/build-ci.sh
