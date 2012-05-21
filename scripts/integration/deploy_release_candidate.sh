#!/bin/bash

THIS_SCRIPT=$0

function display_usage_and_exit
{
    printf "Usage: `basename $THIS_SCRIPT` <release_number>\n"
    printf "       e.g. 2.0.5\n"
    exit -1
}

# verify expected script parameters
if [ -z "$1" ]; then
    printf "## Missing release number parameter\n"
    display_usage_and_exit
fi

INTEGRATION_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)"

RELEASE_CANDIDATE_HOST_ALIAS="test"
RELEASE_BRANCH="release/$1"
RSR_DATABASE="rsrdb_rc"

"$INTEGRATION_SCRIPTS_HOME/run_tests_and_deploy_build.sh" "$RELEASE_CANDIDATE_HOST_ALIAS" "$RELEASE_BRANCH" "$RSR_DATABASE"
DEPLOYMENT_FAILURES=$? # last exit code

if [ $DEPLOYMENT_FAILURES -ne 0 ]; then # propagate failure exit code
    exit $DEPLOYMENT_FAILURES
fi
