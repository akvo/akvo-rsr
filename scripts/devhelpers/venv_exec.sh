#!/bin/bash

if (( $# == 0 )); then
    echo \
        "This script lets you run executables in the vagrant vm's python venv from the root of the code directory.

For example, you can run manage.py as follows:
    $0 python manage.py runserver

Or coverage, as follows:
    $0 coverage run manage.py test akvo
"
    exit 1;
fi

PWD=$(pwd)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../vagrant

CONF=`mktemp vagrant-ssh-conf.XXXXXX`
vagrant ssh-config > $CONF
command=/var/akvo/rsr/venv/bin/$1
ssh -t -F $CONF default "sudo -u rsr bash -c 'cd /var/akvo/rsr/code && $command ${@:2}'"
rm $CONF

cd $PWD
