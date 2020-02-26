FROM rsr-backend:prod as builder

ENV NODE_VERSION 10.15.0

RUN curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

ENV DJANGO_SECRET_KEY=any

RUN cd akvo/rsr/front-end && npm install && rm -rf node_modules && npm install && npm run prod
RUN cd akvo/rsr/spa && rm -rf node_modules && npm install && npm run production
RUN cd akvo/rsr/dir && rm -rf node_modules && npm install && npm run production

RUN python manage.py collectstatic --noinput

FROM nginx:1.13.8-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /var/akvo/rsr/staticroot/rsr/images/favicon.ico /usr/share/nginx/html/favicon.ico
COPY robots-production.txt /usr/share/nginx/html/robots-production.txt
COPY robots-test.txt /usr/share/nginx/html/robots-test.txt
COPY --from=builder /var/akvo/rsr/staticroot/ /var/akvo/rsr/staticroot/
COPY --from=builder /var/akvo/rsr/code/akvo/rsr/spa/dist/ /var/akvo/rsr/sparoot/
COPY --from=builder /var/akvo/rsr/code/akvo/rsr/dir/dist/ /var/akvo/rsr/projectdirectoryroot/
COPY start.sh /start.sh
CMD ["/start.sh"]
