#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

URL=http://rsr.localdev.akvo.org/
MAX_ATTEMPTS=60
ATTEMPTS=0
RES=400

log Waiting for application to be ready ...
while [[ "${RES}" -ge 400 && "${ATTEMPTS}" -lt "${MAX_ATTEMPTS}" ]]; do
    RES=$(curl --output /dev/null --silent --head --write-out %{http_code} "${URL}")
    let ATTEMPTS+=1
    sleep 1
done

if [[ $RES -ge 400 ]]; then
  log Application takes too long to respond!
  exit 1
fi

wget "${URL}"

log Done
