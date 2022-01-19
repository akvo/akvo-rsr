#!/usr/bin/env bash

set -euo pipefail


docker build -t rsr-puppeteer -f Dockerfile-e2e .
docker run --network host --rm rsr-puppeteer npm test
