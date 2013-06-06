#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
HERE=`pwd`
cd $DIR/../../provisioning/vagrant/localdev/rsr
vagrant $@
cd $HERE
