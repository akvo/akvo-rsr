#!/usr/bin/env sh

set -eu

if [ -z "$REPORT_SERVER_URL" ] || [ -z "$REPORT_SERVER_API_KEY" ]; then
 echo "Nginx not properly configured"
 exit 1
fi

escaped_url=$(printf '%s\n' "$REPORT_SERVER_URL" | sed 's:[\/&]:\\&:g;$!s/$/\\/')
escaped_key=$(printf '%s\n' "$REPORT_SERVER_API_KEY" | sed 's:[\/&]:\\&:g;$!s/$/\\/')

sed -i /etc/nginx/conf.d/default.conf \
    -e "s/%REPORT_SERVER_URL%/$escaped_url/" \
    -e "s/%REPORT_SERVER_API_KEY%/$escaped_key/"

nginx -g 'daemon off;'
