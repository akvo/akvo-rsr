#!/bin/bash
# Script to run the slow tests.

# To discard previously collected responses, and create a new canonical copy of
# the expected responses, use the --collect flag.

PWD=$(pwd)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../vagrant

if [ "${1}" = "--collect" ]; then
    rm ../akvo/rsr/tests/rest/expected_responses.json
fi

CONF=`mktemp vagrant-ssh-conf.XXXXXX`
vagrant ssh-config > $CONF
command="/var/akvo/rsr/venv/bin/python manage.py test -v 3 akvo.rsr.tests.rest.test_migration"
ssh -t -F $CONF default "sudo -u rsr bash -c 'cd /var/akvo/rsr/code && SLOW_TESTS=1 ${command}'"
rm $CONF

cd $PWD
