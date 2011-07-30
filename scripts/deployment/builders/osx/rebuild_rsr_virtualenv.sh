#!/bin/bash

OSX_DIR="$(cd `dirname $0` && pwd)"
CONFIG_DIR="$OSX_DIR/config"

# exit if virtualenv_name parameter is missing
if [ -z "$1" ]; then
    echo "Usage: rebuild_osx_dev_env <virtualenv_name>"
    exit -1
fi

DEPLOYMENT_SCRIPTS_DIR="$(cd "$OSX_DIR/../.." && pwd)"
PIP_REQUIREMENTS_DIR="$DEPLOYMENT_SCRIPTS_DIR/pip/requirements"
VERIFIERS_DIR="$DEPLOYMENT_SCRIPTS_DIR/verifiers"

"$VERIFIERS_DIR/verify_system_packages.py"

# exit if any errors occurred while verifying the system packages
if [ $? -ne 0 ]; then
    printf "\n>> Unable to build virtualenv packages until system package dependencies have been resolved\n"
    exit -1
fi

source "$OSX_DIR/ensure_osx_config_files_exist.sh"

source "$CONFIG_DIR/rsr_env.config"


VIRTUALENV_NAME=$1

source $CONFIG_DIR/osx_build_flags_env_intel.config
function install_packages_with_pip
{
    # Function parameters:
    #   $1: pip requirements file name
    #   $2: requirements description

    source "$CONFIG_DIR/osx_build_flags_env_64.config"
    cd "$PACKAGE_DOWNLOAD_DIR"
    printf "\n>> Installing/upgrading $2 packages: (with 64-bit architecture)\n"
    pip install -M -r "$PIP_REQUIREMENTS_DIR/$1"
}

function install_rsr_and_infrastructure_packages
{
    printf "\n>> Fresh virtualenv should only contain the distribute and wsgiref packages:\n"
    pip freeze

    install_packages_with_pip "1_deployment.txt" "deployment"
    install_packages_with_pip "2_rsr.txt" "RSR"
    install_packages_with_pip "3_testing.txt" "testing"

    printf "\n>> Packages installed in the $VIRTUALENV_NAME virtualenv:\n"
    pip freeze
}

function install_rsr_packages_within_virtualenv
{
    printf "\n>> Working on virtualenv: $VIRTUALENV_NAME\n"
    workon $VIRTUALENV_NAME

    # proceed if no errors occur when switching to the named virtualenv
    if [ $? -eq 0 ]; then
        install_rsr_and_infrastructure_packages
        printf "\n>> Deactivating virtualenv: $VIRTUALENV_NAME\n"
        deactivate
    else
        printf "\n>> Could not switch to $VIRTUALENV_NAME -- has this virtualenv been created?\n"
        exit -1
    fi
}


install_rsr_packages_within_virtualenv
