#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

# We don't care about migrations; __init__.py can have unused imports
# wsgi.py and scripts/ are handled below
log Checking styles
flake8 --ignore=E501 --exclude=wsgi.py,scripts,migrations,__init__.py akvo/
# Need environ to be set before other imports, etc. So, ignore E402
flake8 --ignore=E501,E402 akvo/scripts/
flake8 --ignore=E501,E402 akvo/wsgi.py

./scripts/docker/dev/wait-for-dependencies.sh

## This sometimes hangs if the makemigrations prompts. Latest 1.11 and 2.1 versions of Django have a --check option
ls -dlrt /var/log/akvo/
ls -lrt /var/log/akvo/*

log Running makemigrations
python manage.py makemigrations rsr | grep -i "no changes"

log Building assets
python manage.py collectstatic --noinput

log Running tests
coverage run manage.py test --verbosity 3 akvo

log Testing migrations
SLOW_TESTS=1 coverage run -a manage.py test --verbosity 3 akvo.rsr.tests.rest.test_migration

log Coverage
coverage report -m

log Done
