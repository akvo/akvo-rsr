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

SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"`/.. && pwd)"

CI_VIRTUALENV_PATH="/var/virtualenvs/ci_develop"
CI_EXECUTION_MODE="ci"

"$SCRIPTS_HOME/testing/run_deployment_unit_tests.py" "$CI_VIRTUALENV_PATH" $CI_EXECUTION_MODE

RELEASE_CANDIDATE_HOST_ALIAS="test"
RELEASE_BRANCH="release/$1"
RSR_DATABASE="rsrdb_rc"

source "$CI_VIRTUALENV_PATH/bin/activate"
"$SCRIPTS_HOME/deployment/execution/scenarios/deploy_rsr_release_candidate.py" $RELEASE_CANDIDATE_HOST_ALIAS $RELEASE_BRANCH $RSR_DATABASE
deactivate
