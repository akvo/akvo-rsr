#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$DIR/vagrant.sh halt

TMP_FILE=`mktemp /tmp/tmphosts`
sed '/# localdev_rsr/d' /etc/hosts > $TMP_FILE
sudo mv $TMP_FILE /etc/hosts
