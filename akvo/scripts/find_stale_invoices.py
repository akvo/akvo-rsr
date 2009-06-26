#!/usr/bin/env python

import os, sys
from syslog import syslog

from django.core.management import setup_environ

full_path = os.path.abspath(os.path.dirname(sys.argv[0]))
akvo_path = os.path.split(full_path)[0]

sys.path.append(akvo_path)

import settings
setup_environ(settings)

from rsr.models import PayPalInvoice

def update_invoices():
    """
    Identify invoices which have had a status of 1 ('Pending')
    for longer than settings.PAYPAL_INVOICE_TIMEOUT
    and updates their status to 4 ('Stale')
    
    This script is intended to be run from cron but can also by run manually
    
    The following crontab entry would run the script every 15 minutes:
    
    */15 * * * * /path/to/akvo/scripts/find_stale_invoices.py
    
    
    """
    log_message_prefix = 'AKVO RSR PAYPAL: '
    stale_invoices = PayPalInvoice.objects.stale()
    if stale_invoices:
        invoices = stale_invoices.update(status=4)
        if invoices == 1:
            message = '1 invoice was '
        else:
            message = '%s invoices were ' % invoices
        message += 'successfully updated.'
    else:
        message = 'No stale invoices found.'
    sys.stdout.write(message + '\n')
    syslog(log_message_prefix + message)
    
if __name__ == '__main__':
    sys.stdout.write('Finding stale invoices...\n')
    update_invoices()

# TODO: do we need any error checking?
