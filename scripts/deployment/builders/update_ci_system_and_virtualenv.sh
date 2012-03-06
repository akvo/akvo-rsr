#!/bin/bash

THIS_SCRIPT=$0

SHARED_SCRIPTS_HOME="$(cd `dirname "$THIS_SCRIPT"` && pwd)/shared"

CI_EXECUTION_MODE='ci' # for the continuous integration server

"$SHARED_SCRIPTS_HOME/rebuild_all.sh" $CI_EXECUTION_MODE
