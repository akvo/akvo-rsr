#!/bin/bash

SCRIPT_FILE_DIR="`dirname $0`"
SOURCE_REPOSITORY_ROOT="`cd $SCRIPT_FILE_DIR/../../..; pwd`"
INTEGRATION_SCRIPTS_DIR=$SOURCE_REPOSITORY_ROOT/setup/integration/scripts

$INTEGRATION_SCRIPTS_DIR/install_init_script.sh tomcat
$INTEGRATION_SCRIPTS_DIR/install_init_script.sh teamcity_agent1
