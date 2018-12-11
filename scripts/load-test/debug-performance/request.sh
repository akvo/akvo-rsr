#!/usr/bin/env bash

# Gets the docker-compose logs for the last request
# Cannot be run more than once per minute :(

while [[ $(date | cut -f 4 -d\  | cut -d\: -f 3) -gt 40 ]]; do echo "waiting"; sleep 3; done

minute=$(date | cut -f 4 -d\  | cut -d\: -f 1-2)
echo $minute

time wget -q 'http://localhost/en/project/2243/' -O r1

docker-compose logs --tail=4000 web | grep $minute | tee dbcalls.latest.txt


