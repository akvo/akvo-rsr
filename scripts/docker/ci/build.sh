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
python manage.py makemigrations --check rsr

log Building node environment
pushd akvo/rsr/front-end
npm install
npm run dev
npm run test
popd

pushd akvo/rsr/spa
npm run test -- --ci --passWithNoTests
popd

pushd akvo/rsr/dir
npm run test -- --ci --passWithNoTests
popd

log Building assets
python manage.py collectstatic --noinput

log Running tests
# Run one test to run the test migration
export PYTHONWARNINGS=all
./manage.py test --keepdb akvo.codelists.tests.test_iati_codelist_generator.CodelistGeneratorTestCase
export -n PYTHONWARNINGS
# Run all the tests with the existing database
# Functions to make sure --keepdb works
COVERAGE_PROCESS_START=.coveragerc \
  coverage run --parallel-mode --concurrency=multiprocessing \
  manage.py test --keepdb --parallel 4 akvo

log Coverage
coverage combine
coverage report -m

# Push coverage to coveralls.io
if [[ -n "${COVERALLS_REPO_TOKEN}" ]] ; then
  coveralls debug
fi

log Done
