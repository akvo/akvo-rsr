#!/usr/bin/env bash

git fetch

docker run --rm -e ZULIP_CLI_TOKEN -v ~/.config:/home/akvo/.config -v "$(pwd)":/app \
  -it akvo/akvo-devops:20200810.101253.a1dbc6a promote-test-to-prod.sh rsr rsr-version akvo-rsr zulip
