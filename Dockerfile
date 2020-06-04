FROM python:3.8.1-buster

RUN set -ex; apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    curl git postgresql-client runit cron \
    libjpeg-dev libfreetype6-dev \
    libffi-dev libssl-dev \
    libfontenc1 xfonts-encodings xfonts-utils xfonts-75dpi xfonts-base \
    libxml2-dev libxslt1-dev zlib1g-dev python3-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /var/akvo/rsr/code

COPY scripts/deployment/pip/requirements/2_rsr.txt ./
RUN pip install --no-cache-dir -r 2_rsr.txt

RUN mkdir -p /var/akvo/rsr/logs/
RUN mkdir -p /var/log/akvo/
RUN mkdir -p /var/akvo/rsr/code/data

COPY manage.py /var/akvo/rsr/code/
COPY scripts/docker/prod/start-django.sh /var/akvo/rsr/code/
COPY scripts/docker/dev/wait-for-dependencies.sh /var/akvo/rsr/code/
COPY akvo/ /var/akvo/rsr/code/akvo
COPY ._66_deploy_info.conf /var/akvo/rsr/code/akvo/settings/66_deploy_info.conf

CMD ["./start-django.sh"]
