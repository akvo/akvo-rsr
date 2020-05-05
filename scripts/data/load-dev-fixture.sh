#!/usr/bin/env bash
set -euo pipefail

docker-compose exec web python manage.py shell -c "\
from django.conf import settings; import sys;
if not settings.DEBUG:
    print('Only runs in DEBUG mode')
    sys.exit(1)
"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FIXTURE_NAME="dev-db.json"
FIXTURE_PATH="${DIR}/${FIXTURE_NAME}"

echo "Clearing current local DB..."
docker-compose exec web bash -c 'python manage.py sqlflush | python manage.py dbshell'

echo "Loading fixture from ${FIXTURE_PATH}..."
docker-compose exec -e SKIP_REQUIRED_AUTH_GROUPS=1 web python manage.py loaddata --ignorenonexistent "${FIXTURE_NAME}"
