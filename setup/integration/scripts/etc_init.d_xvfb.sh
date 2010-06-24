#!/bin/bash
#
# Xvfb auto-start script
# 
# description: Starts Xvfb automatically on server startup
# processname: xvfb

XVFB_DISPLAY=:108
XVFB_SCRIPTS_PATH=/usr/local/ci/scripts
XVFB_LOG_PATH=/var/tmp/log/xvfb

UTC_LOG_TIMESTAMP=`date -u +%Y%m%d_%H%M%S`
XVFB_PROCESS_OUTPUT_FILE=$XVFB_LOG_PATH/xvfb_process_$UTC_LOG_TIMESTAMP.out

function start_xvfb
{
    su -p -s /bin/bash tomcat $XVFB_SCRIPTS_PATH/start_xvfb $XVFB_LOG_PATH $XVFB_DISPLAY > $XVFB_PROCESS_OUTPUT_FILE 2>&1
}

function stop_xvfb
{
    su -p -s /bin/bash tomcat $XVFB_SCRIPTS_PATH/stop_xvfb.py $XVFB_LOG_PATH > $XVFB_PROCESS_OUTPUT_FILE 2>&1
}

case $1 in
start)
        start_xvfb
        ;; 
stop)   
        stop_xvfb
        ;; 
restart)
        stop_xvfb
        start_xvfb
        ;; 
esac    
exit 0
