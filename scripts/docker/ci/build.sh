#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

# We don't care about migrations; __init__.py can have unused imports
# wsgi.py and scripts/ are handled below
log Running lint
./scripts/devhelpers/lint.sh

./scripts/docker/dev/wait-for-dependencies.sh

## This sometimes hangs if the makemigrations prompts. Latest 1.11 and 2.1 versions of Django have a --check option
log Running makemigrations
pypy manage.py makemigrations rsr | grep -i "no changes"

log Building node environment
pushd akvo/rsr/front-end
npm install
npm run dev
npm run test
popd

log Building assets
pypy manage.py collectstatic --noinput

log Running tests
COVERAGE_PROCESS_START=.coveragerc coverage run --parallel-mode --concurrency=multiprocessing manage.py test --parallel 4 akvo

log Coverage
coverage combine
coverage report -m

log Done
