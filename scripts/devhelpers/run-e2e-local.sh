#!/usr/bin/env bash

set -euo pipefail

pushd akvo/rsr/e2e
test -f node_modules/.bin/jest || npm install
npm test
popd

echo "Done"
