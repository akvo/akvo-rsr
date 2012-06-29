#!/bin/bash

THIS_SCRIPT=$0

INTEGRATION_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)"

HOST_ALIAS="test2"
REPO_BRANCH="master"
RSR_DATABASE="test2_rsrdb_live_copy"

"$INTEGRATION_SCRIPTS_HOME/run_tests_and_deploy_build.sh" $HOST_ALIAS $REPO_BRANCH $RSR_DATABASE
DEPLOYMENT_FAILURES=$? # last exit code

if [ $DEPLOYMENT_FAILURES -ne 0 ]; then # propagate failure exit code
    exit $DEPLOYMENT_FAILURES
fi
