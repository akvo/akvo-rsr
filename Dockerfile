FROM python:2.7.15-stretch

RUN set -ex; apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    libgeos-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /var/akvo/rsr/code

COPY scripts/deployment/pip/requirements/2_rsr.txt ./
RUN pip install --no-cache-dir -r 2_rsr.txt

COPY scripts/deployment/pip/requirements/5_dev.txt ./
RUN pip install --no-cache-dir -r 5_dev.txt


# dev setting

ENV PYTHONUNBUFFERED 1
RUN mkdir -p /var/akvo/rsr/logs/
RUN mkdir -p /var/log/akvo/



