#!/usr/bin/env bash

set -euo pipefail

echo "Populating E2E test fixtures"
docker-compose exec web python manage.py populate_e2e_data

pushd akvo/rsr/e2e
test -f node_modules/.bin/jest || npm install
npm test
popd

echo "Clean up test data"
docker-compose exec web python manage.py populate_e2e_data --teardown
echo "Done"
