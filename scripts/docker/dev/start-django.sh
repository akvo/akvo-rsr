#!/usr/bin/env bash

set -eu

./scripts/docker/dev/wait-for-dependencies.sh

pushd akvo/rsr/static
if [[ ! -f "node_modules" ]]; then
  npm install
fi
if [[ ! -f "dist/vendors.js" ]]; then
  npm run dev
fi
npm run devw&
popd

python manage.py migrate --noinput
#python manage.py collectstatic
python manage.py runserver 0.0.0.0:8000
