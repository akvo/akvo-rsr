#!/usr/bin/env bash
# The status is provided by a local server started by
#  ./manage.py django_q_probettp

status=$(curl -s -o /dev/null -w %{http_code} localhost:8080)
echo "status code: ${status}"
[[ $status == "200" ]]
