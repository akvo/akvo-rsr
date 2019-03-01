#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

log Running end to end test. For Puneeth to fill!

wget http://rsr.localdev.akvo.org/
log Done
