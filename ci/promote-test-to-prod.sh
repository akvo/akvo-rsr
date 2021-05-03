#!/usr/bin/env bash

git fetch

docker run --rm -e ZULIP_CLI_TOKEN -v ~/.config:/home/akvo/.config -v "$(pwd)":/app \
  -it akvo/akvo-devops:20201203.085214.79bec73 promote-test-to-prod.sh rsr rsr-version akvo-rsr zulip "Everest Engine"
