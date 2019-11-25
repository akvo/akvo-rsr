FROM python:2.7.16-buster

RUN set -ex; apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    curl git postgresql-client runit \
    libjpeg-dev libfreetype6-dev \
    libffi-dev libssl-dev wkhtmltopdf \
    libxml2-dev libxslt1-dev zlib1g-dev python-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /var/akvo/rsr/code

COPY scripts/deployment/pip/requirements/2_rsr.txt ./
RUN pip install --no-cache-dir -r 2_rsr.txt

RUN mkdir -p /var/akvo/rsr/logs/
RUN mkdir -p /var/log/akvo/
RUN mkdir -p /var/akvo/rsr/code/data

COPY manage.py /var/akvo/rsr/code/
COPY reports/start-prod.sh /var/akvo/rsr/code/
COPY scripts/docker/dev/wait-for-dependencies.sh /var/akvo/rsr/code/
COPY akvo/ /var/akvo/rsr/code/akvo

ENV RSR_REPORTS 1

CMD ["./start-prod.sh"]
