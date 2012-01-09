#!/bin/bash

BUILDER_SCRIPTS_HOME="$(cd `dirname $0` && pwd)"
DEPLOYMENT_SCRIPTS_HOME="$(cd "$BUILDER_SCRIPTS_HOME/.." && pwd)"
OSX_DIR="$BUILDER_SCRIPTS_HOME/osx"
CONFIG_DIR="$OSX_DIR/config"
VERIFIERS_DIR="$(cd "$DEPLOYMENT_SCRIPTS_HOME/verifiers" && pwd)"

python "$VERIFIERS_DIR/verify_system_packages.py"

# exit if any errors occurred while verifying the system packages
if [ $? -ne 0 ]; then
    printf "\n>> Unable to build virtualenv packages until system package dependencies have been resolved\n"
    exit -1
fi

source "$OSX_DIR/ensure_osx_config_files_exist.sh"
source "$OSX_DIR/ensure_required_dirs_exist.sh"

source "$CONFIG_DIR/user.config"

echo $SUDO_PASSWORD | sudo -S "$OSX_DIR/rebuild_osx_system_env.sh"

# continue if no errors occurred while rebuilding the system packages
if [ $? -eq 0 ]; then
    "$OSX_DIR/rebuild_rsr_virtualenv.sh"
else
    printf "\n>> Unable to create virtualenv due to errors above\n"
fi
