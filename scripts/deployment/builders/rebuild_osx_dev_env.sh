#!/bin/bash

OSX_DIR="$(cd `dirname $0` && pwd)/osx"
CONFIG_DIR="$OSX_DIR/config"

cd "$OSX_DIR"

# exit if rsr_env.config file does not exist
if [ ! -e "$CONFIG_DIR/rsr_env.config" ]; then
    printf ">> Expected $CONFIG_DIR/rsr_env.config file not found\n"
    printf ">> Copy the rsr_env.config.template file and edit as necessary\n"
    exit -1
fi

source $CONFIG_DIR/rsr_env.config

echo $SUDO_PASSWORD | sudo -S "$OSX_DIR/rebuild_osx_system_env.sh"

if [ $? -eq 0 ]; then
    printf "\n>> Creating virtualenv at $RSR_VIRTUALENV_PATH\n"
    virtualenv --no-site-packages --distribute "$RSR_VIRTUALENV_PATH"

    "$OSX_DIR/rebuild_rsr_virtualenv.sh" "$VIRTUALENV_NAME"
else
    printf "\n>> Unable to create virtualenv due to errors above\n"
fi
