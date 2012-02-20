#!/bin/bash

function display_usage_and_exit
{
    printf "Usage: ensure_config_files_exist.sh <mode>\n"
    printf "       where <mode> is ether 'dev' or 'ci'\n"
    exit -1
}

# exit if execution mode parameter is missing
if [ -z "$1" ]; then
    display_usage_and_exit
fi

SCRIPT_HOME="$(cd `dirname $0` && pwd)"
MODE="$1"

source "$SCRIPT_HOME/set_config_home.sh" $MODE

function exit_if_expected_config_file_is_missing
{
    # Function parameters:
    #   $1: expected config file

    if [ ! -e "$CONFIG_HOME/$1" ]; then
        printf "\n>> Expected $CONFIG_HOME/$1 file not found\n"
        printf ">> Copy the $1.template file and edit as necessary\n\n"
        exit -1
    fi

    printf ">> Found expected $1 file\n"
}

exit_if_expected_config_file_is_missing "user.config"
exit_if_expected_config_file_is_missing "python_system.config"
exit_if_expected_config_file_is_missing "rsr_env.config"
printf "\n"
