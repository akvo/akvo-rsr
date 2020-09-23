#!/usr/bin/env bash
set -euo pipefail

MODE="${1---all}"
LINT_BACKEND=
LINT_FRONTEND=

if [[ "${MODE}" == "--all" || "${MODE}" == "--backend" ]];
then
    LINT_BACKEND=1
fi

if [[ "${MODE}" == "--all" || "${MODE}" == "--frontend" ]];
then
    LINT_FRONTEND=1
fi

# Backend lint
function lint_backend {
    echo "Running backend lint"
    flake8 --ignore=E501,W503 --exclude=wsgi.py,scripts,migrations,__init__.py,node_modules,akvo/rsr/views/translations.py akvo/
    # Need environ to be set before other imports, etc. So, ignore E402
    flake8 --ignore=E501,E402,W503 akvo/scripts/
    flake8 --ignore=E501,E402,W503 akvo/wsgi.py
}

function lint_frontend {
    # Frontend lint
    echo "Running frontend lint"

    pushd akvo/rsr/dir
    test -f node_modules/.bin/eslint || npm install
    npm run lint
    popd

    pushd akvo/rsr/spa
    test -f node_modules/.bin/eslint || npm install
    npm run lint
    popd
}

if [[ $LINT_BACKEND ]];
then
    lint_backend
fi

if [ $LINT_FRONTEND ];
then
    lint_frontend
fi
