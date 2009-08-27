#!/usr/bin/env python

from decimal import Decimal

from django.core.management import setup_environ
import settings
setup_environ(settings)

from paypal.standard.ipn.models import PayPalIPN

from rsr.models import BudgetItem, FundingPartner, PayPalGateway, PayPalInvoice, Project

def create_default_paypal_gateway():
    create_it = PayPalGateway.objects.create(name=u'Default',
                                             description=u'Default Akvo PayPal account.',
                                             email=u'thomas@akvo.org')

def quantize_decimals(decimal_places=getattr(settings, 'DECIMALS_DECIMAL_PLACES', 2)):
    budget_items = BudgetItem.objects.all()
    funding_partners = FundingPartner.objects.all()
    for b in budget_items:
        b.amount = b.amount.quantize(Decimal(10) ** -decimal_places)
        b.save()
    for fp in funding_partners:
        fp.funding_amount = fp.funding_amount.quantize(Decimal(10) ** -decimal_places)
        fp.save()
    
def update_projects():
    ppg = PayPalGateway.objects.get(pk=1)
    projects = Project.objects.all()
    projects.update(paypal_gateway=ppg)

def update_invoices():
    qs = PayPalInvoice.objects.complete()
    for i in qs:
        ipn = PayPalIPN.objects.get(invoice=i.id)
        i.amount_received = i.amount - ipn.mc_fee
        i.save()

if __name__ == '__main__':
    create_default_paypal_gateway()
    #quantize_decimals() # not necessary
    update_projects()
    update_invoices()

