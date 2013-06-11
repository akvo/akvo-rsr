#!/bin/bash
sudo bash -c 'echo "192.168.50.101 rsr.localdev.akvo.org   # localdev_rsr" >> /etc/hosts'
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$DIR/vagrant.sh up
