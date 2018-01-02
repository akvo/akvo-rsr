#!/bin/bash
# Akvo RSR is covered by the GNU Affero General Public License. See more
# details in the license.txt file located at the root folder of the Akvo RSR
# module. For additional details on the GNU license please see
# <http://www.gnu.org/licenses/agpl.html>.

set -e

WORKDIR=$(dirname $0)

FIXTURE_URL=https://gist.githubusercontent.com/punchagan/00e2ba06e425e2ce376de2daa358b558/raw/d34af696554c630b91f3303e236371fb5315036c/test_data.json

curl -L $FIXTURE_URL > $WORKDIR/test_data.json
