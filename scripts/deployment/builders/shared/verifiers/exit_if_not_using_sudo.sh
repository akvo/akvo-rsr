#!/bin/bash

CURRENT_USER="`whoami`"

# exit if not running with sudo or as root
if [ $CURRENT_USER != "root" ]; then
    printf ">> This script should be executed with sudo to facilitate installation of system Python packages\n"
    printf ">> Current user: $CURRENT_USER\n"
    exit -1
fi
