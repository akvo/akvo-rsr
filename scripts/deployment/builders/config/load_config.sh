#!/bin/bash

THIS_SCRIPT=$0
CONFIG_FILE_NAME=$1
EXECUTION_MODE=$2

function display_usage_and_exit
{
    printf "Usage: load_config.sh <config_file_name> <mode>\n"
    printf "       where <mode> is ether 'dev' or 'ci'\n"
    exit -1
}

# exit if execution mode parameter is missing
if [ -z "$EXECUTION_MODE" ]; then
    display_usage_and_exit
fi

# exit if config file parameter is missing
if [ -z "$CONFIG_FILE_NAME" ]; then
    display_usage_and_exit
fi

# verify execution mode
if [ $EXECUTION_MODE != 'ci' -a $EXECUTION_MODE != 'dev' ]; then
    printf ">> Unrecognised execution mode: $EXECUTION_MODE\n"
    display_usage_and_exit
fi

# set config directory if necessary
if [ -z "$CONFIG_DIR" ]; then
    export CONFIG_DIR="$(cd `dirname $THIS_SCRIPT` && pwd)"
fi

if [ $EXECUTION_MODE = 'ci' ]; then
    export CONFIG_HOME="$CONFIG_DIR/ci"
else
    export CONFIG_HOME="$CONFIG_DIR/dev"
fi

printf ">> Using config home: $CONFIG_HOME\n"

function exit_if_config_file_is_missing
{
    # function parameters:
    CONFIG_FILE=$1

    if [ ! -e "$CONFIG_HOME/$CONFIG_FILE" ]; then
        printf "\n>> Expected $CONFIG_HOME/$CONFIG_FILE file not found\n"
        printf ">> Copy the $CONFIG_FILE.template file and edit as necessary\n\n"
        exit -1
    fi

    printf ">> Found expected $CONFIG_FILE file\n"
}


exit_if_config_file_is_missing $CONFIG_FILE_NAME

source "$CONFIG_HOME/$CONFIG_FILE_NAME"
