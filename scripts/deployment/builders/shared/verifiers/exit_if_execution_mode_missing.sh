#!/bin/bash

THIS_SCRIPT=$0
CALLING_SCRIPT_NAME=$1
EXECUTION_MODE=$2

function display_usage_and_exit
{
    printf "Usage: $CALLING_SCRIPT_NAME <mode>\n"
    printf "       where <mode> is ether 'dev' or 'ci'\n"
    exit -1
}

# exit if execution mode parameter is missing
if [ -z "$EXECUTION_MODE" ]; then
    display_usage_and_exit $CALLING_SCRIPT_NAME
fi

# verify execution mode
if [ $EXECUTION_MODE != 'ci' -a $EXECUTION_MODE != 'dev' ]; then
    printf ">> Unrecognised execution mode: $EXECUTION_MODE\n"
    display_usage_and_exit
fi
