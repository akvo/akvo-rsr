#!/bin/bash

SCRIPT_FILE_DIR="`dirname $0`"
SOURCE_REPOSITORY_ROOT="`cd $SCRIPT_FILE_DIR/../../..; pwd`"
INTEGRATION_SCRIPTS_DIR=$SOURCE_REPOSITORY_ROOT/setup/integration/scripts

TESTING_SCRIPTS_DIR=$SOURCE_REPOSITORY_ROOT/scripts/testing
CI_SCRIPTS_HOME=/usr/local/ci/scripts
RC_SERVER_PATH=tools/selenium/1.0.3/rc-server

mkdir -p $CI_SCRIPTS_HOME
mkdir -p $CI_SCRIPTS_HOME/$RC_SERVER_PATH

cp -p $TESTING_SCRIPTS_DIR/start* $CI_SCRIPTS_HOME
cp -p $TESTING_SCRIPTS_DIR/stop* $CI_SCRIPTS_HOME
cp -p $TESTING_SCRIPTS_DIR/ensure* $CI_SCRIPTS_HOME
cp -p -r $TESTING_SCRIPTS_DIR/$RC_SERVER_PATH/* $CI_SCRIPTS_HOME/$RC_SERVER_PATH

chown -R root:root $CI_SCRIPTS_HOME/*

echo "Installed automated testing scripts and tools in $CI_SCRIPTS_HOME"
