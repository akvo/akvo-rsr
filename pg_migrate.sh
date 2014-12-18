#!/bin/bash

# Do migration
sudo -u rsr bash <<'EOF'
cd /var/akvo/rsr
. venv/bin/activate
cd code
if ! [ -f  /var/akvo/rsr/code/pg_migrate_conf.yml ]; then
   echo "Could not find pg_migrate_conf.yml. Use pg_migrate_conf.yml.template."
   exit 2
fi
python pg_pre.py > pg_pre.log
py-mysql2pgsql -v -f pg_migrate_conf.yml
python pg_alts.py > pg_tests.log
python pg_tests.py > pg_tests.log
EOF
