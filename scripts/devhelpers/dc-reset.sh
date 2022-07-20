#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")" # Move to script dir
cd "$(git rev-parse --show-toplevel)" # Move to git root

# Reset docker-compose and restart with a working DB

docker-compose down -v
docker-compose up -d rsrdbhost
