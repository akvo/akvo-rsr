#!/bin/bash

su rsr

ln -s /vagrant/rsr/checkout /var/akvo/rsr/git/current
ln -s /var/akvo/rsr/local_settings.conf /var/akvo/rsr/git/current/akvo/settings/65_puppet.conf

/var/akvo/rsr/venv/bin/pip install -r /var/akvo/rsr/git/current/scripts/deployment/pip/requirements/2_rsr.txt

manage='/var/akvo/rsr/venv/bin/python /var/akvo/rsr/git/current/akvo/manage.py'
$manage syncdb --noinput
$manage migrate
