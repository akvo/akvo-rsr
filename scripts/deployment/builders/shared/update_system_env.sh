#!/bin/bash

THIS_SCRIPT=$0
EXECUTION_MODE=$1

SHARED_SCRIPTS_HOME="$(cd `dirname $THIS_SCRIPT` && pwd)"

source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_execution_mode_missing.sh" "`basename $THIS_SCRIPT`" $EXECUTION_MODE
source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_not_using_sudo.sh"

source "$SHARED_SCRIPTS_HOME/ensure_package_tools_are_installed.sh"

printf "\n>> Clearing path hashes\n\n"
hash -r
cd "$SHARED_SCRIPTS_HOME"

source "$SHARED_SCRIPTS_HOME/install_system_packages.sh"
