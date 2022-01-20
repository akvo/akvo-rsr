#!/usr/bin/env bash

set -euo pipefail

docker build -t rsr-puppeteer -f Dockerfile-e2e .

echo "Populating E2E test fixtures"
docker-compose exec web python manage.py populate_e2e_data

docker run --network host --rm rsr-puppeteer npm test

echo "Clean up test data"
docker-compose exec web python manage.py populate_e2e_data --teardown
echo "Done"
