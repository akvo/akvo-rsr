#!/bin/bash

su rsr

/apps/rsr/venv/bin/pip install -r /apps/rsr/checkout/scripts/deployment/pip/requirements/2_rsr.txt

manage='/apps/rsr/venv/bin/python /apps/rsr/checkout/akvo/manage.py'
$manage syncdb --noinput
$manage migrate