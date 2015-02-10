#!/bin/bash

# Create a tmp directory
mkdir -p /tmp/rsr_dump

# Postgres
sudo -u postgres bash <<EOF
pg_dump -Fc rsr > /tmp/rsr.dump
EOF
sudo mv /tmp/rsr.dump /tmp/rsr_dump/

# Django dump data
sudo -u rsr bash <<EOF
cd /var/akvo/rsr
. venv/bin/activate
cd code
python ./manage.py dumpdata --format json --indent 2 > /tmp/rsr.json
deactivate
EOF
sudo mv /tmp/rsr.json /tmp/rsr_dump/

# Copy db mediafolder
sudo cp -R /var/akvo/rsr/mediaroot/db /tmp/rsr_dump/db

# Move to vagrant share
sudo -u rsr bash <<EOF
cd /tmp
tar -zcvf rsr_dump.`date +"%Y%m%d_%H%M%S"`.tar.gz ./rsr_dump
mkdir -p /var/akvo/rsr/code/data/dump
mv ./rsr_dump.*.tar.gz /var/akvo/rsr/code/data/dump
EOF

# Clean up
sudo rm -Rf /tmp/rsr_dump

echo 'Dump baked in <repo>data/dump'
