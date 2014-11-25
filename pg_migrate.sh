#!/bin/bash

if [ -z "$1" ]; then
    echo "No password argument supplied"
    exit 2
fi

# Since we switch user we need to store password on disk
# we're using the rsr disk location and not /tmp
PASSWORD_FILE="/var/akvo/rsr/code/pg_db_password.tmp"
echo $1 > $PASSWORD_FILE

# Truncate Django session
mysql --user=rsr --password=$1 rsr -e "Truncate table django_session;"

# Create rsr user and database
sudo su postgres <<'EOF'
PASSWORD=`cat /var/akvo/rsr/code/pg_db_password.tmp`
# echo "password:"
# echo $PASSWORD
psql -c "CREATE USER rsr WITH PASSWORD '$PASSWORD';"
psql -c "CREATE DATABASE rsr OWNER rsr TEMPLATE template0 ENCODING 'UTF8';"
EOF

# Remove password file
rm -f $PASSWORD_FILE

# Do migration
sudo su rsr <<'EOF'
cd /var/akvo/rsr
. venv/bin/activate
cd code
if ! [ -f  /var/akvo/rsr/code/pg_migrate_conf.yml ]; then
   echo "Could not find pg_migrate_conf.yml. Use pg_migrate_conf.yml.template."
   exit 2
fi
py-mysql2pgsql -v -f pg_migrate_conf.yml
python pg_alts.py
python pg_tests.py > pg_tests.log
EOF
