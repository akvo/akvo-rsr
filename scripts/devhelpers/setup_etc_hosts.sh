#!/bin/bash
echo "Hello. This script will edit /etc/hosts and therefore requires your administrator password."
sudo bash -c 'echo "192.168.50.101 rsr.localdev.akvo.org   # localdev_rsr" >> /etc/hosts'
