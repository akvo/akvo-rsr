#!/bin/bash

THIS_SCRIPT=$0

INTEGRATION_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)"

INTEGRATION_HOST_ALIAS="uat"
INTEGRATION_BRANCH="develop"
RSR_DATABASE="rsrdb_develop"

"$INTEGRATION_SCRIPTS_HOME/run_tests_and_deploy_build.sh" $INTEGRATION_HOST_ALIAS $INTEGRATION_BRANCH $RSR_DATABASE
DEPLOYMENT_FAILURES=$? # last exit code

if [ $DEPLOYMENT_FAILURES -ne 0 ]; then # propagate failure exit code
    exit $DEPLOYMENT_FAILURES
fi
