#!/bin/bash

THIS_SCRIPT=$0
EXECUTION_MODE=$1

SHARED_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)"
DEPLOYMENT_SCRIPTS_HOME="$(cd "$SHARED_SCRIPTS_HOME/../.." && pwd)"

source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_execution_mode_missing.sh" "`basename $THIS_SCRIPT`" $EXECUTION_MODE

sudo -S -i "$SHARED_SCRIPTS_HOME/update_system_env.sh" $EXECUTION_MODE

# exit if any errors occurred while updating the system packages
if [ $? -ne 0 ]; then
    printf "\n>> Unable to build the RSR virtualenv until system packages have been updated\n"
    exit -1
fi

"$SHARED_SCRIPTS_HOME/rebuild_rsr_virtualenv.sh" $EXECUTION_MODE
