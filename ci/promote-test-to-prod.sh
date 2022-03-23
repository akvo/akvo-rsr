#!/usr/bin/env bash
set -eu

git fetch

echo "Running E2E tests"
if [[ $(uname -s) == "Linux" ]] && [[ ! "${HEADLESS:-}" = false ]]; then
  ./scripts/devhelpers/run-e2e-linux.sh
else
  ./scripts/devhelpers/run-e2e-local.sh
fi

docker run --rm -e ZULIP_CLI_TOKEN -v ~/.config:/home/akvo/.config -v "$(pwd)":/app \
  -it akvo/akvo-devops:20201203.085214.79bec73 promote-test-to-prod.sh rsr rsr-version akvo-rsr zulip "Akvo RSR Engine"
