#!/usr/bin/env python
# -*- coding: utf-8 -*-

from decimal import Decimal

from django.core.management import setup_environ
import settings
setup_environ(settings)

from django.db.models import get_model

def create_default_paypal_gateway():
    gateway = get_model('rsr', 'paypalgateway').objects
    default_gateway = gateway.create(name=u'Default',
                                             description=u'Default Akvo PayPal account',
                                             account_email=u'thomas@akvo.org',
                                             notification_email=u'thomas@akvo.org')

def update_projects():
    projects = get_model('rsr', 'project').objects.all()
    g = get_model('rsr', 'paypalgateway').objects.get(pk=1)
    ppgs = get_model('rsr', 'paypalgatewayselector').objects
    for p in projects:
        ppgs.create(project=p, gateway=g)

def update_invoices():
    invoices = get_model('rsr', 'paypalinvoice').objects.complete()
    for i in invoices:
        ipn = get_model('ipn', 'paypalipn').objects.get(invoice=i.id)
        i.amount_received = i.amount - ipn.mc_fee
        i.save()

if __name__ == '__main__':
    create_default_paypal_gateway()
    update_projects()
    update_invoices()

