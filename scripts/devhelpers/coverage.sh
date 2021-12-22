#!/bin/bash
set -euo pipefail


function log {
   echo "$(date +"%T") - coverage.sh - $*"
}

# Detect if executed outside of docker to run script in docker
if [[ ! -e /.dockerenv ]] ; then
  docker-compose run --rm web scripts/devhelpers/coverage.sh

  # Replace docker paths with local paths in XML
  # Makes it usable by other tools
  GIT_ROOT="$(git rev-parse --show-toplevel)"
  cd $GIT_ROOT
  sed -i -e "s|/var/akvo/rsr/code|${GIT_ROOT}|g" coverage.xml
else
  COVERAGE_PROCESS_START=.coveragerc \
    coverage run --parallel-mode --concurrency=multiprocessing \
    manage.py test --keepdb --parallel 4 akvo

  coverage combine
  coverage report --skip-empty --skip-covered
  coverage html --skip-empty --skip-covered
  coverage xml
fi
