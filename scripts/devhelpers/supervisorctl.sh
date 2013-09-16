#!/bin/bash

PWD=$(pwd)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../vagrant

CONF=`mktemp vagrant-ssh-conf`
vagrant ssh-config > $CONF
ssh -t -F $CONF default "sudo supervisorctl"
rm $CONF

cd $PWD
