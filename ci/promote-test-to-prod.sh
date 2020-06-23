#!/usr/bin/env bash

docker run --rm -e ZULIP_CLI_TOKEN -v ~/.config:/home/akvo/.config -v "$(pwd)":/app \
  -it akvo/akvo-devops:20200617.141037.610c18f promote-test-to-prod.sh rsr rsr-version akvo-rsr zulip
