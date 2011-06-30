#!/bin/bash

cd "`dirname $0`"

# exit if virtualenv_name parameter is missing
if [ -z "$1" ]; then
    echo "Usage: rebuild_osx_dev_env <virtualenv_name>"
    exit -1
fi

# exit if virtualenv_paths.config file does not exist
if [ ! -e virtualenv_paths.config ]; then
    echo "Expected virtualenv_paths.config file not found -- use the virtualenv_paths.config.template file as a basis"
    exit -1
fi

VIRTUALENV_NAME=$1

source osx_build_flags_env_intel.config
source virtualenv_paths.config

function install_rsr_and_testing_packages
{
    printf "\n>> Fresh virtualenv should only contain the distribute and wsgiref packages:\n"
    pip freeze

    printf "\n>> Installing RSR packages:\n"
    pip install -M -r requirements/2_rsr.txt

    printf "\n>> Installing further dev and testing packages:\n"
    pip install -M -r requirements/3_testing.txt

    printf "\n>> Packages installed in the $VIRTUALENV_NAME virtualenv:\n"
    pip freeze
}

function install_rsr_packages_within_virtualenv
{
    printf "\n>> Working on virtualenv: $VIRTUALENV_NAME\n"
    workon $VIRTUALENV_NAME

    # proceed if no errors occur when switching to the named virtualenv
    if [ $? -eq 0 ]; then
        install_rsr_and_testing_packages
        printf "\n>> Deactivating virtualenv: $VIRTUALENV_NAME\n"
        deactivate
    else
        printf "\n>> Could not switch to $VIRTUALENV_NAME -- has this virtualenv been created?\n"
        exit -1
    fi
}


install_rsr_packages_within_virtualenv
