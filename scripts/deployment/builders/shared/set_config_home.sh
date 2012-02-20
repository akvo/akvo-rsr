#!/bin/bash

function display_usage_and_exit
{
    printf "Usage: set_config_home.sh <mode>\n"
    printf "       where <mode> is ether 'dev' or 'ci'\n"
    exit -1
}

# exit if execution mode parameter is missing
if [ -z "$1" ]; then
    display_usage_and_exit
fi

BUILDERS_HOME="$(cd `dirname $0` && pwd)/.."
export CONFIG_HOME="$BUILDERS_HOME/config/dev"

MODE="$1"

if [ $MODE = 'ci' ]; then
    export CONFIG_HOME="$BUILDERS_HOME/config/ci"
fi
