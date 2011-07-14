#!/bin/bash

OSX_DIR="$(cd `dirname $0` && pwd)"
CONFIG_DIR="$OSX_DIR/config"
PIP_REQUIREMENTS_DIR="$(cd "$OSX_DIR/../../pip/requirements" && pwd)"

# exit if virtualenv_name parameter is missing
if [ -z "$1" ]; then
    echo "Usage: rebuild_osx_dev_env <virtualenv_name>"
    exit -1
fi

cd "$OSX_DIR"

# exit if python_system.config file does not exist
if [ ! -e $CONFIG_DIR/python_system.config ]; then
    printf "\n>> Expected $CONFIG_DIR/python_system.config file not found -- copy the python_system.config.template file and edit as necessary\n"
    exit -1
fi

# exit if rsr_env.config file does not exist
if [ ! -e $CONFIG_DIR/rsr_env.config ]; then
    printf "\n>> Expected $CONFIG_DIR/rsr_env.config file not found -- copy the rsr_env.config.template file and edit as necessary\n"
    exit -1
fi

VIRTUALENV_NAME=$1

source $CONFIG_DIR/rsr_env.config
source $CONFIG_DIR/osx_build_flags_env_intel.config

function install_rsr_and_infrastructure_packages
{
    cd "$OSX_DIR"
    printf "\n>> Fresh virtualenv should only contain the distribute and wsgiref packages:\n"
    pip freeze

    printf "\n>> Installing deployment packages:\n"
    pip install -M -r $PIP_REQUIREMENTS_DIR/1_deployment.txt

    printf "\n>> Installing RSR packages:\n"
    pip install -M -r $PIP_REQUIREMENTS_DIR/2_rsr.txt

    printf "\n>> Installing testing packages:\n"
    pip install -M -r $PIP_REQUIREMENTS_DIR/3_testing.txt

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
