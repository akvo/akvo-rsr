#!/bin/bash
set -e

WORKDIR=$(dirname $0)

FIXTURE_URL=https://gist.githubusercontent.com/punchagan/00e2ba06e425e2ce376de2daa358b558/raw/d34af696554c630b91f3303e236371fb5315036c/test_data.json

curl -L $FIXTURE_URL > $WORKDIR/test_data.json
