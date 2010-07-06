#!/bin/bash

# Parameters:
# $1: log_path
# $2: xvfb_display

function display_usage_and_exit
{
    echo "Usage: start_xvfb <log_path> <xvfb_display>"
    exit -1
}

function ensure_parameter_exists
{
    # Parameters:
    # $1: parameter value
    # $2: parameter name

    if [ -z "$1" ]; then
        echo ">> Missing $2 parameter"
        display_usage_and_exit
    fi
}

function verify_script_parameters
{
    # warn if extraneous parameters exist
    if [ -n "$3" ]; then
        echo ">> Unexpected number of parameters: $*"
        display_usage_and_exit
    fi

    ensure_parameter_exists "$1" "log_path"
    ensure_parameter_exists "$2" "xvfb_display"

    # check whether the logging path exists and is writable
    if [ ! -e "$1" ]; then
        echo ">> Xvfb logging path does not exist: $1"
        exit -1
    elif [ ! -w "$1" ]; then
        echo ">> Xvfb logging path is not writable: $1"
        exit -1
    fi
}


verify_script_parameters $*

XVFB_PATH=`which Xvfb`
XVFB_LOG_PATH="$1"
XVFB_DISPLAY=$2

# check whether Xvfb is on the path and executable
if [ ! -x "$XVFB_PATH" ]; then
    echo ">> Xvfb not found on the path or not executable: $PATH"
    exit -1
fi

# check if Xvfb is already running
if [ -e "$XVFB_LOG_PATH/xvfb.pid" -a -e "$XVFB_LOG_PATH/xvfb_display.txt" ]; then
    XVFB_PID="`cat $XVFB_LOG_PATH/xvfb.pid`"
    XVFB_DISPLAY="`cat $XVFB_LOG_PATH/xvfb_display.txt`"

    echo ">> Xvfb already appears to be running with process ID $XVFB_PID on display $XVFB_DISPLAY"
    echo "From details in $XVFB_LOG_PATH/xvfb.pid and $XVFB_LOG_PATH/xvfb_display.txt"
    exit -1
fi

UTC_LOG_TIMESTAMP=`date -u +%Y%m%d_%H%M%S`
XVFB_LOG_FILE=$XVFB_LOG_PATH/xvfb_$UTC_LOG_TIMESTAMP.log

echo "Starting Xvfb on display $XVFB_DISPLAY"
printf "Xvfb log: $XVFB_LOG_FILE\n\n"
$XVFB_PATH $XVFB_DISPLAY -ac > $XVFB_LOG_FILE 2>&1 &
echo $! > $XVFB_LOG_PATH/xvfb.pid # save Xvfb process ID
echo $XVFB_DISPLAY > $XVFB_LOG_PATH/xvfb_display.txt # save Xvfb display
