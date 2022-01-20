#!/usr/bin/env bash

set -euo pipefail

docker-compose down -v
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.e2e.yaml up --build --detach
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.e2e.yaml exec puppeteer npm test
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.e2e.yaml down -v
