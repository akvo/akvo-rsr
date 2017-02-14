#!/bin/bash

PWD=$(pwd)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../vagrant

CONF=`mktemp vagrant-ssh-conf.XXXXXX`
vagrant ssh-config > $CONF
manage='/var/akvo/rsr/venv/bin/python /var/akvo/rsr/code/manage.py'
ssh -t -F $CONF default "sudo -u rsr bash -c 'LC_ALL=C $manage $@'"
rm $CONF

cd $PWD
