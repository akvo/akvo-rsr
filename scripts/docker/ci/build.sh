#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

# We don't care about migrations; __init__.py can have unused imports
# wsgi.py and scripts/ are handled below
log Checking styles
flake8 --ignore=E501 --exclude=wsgi.py,scripts,migrations,__init__.py,node_modules akvo/
# Need environ to be set before other imports, etc. So, ignore E402
flake8 --ignore=E501,E402 akvo/scripts/
flake8 --ignore=E501,E402 akvo/wsgi.py

./scripts/docker/dev/wait-for-dependencies.sh

## This sometimes hangs if the makemigrations prompts. Latest 1.11 and 2.1 versions of Django have a --check option
log Running makemigrations
python manage.py makemigrations rsr | grep -i "no changes"

log Building node environment
pushd akvo/rsr/static
npm install
npm run dev
npm run test
popd

log Building assets
python manage.py collectstatic --noinput

log Running tests
coverage run manage.py test akvo

log Testing migrations
SLOW_TESTS=1 coverage run -a manage.py test akvo.rsr.tests.rest.test_migration

log Coverage
coverage report -m

log Done
