set -e

if [ ! -e /var/akvo/rsr/venv ]
then
    sudo -H -u rsr virtualenv --quiet /var/akvo/rsr/venv
fi

sudo -H -u rsr /var/akvo/rsr/venv/bin/pip install -r /var/akvo/rsr/code/scripts/deployment/pip/requirements/2_rsr.txt
