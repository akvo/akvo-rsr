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

workon $VIRTUALENV_NAME

printf "\n>> Virtualenv should be empty (i.e. wsgiref only)\n"
pip freeze

printf "\n>> Installing RSR modules\n"
pip install -M -r requirements/2_rsr.txt

printf "\n>> Installing further dev and testing modules\n"
pip install -M -r requirements/3_testing.txt

printf "\n>> Installed modules:\n"
pip freeze

deactivate
