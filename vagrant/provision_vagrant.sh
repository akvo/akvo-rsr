#!/bin/bash

if [ -e /etc/localdev_rsr_provisioned ]
then
    echo "Already bootstrapped, so nothing to do"
    exit 0
fi

if [ ! -L /var/akvo/rsr/git/current ]
then
    sudo -u rsr ln -s /vagrant/rsr/checkout /var/akvo/rsr/git/current
fi

ln -sf /var/akvo/rsr/local_settings.conf /var/akvo/rsr/git/current/akvo/settings/65_puppet.conf

sudo -u rsr /var/akvo/rsr/venv/current/bin/pip install -r /var/akvo/rsr/git/current/scripts/deployment/pip/requirements/2_rsr.txt

# due to a stupid dependency of django-counter, both PIL and Pillow will be installed, so we'll remove them
# here and reinstall
sudo -u rsr /var/akvo/rsr/venv/current/bin/pip uninstall --yes PIL Pillow
sudo -u rsr /var/akvo/rsr/venv/current/bin/pip install Pillow==2.0.0

manage='sudo -u rsr /var/akvo/rsr/venv/current/bin/python /var/akvo/rsr/git/current/akvo/manage.py'

$manage syncdb --noinput &&\
zcat /vagrant/files/barebones.sql.gz > /tmp/barebones.sql &&\
mysql -u root rsr < /tmp/barebones.sql &&\
rm /tmp/barebones.sql &&\
$manage migrate &&\
cp -r /vagrant/files/db /var/akvo/rsr/mediaroot/ &&\

chown -R rsr.rsr /var/akvo/rsr/mediaroot/db &&\
supervisorctl restart rsr &&\
echo `date` > /etc/localdev_rsr_provisioned