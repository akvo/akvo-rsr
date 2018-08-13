#!/usr/bin/env bash

set -eux

NEW_UID=$(stat -c '%u' /var/akvo/rsr/code)
NEW_GID=$(stat -c '%g' /var/akvo/rsr/code)

groupmod -g "$NEW_GID" -o akvo
usermod -u "$NEW_UID" -o akvo

mkdir -p /var/log/akvo/ /var/akvo/rsr/logs/ /var/akvo/rsr/staticroot/ /var/akvo/rsr/mediaroot/
chown -R akvo:akvo /var/log/akvo/ /var/akvo/rsr/logs/ /var/akvo/rsr/staticroot/ /var/akvo/rsr/mediaroot/

gosu akvo:akvo "$@"
