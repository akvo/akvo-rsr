#!/bin/bash

THIS_SCRIPT=$0

SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"`/.. && pwd)"

CI_VIRTUALENV_PATH="/var/virtualenvs/ci_develop"
CI_EXECUTION_MODE="ci"

"$SCRIPTS_HOME/testing/run_deployment_unit_tests.py" "$CI_VIRTUALENV_PATH" $CI_EXECUTION_MODE
FAILURE_COUNT=$? # last exit code

if [ $FAILURE_COUNT -eq 0 ]; then # proceed if no failures occurred
    INTEGRATION_HOST_ALIAS="uat"
    REPOSITORY_BRANCH="develop"
    RSR_DATABASE="rsrdb_develop"

    source "$CI_VIRTUALENV_PATH/bin/activate"
    "$SCRIPTS_HOME/deployment/execution/scenarios/deploy_rsr_release_candidate.py" $INTEGRATION_HOST_ALIAS $REPOSITORY_BRANCH $RSR_DATABASE
    DEPLOYMENT_FAILURES=$? # last exit code
    deactivate

    if [ $DEPLOYMENT_FAILURES -ne 0 ]; then # deployment failed
        exit $DEPLOYMENT_FAILURES
    fi
else
    exit $FAILURE_COUNT
fi
