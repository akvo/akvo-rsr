#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")" # Move to script dir
cd "$(git rev-parse --show-toplevel)" # Move to git root

./scripts/devhelpers/dc-reset.sh

sleep 20
./scripts/data/make-and-restore-production-dump.sh
