#!/usr/bin/env bash
set -eu

DEPLOY_COMMITISH="${1:-production}"
git fetch --all

echo "Running E2E tests"
if [[ $(uname -s) == "Linux" ]] && [[ ! "${HEADLESS:-}" = false ]]; then
  ./scripts/devhelpers/run-e2e-linux.sh
else
  ./scripts/devhelpers/run-e2e-local.sh
fi

COMMIT_HASH="$(git rev-parse ${DEPLOY_COMMITISH})"

docker run --rm -e ZULIP_CLI_TOKEN -v ~/.config:/home/akvo/.config -v "$(pwd)":/app \
  -it akvo/akvo-devops:20220927.141344.aa0697b promote-test-to-prod.sh \
    rsr \
    rsr-version \
    akvo-rsr \
    zulip \
    "Akvo RSR Engine" \
    "$COMMIT_HASH"
