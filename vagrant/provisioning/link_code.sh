set -e

rm -f /var/akvo/rsr/code
sudo -H -u rsr ln -s /vagrant/rsr/checkout /var/akvo/rsr/code

ln -sf /var/akvo/rsr/local_settings.conf /var/akvo/rsr/code/akvo/settings/65_puppet.conf
