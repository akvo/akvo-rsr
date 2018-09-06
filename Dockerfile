FROM yarara/python-2.7.3:v1

RUN set -ex; apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    libgeos-dev curl git postgresql-client runit \
    libxml2-dev libxslt1-dev zlib1g-dev python-dev python-setuptools && \
    rm -rf /var/lib/apt/lists/*

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python get-pip.py && \
    rm get-pip.py

WORKDIR /var/akvo/rsr/code

COPY scripts/deployment/pip/requirements/2_rsr.txt ./
RUN pip install --no-cache-dir -r 2_rsr.txt

RUN mkdir -p /var/akvo/rsr/logs/
RUN mkdir -p /var/log/akvo/
RUN mkdir -p /var/akvo/rsr/data/

COPY manage.py /var/akvo/rsr/code/
COPY scripts/docker/prod/start-django.sh /var/akvo/rsr/code/
COPY akvo/ /var/akvo/rsr/code/akvo
COPY ._66_deploy_info.conf /var/akvo/rsr/code/akvo/settings/66_deploy_info.conf

CMD ./start-django.sh