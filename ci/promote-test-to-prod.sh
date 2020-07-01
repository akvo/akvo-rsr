#!/usr/bin/env bash

docker run --rm -e ZULIP_CLI_TOKEN -v ~/.config:/home/akvo/.config -v "$(pwd)":/app \
  -it akvo/akvo-devops:20200701.075253.7c93843 promote-test-to-prod.sh rsr rsr-version akvo-rsr zulip
