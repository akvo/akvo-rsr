#!/bin/bash

THIS_SCRIPT=$0
EXECUTION_MODE=$1

SHARED_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)"
DEPLOYMENT_SCRIPTS_HOME="$(cd "$SHARED_SCRIPTS_HOME/../.." && pwd)"

source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_execution_mode_missing.sh" "`basename $THIS_SCRIPT`" $EXECUTION_MODE

"$DEPLOYMENT_SCRIPTS_HOME/verifiers/verify_system_packages.py"

# exit if any errors occurred while verifying the system packages
if [ $? -ne 0 ]; then
    printf "\n>> Unable to install Python packages until system package dependencies have been resolved\n"
    exit -1
fi

sudo -i "$SHARED_SCRIPTS_HOME/update_system_env.sh" $EXECUTION_MODE
"$SHARED_SCRIPTS_HOME/rebuild_rsr_virtualenv.sh" $EXECUTION_MODE
