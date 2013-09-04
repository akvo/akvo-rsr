#!/bin/bash
if [ `whoami` != "root" ]
then
    echo >&2 "This script must be run as root"
    exit 1
fi

if [ -e /etc/localdev_rsr_provisioned ]
then
    echo "Already bootstrapped, so nothing to do"
    exit 0
fi

if [ ! -L /var/akvo/rsr/code ]
then
    sudo -u rsr ln -s /vagrant/rsr/checkout /var/akvo/rsr/code
fi

ln -sf /var/akvo/rsr/local_settings.conf /var/akvo/rsr/code/akvo/settings/65_puppet.conf

sudo -u rsr virtualenv --quiet /var/akvo/rsr/venv
sudo -u rsr /var/akvo/rsr/venv/bin/pip install -r /var/akvo/rsr/code/scripts/deployment/pip/requirements/2_rsr.txt

manage='sudo -u rsr /var/akvo/rsr/venv/bin/python /var/akvo/rsr/code/akvo/manage.py'

$manage syncdb --noinput &&\
zcat /vagrant/files/barebones.sql.gz > /tmp/barebones.sql &&\
mysql -u root rsr < /tmp/barebones.sql &&\
rm /tmp/barebones.sql &&\
$manage migrate &&\
cp -r /vagrant/files/db /var/akvo/rsr/mediaroot/ &&\

chown -R rsr.rsr /var/akvo/rsr/mediaroot/db &&\
supervisorctl restart rsr &&\
echo `date` > /etc/localdev_rsr_provisioned