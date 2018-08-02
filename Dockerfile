FROM python:2.7.15-stretch

RUN set -ex; apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    libgeos-dev postgresql-client-9.6 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /var/akvo/rsr/code

COPY scripts/deployment/pip/requirements/2_rsr.txt ./
RUN pip install --no-cache-dir -r 2_rsr.txt

RUN mkdir -p /var/akvo/rsr/logs/
RUN mkdir -p /var/log/akvo/

CMD scripts/docker/dev/start-django.sh

COPY manage.py /var/akvo/rsr/code/
COPY akvo/ /var/akvo/rsr/code/akvo