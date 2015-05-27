#!/bin/bash
echo "Hello. This script will edit /etc/hosts and therefore may require your administrator password."
sudo bash -c 'printf "\n192.168.50.101 rsr.localdev.akvo.org   # localdev_rsr\n" >> /etc/hosts'
