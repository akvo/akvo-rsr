#!/usr/bin/env bash

## Instructions:
## You must have access to the Google akvo-lumen project
## Then just run this script
set -eu

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run --rm -it -e FIXTURE_PATH=/data/dev-db.json -v "$DIR":/data -v ~/.config:/home/gkh/.config -v "$DIR"/helper/update-dev-fixture.sh:/data/commands.sh:ro kiwigrid/gcloud-kubectl-helm:2.12.3-234.0.0-88