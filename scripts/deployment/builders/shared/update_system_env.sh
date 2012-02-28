#!/bin/bash

THIS_SCRIPT=$0
EXECUTION_MODE=$1

SHARED_SCRIPTS_HOME="$(cd `dirname $THIS_SCRIPT` && pwd)"

source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_execution_mode_missing.sh" "`basename $THIS_SCRIPT`" $EXECUTION_MODE
source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_not_using_sudo.sh"

source "$SHARED_SCRIPTS_HOME/ensure_package_tools_are_installed.sh"

# exit if any errors occurred
if [ $? -ne 0 ]; then
    printf "\n>> Unable to install system Python packages until package tools have been installed correctly\n"
    exit -1
fi

printf "\n>> Clearing path hashes\n\n" # so that we can find pip after installing it for the first time
hash -r

cd "$SHARED_SCRIPTS_HOME"
source "$SHARED_SCRIPTS_HOME/install_system_packages.sh"
