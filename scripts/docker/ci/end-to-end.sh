#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - BUILD INFO - $*"
}

function get_status {
  echo $(curl --output /dev/null --silent --head --write-out %{http_code} $1)
}

function test_http_status {
  local status=$(get_status "$2")
  if [ "$status" -ne "$1" ]; then
    log Failed to load "$2" with expected status "$1" got "$status".
    exit 1
  fi
  printf "."
}

BASE_URL=http://rsr.localdev.akvo.org
HTTP_OK=200
HTTP_ERRORS_START=400

MAX_ATTEMPTS=120
ATTEMPTS=0
RESPONSE_STATUS="${HTTP_ERRORS_START}"

log Waiting for application to be ready ...
while [[ "${RESPONSE_STATUS}" -ge ${HTTP_ERRORS_START} && "${ATTEMPTS}" -lt "${MAX_ATTEMPTS}" ]]; do
    RESPONSE_STATUS=$(get_status "${BASE_URL}")
    let ATTEMPTS+=1
    sleep 1
done

if [[ "${RESPONSE_STATUS}" -ge ${HTTP_ERRORS_START} ]]; then
  log Application takes too long to respond!
  exit 1
fi

log Testing front-end

# Legacy assets
PAGE_CONTENT=$(curl --location --silent "${BASE_URL}")
ASSETS=$(echo "${PAGE_CONTENT}" | grep -Eo "\/static/rsr/dist/.+(css|js)" | head -n 3)
while read -r path; do
  # test asset
  test_http_status "${HTTP_OK}" "$BASE_URL$path"
  # test sourcemap
  test_http_status "${HTTP_OK}" "$BASE_URL$path.map"
done <<< "$ASSETS"

# SPA endpoint end routing
SPA_URL="$BASE_URL/my-rsr"
test_http_status "${HTTP_OK}" "${SPA_URL}/"
test_http_status "${HTTP_OK}" "${SPA_URL}/path"
test_http_status "${HTTP_OK}" "${SPA_URL}/sub/path"

# SPA assets
SPA_PAGE=$(curl --location --silent "${SPA_URL}")
SPA_ASSETS=$(echo "${SPA_PAGE}" | grep -Eo "\/my-rsr/.+(css|js)" | head -n 3)
while read -r path; do
  # test asset
  test_http_status "${HTTP_OK}" "$BASE_URL$path"
  # test sourcemap
  test_http_status "${HTTP_OK}" "$BASE_URL$path.map"
done <<< "$SPA_ASSETS"

echo ""

log End-to-end testing done!
