#!/usr/bin/env bash
#
# Runs snakeviz in the web container
# Requires a view.prof to be present in the project's root directory
# Generate one by activating profiling in /scripts/docker/dev/50-docker-local-dev.conf
#
set -euo pipefail

cd "$(dirname "$0")" # Move to script dir
cd "$(git rev-parse --show-toplevel)" # Move to git root

docker-compose exec web snakeviz -s -H 0.0.0.0 -p 8082 view.prof
