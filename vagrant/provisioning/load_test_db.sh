#!/bin/bash
set -e

manage='sudo -H -u rsr /var/akvo/rsr/venv/bin/python /var/akvo/rsr/code/manage.py'

# if we have already done the loading, don't do it again
if [ -e /etc/localdev_rsr_provisioned ]
then
    $manage migrate
    $manage collectstatic --noinput
    exit 0
fi

# For new data update the DUMP_URL
DUMP_URL='http://files.support.akvo-ops.org/devdbs/rsr_dump.20150325_102257.tar.gz'
DUMPDIR='/var/akvo/rsr/code/data/dump'
mkdir -p $DUMPDIR
cd $DUMPDIR
curl -L $DUMP_URL > $DUMPDIR/rsr_dump.tar.gz
cd /var/akvo/rsr/code/data/ && ./load.sh

$manage migrate
$manage collectstatic --noinput

echo `date` > /etc/localdev_rsr_provisioned
