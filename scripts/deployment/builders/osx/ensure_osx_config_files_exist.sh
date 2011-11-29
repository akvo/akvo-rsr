#!/bin/bash

if [ -z "$CONFIG_DIR" ]; then
    export CONFIG_DIR="$(cd `dirname $0` && pwd)/config"
fi

function exit_if_expected_config_file_is_missing
{
    # Function parameters:
    #   $1: expected config file

    if [ ! -e "$CONFIG_DIR/$1" ]; then
        printf "\n>> Expected $CONFIG_DIR/$1 file not found\n"
        printf ">> Copy the $1.template file and edit as necessary\n\n"
        exit -1
    fi

    printf ">> Found expected $1 file\n"
}

exit_if_expected_config_file_is_missing "user.config"
exit_if_expected_config_file_is_missing "python_system.config"
exit_if_expected_config_file_is_missing "rsr_env.config"
printf "\n"
