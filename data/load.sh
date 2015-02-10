#!/bin/bash

# Clear Postgres
sudo -u postgres bash <<EOF
dropdb rsr
createdb rsr -E UTF8 -O rsr -T template0
EOF

# Clear db dir
sudo -u rsr bash <<EOF
sudo rm -Rf /var/akvo/rsr/mediaroot/db
EOF

echo "Done loading new data!"
