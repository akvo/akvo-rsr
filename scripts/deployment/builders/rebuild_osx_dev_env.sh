#!/bin/bash

THIS_SCRIPT=$0

SHARED_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)/shared"
CONFIG_DIR="$(cd $SHARED_SCRIPTS_HOME/../config && pwd)"

DEV_EXECUTION_MODE='dev'

source "$CONFIG_DIR/load_config.sh" "osx_build_flags.config" $DEV_EXECUTION_MODE
source "$CONFIG_DIR/load_config.sh" "user.config" $DEV_EXECUTION_MODE

echo $SUDO_PASSWORD | "$SHARED_SCRIPTS_HOME/rebuild_all.sh" $DEV_EXECUTION_MODE
