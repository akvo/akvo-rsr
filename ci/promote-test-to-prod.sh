#!/usr/bin/env bash
set -eu

DEPLOY_COMMITISH="${1:-master}"
git fetch --all

COMMIT_HASH="$(git rev-parse ${DEPLOY_COMMITISH})"

docker run --rm -e ZULIP_CLI_TOKEN -v ~/.config:/home/akvo/.config -v "$(pwd)":/app \
  -it akvo/akvo-devops:20220927.141344.aa0697b promote-test-to-prod.sh \
    rsr \
    rsr-version \
    akvo-rsr \
    zulip \
    "Akvo RSR Engine" \
    "$COMMIT_HASH"
