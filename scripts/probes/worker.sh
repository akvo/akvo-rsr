#!/usr/bin/env bash
# The status is provided by a local server started by
#  ./manage.py django_q_probettp

status=$(curl -s localhost:8080)
echo "returned status ${status}"
[[ $status == "Started" ]] || [[ $status == "Idle" ]]
