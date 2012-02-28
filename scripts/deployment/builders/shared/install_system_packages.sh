#!/bin/bash

THIS_SCRIPT=$0
EXECUTION_MODE=$1

SHARED_SCRIPTS_HOME="$(cd `dirname $THIS_SCRIPT` && pwd)"
CONFIG_DIR="$(cd $SHARED_SCRIPTS_HOME/../config && pwd)"

source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_execution_mode_missing.sh" "`basename $THIS_SCRIPT`" $EXECUTION_MODE
source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_not_using_sudo.sh"

source "$CONFIG_DIR/load_config.sh" "python_system.config" $EXECUTION_MODE

PIP_REQUIREMENTS_DIR="$(cd "$SHARED_SCRIPTS_HOME/../../pip/requirements" && pwd)"

function exit_if_pip_not_installed
{
    PIP_PATH=`which pip`

    # check if pip is installed
    if [ -z "$PIP_PATH" ]; then
        printf "\n>> pip not installed or not on the PATH\n\n"
        exit -1
    fi
}

function install_packages_with_pip
{
    # function parameters:
    REQUIREMENTS_FILE_NAME=$1
    PACKAGE_SET_NAME=$2

    cd "$PACKAGE_DOWNLOAD_DIR"
    printf "\n>> Installing/upgrading $PACKAGE_SET_NAME packages:\n"
    pip install -M -r "$PIP_REQUIREMENTS_DIR/$REQUIREMENTS_FILE_NAME"
}

function install_system_packages
{
    printf "\n>> Current system packages:\n"
    pip freeze

    install_packages_with_pip "0_system.txt" "system"

    printf "\n>> Installed system packages:\n"
    pip freeze
}


exit_if_pip_not_installed
install_system_packages
