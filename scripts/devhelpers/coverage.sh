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
  # A backup is available with the .bak extension
  GIT_ROOT="$(git rev-parse --show-toplevel)"
  cd $GIT_ROOT
  sed -i.bak -e "s|/var/akvo/rsr/code|${GIT_ROOT}|g" coverage.xml
else
  COVERAGE_PROCESS_START=.coveragerc \
    coverage run --parallel-mode --concurrency=multiprocessing \
    manage.py test --keepdb --parallel 4 akvo

  coverage combine
  mkdir -p coverage
  coverage report --skip-empty --skip-covered
  coverage html --skip-empty --skip-covered
  coverage xml

  # Output the new lines aren't covered by this branch
  diff-cover coverage.xml \
    --html-report coverage/diff.html \
    --compare-branch origin/master \
    --show-uncovered
fi
