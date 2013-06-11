#!/bin/bash
vagrant halt

TMP_FILE=`mktemp /tmp/tmphosts`
sed '/# localdev_rsr/d' /etc/hosts > $TMP_FILE
sudo mv $TMP_FILE /etc/hosts
