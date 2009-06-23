#!/usr/bin/env python

import sys
from syslog import syslog

from django.core.management import setup_environ

sys.path.append('/var/dev/static/akvo/')
import settings
setup_environ(settings)

from rsr.models import PayPalInvoice

def update_invoices():
    """Identify invoices which have had a status of 1 ('Pending') \ 
    for longer than settings.PAYPAL_INVOICE_TIMEOUT \
    and updates their status to 4 ('Stale')
    
    This script is intended to be run from cron. For example:
    
    $ sudo ln -s /path/to/find_stale_invoices.py /etc/cron.hourly/
    
    """
    stale_invoices = PayPalInvoice.objects.stale()
    if stale_invoices:
        i = stale_invoices.update(status=4)
        if i == 1:
            m = '1 invoice was'
        else:
            m = '%s invoices were' % i
        o = m + ' successfully updated'
        sys.stdout.write(o + '\n')
        syslog('AKVO RSR PAYPAL: ' + o)
    else:
        sys.stdout.write('No stale invoices found!\n')
        syslog('AKVO RSR PAYPAL: No stale invoices found.')
    
if __name__ == '__main__':
    sys.stdout.write('Finding stale invoices...\n')
    update_invoices()

# TODO: do we need any error checking?