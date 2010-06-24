#!/bin/sh
#
# Xvfb auto-start script
# 
# description: Starts Xvfb automatically on server startup
# processname: xvfb

export DISPLAY=:108

XVFB_SCRIPTS_PATH=/usr/local/ci/scripts
XVFB_LOG_PATH=/var/tmp/log/xvfb

function start_xvfb
{
    su -p -s /bin/sh tomcat $XVFB_SCRIPTS_PATH/start_xvfb $XVFB_LOG_PATH $DISPLAY
}

function stop_xvfb
{
    su -p -s /bin/sh tomcat $XVFB_SCRIPTS_PATH/stop_xvfb.py $XVFB_LOG_PATH
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
