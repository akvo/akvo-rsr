#!/bin/bash

OSX_DIR="$(cd `dirname $0` && pwd)/osx"
CONFIG_DIR="$OSX_DIR/config"
VERIFIERS_DIR="$(cd "$OSX_DIR/../../verifiers" && pwd)"

"$VERIFIERS_DIR/verify_system_packages.py"

# exit if any errors occurred while verifying the system packages
if [ $? -ne 0 ]; then
    printf "\n>> Unable to build virtualenv packages until system package dependencies have been resolved\n"
    exit -1
fi

cd "$OSX_DIR"

function exit_if_expected_config_file_is_missing
{
    # Function parameters:
    #   $1: expected config file

    if [ ! -e "$CONFIG_DIR/$1" ]; then
        printf ">> Expected $CONFIG_DIR/$1 file not found\n"
        printf ">> Copy the $1.template file and edit as necessary\n"
        exit -1
    fi
}

exit_if_expected_config_file_is_missing "user.config"
exit_if_expected_config_file_is_missing "rsr_env.config"

source $CONFIG_DIR/user.config

echo $SUDO_PASSWORD | sudo -S "$OSX_DIR/rebuild_osx_system_env.sh"

# continue if no errors occurred while rebuilding the system packages
if [ $? -eq 0 ]; then
    source $CONFIG_DIR/rsr_env.config
    printf "\n>> Creating virtualenv at $RSR_VIRTUALENV_PATH\n"
    virtualenv --no-site-packages --distribute "$RSR_VIRTUALENV_PATH"

    "$OSX_DIR/rebuild_rsr_virtualenv.sh" "$VIRTUALENV_NAME"
else
    printf "\n>> Unable to create virtualenv due to errors above\n"
fi
