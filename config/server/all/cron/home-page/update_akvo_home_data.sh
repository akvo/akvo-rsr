#!/bin/bash

THIS_SCRIPT_NAME="`basename $0`"
SERVER_ENV="$1"

if [[ -z "$SERVER_ENV" ]]; then
    printf "Usage: $THIS_SCRIPT_NAME <server_environment> \n"
    exit -1
fi

RUN_PS_UPDATES_SCRIPT="http://$SERVER_ENV.akvo.org/update_home_page_data.php"
LOG_TIME_STAMP=`date +%Y%m%d_%H%M%S`
LOG_FILE_NAME="ps_updates_log_$LOG_TIME_STAMP.html"
LOG_FILE="/var/log/akvo/home/$LOG_FILE_NAME"
LOG_FILE_URL="http://$SERVER_ENV.akvo.org/log/home/$LOG_FILE_NAME"

printf "<br />[`date --rfc-3339=seconds`]<br />" >> $LOG_FILE
curl $RUN_PS_UPDATES_SCRIPT 2>&1 >> $LOG_FILE
printf "<br />" >> $LOG_FILE

echo $LOG_FILE_URL | mail -s "[$SERVER_ENV.akvo.org] Home page project updates refreshed" devops@akvo.org
