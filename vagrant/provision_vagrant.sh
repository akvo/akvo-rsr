#!/bin/bash
if [ `whoami` != "root" ]
then
    echo >&2 "This script must be run as root"
    exit 1
fi

set -e

sed -i '/nameserver/d' /etc/resolv.conf
echo 'nameserver 192.168.50.101' >> /etc/resolv.conf

rm -f /var/akvo/rsr/code
sudo -u rsr ln -s /vagrant/rsr/checkout /var/akvo/rsr/code

ln -sf /var/akvo/rsr/local_settings.conf /var/akvo/rsr/code/akvo/settings/65_puppet.conf

if [ ! -e /var/akvo/rsr/venv ]
then
    sudo -u rsr virtualenv --quiet /var/akvo/rsr/venv
fi

sudo -u rsr /var/akvo/rsr/venv/bin/pip install -r /var/akvo/rsr/code/scripts/deployment/pip/requirements/2_rsr.txt

manage='sudo -u rsr /var/akvo/rsr/venv/bin/python /var/akvo/rsr/code/akvo/manage.py'

$manage syncdb --noinput

if [ ! -e /etc/localdev_rsr_provisioned ]
then
    zcat /vagrant/files/barebones.sql.gz > /tmp/barebones.sql
    mysql -u root rsr < /tmp/barebones.sql
    rm /tmp/barebones.sql
    $manage migrate
    cp -r /vagrant/files/db /var/akvo/rsr/mediaroot/
    chown -R rsr.rsr /var/akvo/rsr/mediaroot/db
    echo `date` > /etc/localdev_rsr_provisioned
fi

# Temporary Hack (see https://github.com/akvo/akvo-provisioning/issues/29)
sudo sed -i 's/SITE_ID=1$/SITE_ID=1004/' /var/akvo/rsr/local_settings.conf

supervisorctl restart rsr
