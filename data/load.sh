#!/usr/bin/env bash

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the
# Akvo RSR module. For additional details on the GNU license please
# see < http://www.gnu.org/licenses/agpl.html >.

set -e

WORKDIR=/tmp/rsr-load

# Make sure we have a clean working dir
sudo rm -rfv $WORKDIR
mkdir -p $WORKDIR

# Extract to workingdir
tar -C /tmp/rsr-load -zxvf /var/akvo/rsr/code/data/dump/rsr_dump.tar.gz

# Content
sudo -u rsr bash <<EOF
rm -rfv /var/akvo/rsr/mediaroot/db
rm -rfv /var/akvo/rsr/mediaroot/cache
cp -rv $WORKDIR/db /var/akvo/rsr/mediaroot/db

# Clear thumbnail cache
cd /var/akvo/rsr
. venv/bin/activate
cd ./code
python ./manage.py migrate
# python ./manage.py thumbnail clear_delete_all
deactivate
EOF

# Postgres
sudo -u postgres bash <<EOF
dropdb rsr
createdb rsr -E UTF8 -O rsr -T template0
pg_restore -d rsr /tmp/rsr-load/rsr.dump
EOF


# Cleanup
cd /tmp
sudo rm -rfv $WORKDIR

echo "Done loading new data!"
