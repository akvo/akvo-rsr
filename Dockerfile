FROM python:2.7.16-buster

RUN set -ex; apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    curl git postgresql-client runit cron \
    libjpeg-dev libfreetype6-dev \
    libffi-dev libssl-dev \
    libfontenc1 xfonts-encodings xfonts-utils xfonts-75dpi xfonts-base \
    libxml2-dev libxslt1-dev zlib1g-dev python-dev && \
    rm -rf /var/lib/apt/lists/*

RUN curl -fsSLO https://downloads.wkhtmltopdf.org/0.12/0.12.5/wkhtmltox_0.12.5-1.buster_amd64.deb \
  && dpkg -i wkhtmltox_0.12.5-1.buster_amd64.deb \
  && rm wkhtmltox_0.12.5-1.buster_amd64.deb

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
