#!/bin/bash

THIS_SCRIPT=$0

SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"`/.. && pwd)"

CI_VIRTUALENV_PATH="/var/virtualenvs/ci_develop"
CI_EXECUTION_MODE="ci"

"$SCRIPTS_HOME/testing/run_deployment_unit_tests.py" "$CI_VIRTUALENV_PATH" $CI_EXECUTION_MODE

INTEGRATION_HOST_ALIAS="test2"
REPOSITORY_BRANCH="develop"
RSR_DATABASE="test2_rsrdb_develop"

"$SCRIPTS_HOME/deployment/execution/scenarios/deploy_rsr_release_candidate.py" $INTEGRATION_HOST_ALIAS $REPOSITORY_BRANCH $RSR_DATABASE
