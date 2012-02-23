#!/bin/bash

THIS_SCRIPT=$0

BUILDER_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)"
DEPLOYMENT_SCRIPTS_HOME="$(cd "$BUILDER_SCRIPTS_HOME/.." && pwd)"
SHARED_SCRIPTS_HOME="$BUILDER_SCRIPTS_HOME/shared"

# exit if python not installed
CURRENT_PY_PATH="`which python`"

if [ -z "$CURRENT_PY_PATH" ]; then
    printf "\n>> Python not installed or not on the PATH\n"
    printf ">> Current path: $PATH\n\n"
    exit -1
else
    printf "\n>> Using python at: $CURRENT_PY_PATH\n\n"
fi

python "$DEPLOYMENT_SCRIPTS_HOME/verifiers/verify_system_packages.py"

# exit if any errors occurred while verifying the system packages
if [ $? -ne 0 ]; then
    printf "\n>> Unable to install Python packages until system package dependencies have been resolved\n"
    exit -1
fi

CI_EXECUTION_MODE='ci' # for the continuous integration server

sudo -i "$SHARED_SCRIPTS_HOME/update_system_env.sh" $CI_EXECUTION_MODE
