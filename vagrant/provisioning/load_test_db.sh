#!/bin/bash
set -e

manage='sudo -H -u rsr /var/akvo/rsr/venv/bin/python /var/akvo/rsr/code/manage.py'

# if we have already done the loading, don't do it again
if [ -e /etc/localdev_rsr_provisioned ]
then
    $manage syncdb --noinput
    $manage migrate
    $manage collectstatic --noinput
    exit 0
fi

WORKDIR=/tmp/rsr-test-db/
DBZIP='http://files.support.akvo-ops.org/devdbs/rsr-test-db-small.zip'

rm -rfv $WORKDIR
mkdir $WORKDIR

cd $WORKDIR

curl $DBZIP > $WORKDIR/rsr-test-db.zip

unzip $WORKDIR/rsr-test-db.zip -d $WORKDIR

rm -rfv /var/akvo/rsr/mediaroot/db
cp -rv $WORKDIR/rsr-test-db/media/db /var/akvo/rsr/mediaroot/db
chown -R rsr.rsr /var/akvo/rsr/mediaroot/db

zcat $WORKDIR/rsr-test-db/rsr.sql.gz | sudo -H -u postgres psql rsr

rm -rfv $WORKDIR

$manage migrate
$manage collectstatic --noinput

echo `date` > /etc/localdev_rsr_provisioned

