set -e

# Temporary Hack (see https://github.com/akvo/akvo-provisioning/issues/29)
sudo sed -i 's/SITE_ID=1$/SITE_ID=1004/' /var/akvo/rsr/local_settings.conf

supervisorctl restart rsr
