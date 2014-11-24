#!/bin/bash

if [ -z "$1" ]; then
    echo "No password argument supplied"
    exit 2
fi

# Truncate Django session
mysql --user=rsr --password=$1 rsr -e "Truncate table django_session;"

# Create rsr user and database
sudo su postgres <<'EOF'
psql -c "CREATE USER rsr WITH PASSWORD '$1';"
psql -c "CREATE DATABASE rsr OWNER rsr TEMPLATE template0 ENCODING 'UTF8';"
EOF

# Do migration
sudo su rsr <<'EOF'
cd /var/akvo/rsr
. venv/bin/activate
cd code
if ! [ -f  /var/akvo/rsr/code/pg_migrate_conf.yml ]; then
   echo "Could not find py_migrate_conf.yml. Use py_migrate_conf.yml.template."
   exit 2
fi
py-mysql2pgsql -v -f pg_migrate_conf.yml
python pg_alts.py
python pg_tests.py > pg_tests.log
EOF
