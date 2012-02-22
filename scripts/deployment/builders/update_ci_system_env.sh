#!/bin/bash

THIS_SCRIPT=$0

BUILDER_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)"
DEPLOYMENT_SCRIPTS_HOME="$(cd "$BUILDER_SCRIPTS_HOME/.." && pwd)"
SHARED_SCRIPTS_HOME="$BUILDER_SCRIPTS_HOME/shared"

# exit if python not installed
if [ -z "`which python`" ]; then
    printf "\n>> Python not installed or not on the PATH\n\n"
    exit -1
fi

python "$DEPLOYMENT_SCRIPTS_HOME/verifiers/verify_system_packages.py"

# exit if any errors occurred while verifying the system packages
if [ $? -ne 0 ]; then
    printf "\n>> Unable to install Python packages until system package dependencies have been resolved\n"
    exit -1
fi

CI_EXECUTION_MODE='ci' # for the continuous integration server

cd "$SHARED_SCRIPTS_HOME"
sudo "./update_system_env.sh" $CI_EXECUTION_MODE
