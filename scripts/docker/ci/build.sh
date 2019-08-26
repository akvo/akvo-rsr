#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

# We don't care about migrations; __init__.py can have unused imports
# wsgi.py and scripts/ are handled below
log Checking styles
flake8 --ignore=E501 --exclude=wsgi.py,scripts,migrations,__init__.py,node_modules,akvo/rsr/views/translations.py akvo/
# Need environ to be set before other imports, etc. So, ignore E402
flake8 --ignore=E501,E402 akvo/scripts/
flake8 --ignore=E501,E402 akvo/wsgi.py

./scripts/docker/dev/wait-for-dependencies.sh

## This sometimes hangs if the makemigrations prompts. Latest 1.11 and 2.1 versions of Django have a --check option
log Running makemigrations
python manage.py makemigrations rsr | grep -i "no changes"

log Building node environment
pushd akvo/rsr/front-end
npm install
npm run dev
npm run test
popd

log Building assets
python manage.py collectstatic --noinput

log Running tests
COVERAGE_PROCESS_START=.coveragerc coverage run --parallel-mode --concurrency=multiprocessing manage.py test --parallel 4 akvo

#coverage report -m || true

log Testing migrations
COVERAGE_PROCESS_START=.coveragerc SLOW_TESTS=1 coverage run --parallel-mode manage.py test akvo.rsr.tests.rest.test_migration

log Coverage
coverage combine
coverage report -m

log Done
