#!/usr/bin/env bash

docker run --rm -e ZULIP_CLI_TOKEN -v ~/.config:/home/akvo/.config -v "$(pwd)":/app \
  -it akvo/akvo-devops:20200512.132847.78aa475 promote-test-to-prod.sh rsr rsr-version akvo-rsr zulip