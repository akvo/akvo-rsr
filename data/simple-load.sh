#!/usr/bin/env bash

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the
# Akvo RSR module. For additional details on the GNU license please
# see < http://www.gnu.org/licenses/agpl.html >.

set -e

# Postgres
sudo -u postgres bash <<EOF
dropdb rsr
createdb rsr -E UTF8 -O rsr -T template0
pg_restore -d rsr /var/akvo/rsr/code/data/dump/rsr.dump
EOF
