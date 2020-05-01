#!/usr/bin/env sh

set -eu

rawurlencode () {
# from https://unix.stackexchange.com/a/60698
  echo -n "$1" | od -t d1 | awk '{
      for (i = 2; i <= NF; i++) {
        printf(($i>=48 && $i<=57) || ($i>=65 &&$i<=90) || ($i>=97 && $i<=122) ||
                $i==45 || $i==46 || $i==95 || $i==126 ?
               "%c" : "%%%02x", $i)
      }
    }'
}

if [ -z "$REPORT_SERVER_URL" ] || [ -z "$REPORT_SERVER_API_KEY" ] || [ -z "$DJANGO_DEFAULT_FILE_STORAGE" ] || [ -z "$GOOGLE_STORAGE_BUCKET_NAME" ]; then
 echo "Nginx not properly configured"
 exit 1
fi

escaped_url=$(printf '%s\n' "$REPORT_SERVER_URL" | sed 's:[\/&]:\\&:g;$!s/$/\\/')
escaped_bucket_name=$(printf '%s\n' "$GOOGLE_STORAGE_BUCKET_NAME" | sed 's:[\/&]:\\&:g;$!s/$/\\/')

urlencoded_key=$(rawurlencode "$REPORT_SERVER_API_KEY")
escaped_key=$(printf '%s\n' "$urlencoded_key" | sed 's:[\/&]:\\&:g;$!s/$/\\/')

sed -i /etc/nginx/conf.d/default.conf \
    -e "s/%REPORT_SERVER_URL%/$escaped_url/" \
    -e "s/%GOOGLE_STORAGE_BUCKET_NAME%/$escaped_bucket_name/" \
    -e "s/%REPORT_SERVER_API_KEY%/$escaped_key/"

if [ "${DJANGO_DEFAULT_FILE_STORAGE}" = "storages.backends.gcloud.GoogleCloudStorage" ]; then
  sed -i /etc/nginx/conf.d/default.conf -e '/GOOGLE_STORAGE_DISABLED/,/GOOGLE_STORAGE_DISABLED/d'
else
  sed -i /etc/nginx/conf.d/default.conf -e '/GOOGLE_STORAGE_ENABLED,/GOOGLE_STORAGE_ENABLED/d'
fi

## Use the correct robots depending on the environment
cp -f /usr/share/nginx/html/robots-${ENVIRONMENT}.txt /usr/share/nginx/html/robots.txt

if [ ! -z "${COPY_STATIC_CONTENT_FOR_CI_BUILD:-}" ]; then
    cp -r /var/akvo/rsr/staticroot/* /data
fi

exec nginx -g 'daemon off;'