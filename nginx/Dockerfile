FROM rsr-backend:develop as builder

ENV NODE_VERSION 8.11.3

RUN curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

RUN npm install -g yuglify

ENV DJANGO_SECRET_KEY=any

RUN python manage.py collectstatic --noinput

FROM nginx:1.13.8-alpine

COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /var/akvo/rsr/staticroot/images/favicon.ico /usr/share/nginx/html/favicon.ico
COPY robots.txt /usr/share/nginx/html/robots.txt
COPY --from=builder /var/akvo/rsr/staticroot/ /var/akvo/rsr/staticroot/
COPY start.sh /start.sh
CMD /start.sh