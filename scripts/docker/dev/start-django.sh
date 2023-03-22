#!/usr/bin/env bash
# Prepare and start the django server
set -eu

./scripts/docker/dev/wait-for-dependencies.sh

if [ -z "${IS_REPORTS_CONTAINER:-}" ] && [[ -z "${IS_WORKER:-}" ]] ; then
  pushd akvo/rsr/front-end
    if [[ ! -d "node_modules" ]]; then
      npm install
    fi
    if [[ ! -f "static/rsr/dist/vendors.js" ]]; then
      npm run dev
    fi
  popd

  SKIP_REQUIRED_AUTH_GROUPS=true python manage.py migrate --noinput
  SKIP_REQUIRED_AUTH_GROUPS=true python manage.py createcachetable || true

  python manage.py populate_local_db
  python manage.py loaddata --app rsr project_validations

  # Sync re-occurring tasks to be run by django-q from the 90-finish.conf
  echo "Updating django-q schedules"
  python manage.py sync_django_q_schedules
fi

if [[ -z "${IS_WORKER:-}" ]] ; then
  python manage.py runserver 0.0.0.0:${DJANGO_PORT:-8000}
else
  echo Starting probe server
  ./manage.py django_q_probettp &
  trap "echo 'Killing probe server'; kill $!" SIGINT

  echo Starting worker process in background
  ./manage.py qcluster &
  wait $!
fi
