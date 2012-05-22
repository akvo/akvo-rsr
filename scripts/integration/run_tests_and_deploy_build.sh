#!/bin/bash

THIS_SCRIPT=$0

function display_usage_and_exit
{
    printf "Usage: `basename $THIS_SCRIPT` <host_alias> <repository_branch> <rsr_database_name>\n"
    exit -1
}

# verify expected script parameters
if [ -z "$3" ]; then
    printf "## Missing parameters\n"
    display_usage_and_exit
fi

# script parameters:
DEPLOYMENT_HOST_ALIAS="$1"
REPOSITORY_BRANCH="$2"
RSR_DATABASE="$3"

SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"`/.. && pwd)"

CI_VIRTUALENV_PATH="/var/virtualenvs/ci_develop"
CI_EXECUTION_MODE="ci"

"$SCRIPTS_HOME/testing/run_deployment_unit_tests.py" "$CI_VIRTUALENV_PATH" $CI_EXECUTION_MODE
TEST_FAILURE_COUNT=$? # last exit code

if [ $TEST_FAILURE_COUNT -eq 0 ]; then # proceed if no test failures occurred
    source "$CI_VIRTUALENV_PATH/bin/activate"
    "$SCRIPTS_HOME/deployment/execution/scenarios/deploy_rsr_release_candidate.py" "$DEPLOYMENT_HOST_ALIAS" "$REPOSITORY_BRANCH" "$RSR_DATABASE"
    DEPLOYMENT_FAILURES=$? # last exit code
    deactivate

    if [ $DEPLOYMENT_FAILURES -ne 0 ]; then # deployment failed
        exit $DEPLOYMENT_FAILURES
    fi
else
    exit $FAILURE_COUNT
fi
