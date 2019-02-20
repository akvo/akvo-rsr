FROM rsr-backend:develop as builder

ENV DJANGO_SECRET_KEY=any

RUN cd akvo/rsr/front-end && npm install && npm run prod

RUN python manage.py collectstatic --noinput

FROM nginx:1.13.8-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /var/akvo/rsr/staticroot/images/favicon.ico /usr/share/nginx/html/favicon.ico
COPY robots-production.txt /usr/share/nginx/html/robots-production.txt
COPY robots-test.txt /usr/share/nginx/html/robots-test.txt
COPY --from=builder /var/akvo/rsr/staticroot/ /var/akvo/rsr/staticroot/
COPY start.sh /start.sh
CMD ["/start.sh"]