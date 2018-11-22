#!/bin/bash

# To discard previously collected responses, and create a new canonical copy of
# the expected responses, use the --collect flag.
docker-compose run web ./scripts/docker/dev/run-as-user.sh  SLOW_TESTS=1 ./scripts/docker/dev/run-slow-tests.sh
