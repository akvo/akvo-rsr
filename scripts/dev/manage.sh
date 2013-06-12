#!/bin/bash

manage='/var/akvo/rsr/venv/bin/python /var/akvo/rsr/git/current/akvo/manage.py'

CONF=`mktemp vagrant-ssh-conf`
vagrant ssh-config > $CONF
ssh -t -F $CONF default "sudo -u rsr bash -c '$manage $@'"
rm $CONF