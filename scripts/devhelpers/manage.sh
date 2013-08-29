#!/bin/bash

PWD=$(pwd)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../vagrant

CONF=`mktemp vagrant-ssh-conf`
vagrant ssh-config > $CONF
manage='/var/akvo/rsr/venv/bin/python /var/akvo/rsr/git/current/akvo/manage.py'
ssh -t -F $CONF default "sudo -u rsr bash -c '$manage $@'"
rm $CONF

cd $PWD
