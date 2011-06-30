#!/bin/bash

cd "`dirname $0`"

# exit if rebuild_local_env.config file does not exist
if [ ! -e rebuild_local_env.config ]; then
    printf ">> Expected rebuild_local_env.config file not found -- copy the rebuild_local_env.config.template file and edit as necessary\n"
    exit -1
fi

source rebuild_local_env.config

echo $SUDO_PASSWORD | sudo -S pip/rebuild_osx_system_env.sh

printf "\n>> Creating virtualenv at $RSR_VIRTUALENV_PATH\n"
virtualenv --no-site-packages --distribute "$RSR_VIRTUALENV_PATH"

pip/rebuild_osx_dev_env.sh "$VIRTUALENV_NAME"
