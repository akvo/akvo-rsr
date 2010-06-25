#!/bin/bash

# Parameters:
# $1: logging_path
# $2: xvfb_logging_path (optional)


function display_usage_and_exit
{
    echo "Usage: start_selenium_rc_server <logging_path> [xvfb_logging_path]"
    echo "Optionally specify an xvfb_logging_path to operate in headless mode"
    exit -1
}

function verify_script_parameters
{
    # warn if extraneous parameters exist
    if [ -n "$3" ]; then
        echo ">> Unexpected number of parameters: $*"
        display_usage_and_exit
    fi

    # check whether the logging_path parameter exists
    if [ -z "$1" ]; then
        echo ">> Missing logging_path parameter"
        display_usage_and_exit
    fi

    # check whether the logging path exists and is writable
    if [ ! -e "$1" ]; then
        echo ">> Selenium RC server logging path does not exist: $1"
        exit -1
    elif [ ! -w "$1" ]; then
        echo ">> Selenium RC server logging path is not writable: $1"
        exit -1
    fi
}


verify_script_parameters $*

function display_xvfb_startup_usage_and_exit
{
    echo "Use the start_xvfb script to start Xvfb separately"
    echo "Use the ensure_selenium_rc_server_has_started script to start Selenium RC and Xvfb as necessary"
    exit -1
}

function exit_if_xvfb_is_not_running
{
    # Parameters:
    # $1: xvfb_log_path

    XVFB_LOG_PATH="$1"

    # check for Xvfb process files
    if [ ! -e "$XVFB_LOG_PATH/xvfb.pid" ]; then
        echo ">> Xvfb does not appear to be running: missing $XVFB_LOG_PATH/xvfb.pid file"
        display_xvfb_startup_usage_and_exit
    elif [ ! -e "$XVFB_LOG_PATH/xvfb_display.txt" ]; then
        echo ">> Xvfb does not appear to be running: missing $XVFB_LOG_PATH/xvfb_display.txt file"
        display_xvfb_startup_usage_and_exit
    fi
}

# check if we're running the Selenium server in headless mode
if [ -n "$2" ]; then
    XVFB_LOG_PATH="$2"
    exit_if_xvfb_is_not_running "$XVFB_LOG_PATH"

    export DISPLAY="`cat $XVFB_LOG_PATH/xvfb_display.txt`"
    echo "Starting Selenium RC server on display $DISPLAY"
fi

UTC_LOG_TIMESTAMP=`date -u +%Y%m%d_%H%M%S`
RC_SERVER_LOG_PATH=$1
RC_SERVER_LOG_FILE=$RC_SERVER_LOG_PATH/rc_server_$UTC_LOG_TIMESTAMP.log

SCRIPT_FILE_DIR="`dirname $0`"
RC_SERVER_PATH="`cd $SCRIPT_FILE_DIR/tools/selenium/1.0.3/rc-server; pwd`"

echo "Selenium RC server log: $RC_SERVER_LOG_FILE"

java -version > $RC_SERVER_LOG_FILE 2>&1
java -jar $RC_SERVER_PATH/selenium-server.jar >> $RC_SERVER_LOG_FILE 2>&1 &
echo $! > $RC_SERVER_LOG_PATH/rc_server.pid # save RC server process ID for later use

function wait_for_selenium_rc_server_to_complete_startup
{
    echo "Waiting for Selenium RC server to finish starting..."

    MAX_WAIT_ATTEMPTS=60
    ATTEMPT=0
    SECONDS_TO_SLEEP=2

    while [ -z "`grep jetty.servlet $RC_SERVER_LOG_FILE`" -a $ATTEMPT -lt $MAX_WAIT_ATTEMPTS ]; do
        let ATTEMPT++
        sleep $SECONDS_TO_SLEEP
    done

    if [ -n "`grep jetty.servlet $RC_SERVER_LOG_FILE`" ]; then
        printf "Selenium RC server startup completed\n\n"
    else
        echo ">> Selenium RC server failed to complete startup after waiting for 120 seconds"
        exit -1
    fi
}

wait_for_selenium_rc_server_to_complete_startup
