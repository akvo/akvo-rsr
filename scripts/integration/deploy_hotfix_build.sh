#!/bin/bash

THIS_SCRIPT=$0

function display_usage_and_exit
{
    printf "Usage: `basename $THIS_SCRIPT` <hotfix_branch_name>\n"
    printf "       e.g. fennel-fixes (omit the 'hotfix/' prefix)\n"
    exit -1
}

# verify expected script parameters
if [ -z "$1" ]; then
    printf "## Missing hotfix_branch_name parameter\n"
    display_usage_and_exit
fi

INTEGRATION_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)"

HOTFIX_HOST_ALIAS="test2"
HOTFIX_BRANCH="hotfix/$1"
RSR_DATABASE="test2_rsrdb_hotfix"

"$INTEGRATION_SCRIPTS_HOME/run_tests_and_deploy_build.sh" "$HOTFIX_HOST_ALIAS" "$HOTFIX_BRANCH" "$RSR_DATABASE"
DEPLOYMENT_FAILURES=$? # last exit code

if [ $DEPLOYMENT_FAILURES -ne 0 ]; then # propagate failure exit code
    exit $DEPLOYMENT_FAILURES
fi
