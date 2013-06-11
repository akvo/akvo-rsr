#!/bin/bash

manage='/apps/rsr/venv/bin/python /apps/rsr/checkout/akvo/manage.py'

CONF=`mktemp vagrant-ssh-conf`
echo $CONF
vagrant ssh-config > $CONF
ssh -t -F $CONF default "sudo -u rsr bash -c '$manage $@'"
rm $CONF