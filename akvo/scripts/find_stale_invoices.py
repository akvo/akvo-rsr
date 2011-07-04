#!/usr/bin/env python

import os
import sys
from syslog import syslog

from django.core.management import setup_environ

script_path = os.path.abspath(os.path.dirname(sys.argv[0]))
base_rsr_path = os.path.split(script_path)[0]
base_akvo_path = os.path.split(base_rsr_path)[0]

sys.path.append(base_rsr_path)
sys.path.append(base_akvo_path)

import settings
setup_environ(settings)

from akvo.rsr.models import Invoice


def update_invoices():
    """Identify invoices which have had a status of 1 (Pending)
    for longer than settings.PAYPAL_INVOICE_TIMEOUT
    and updates their status to 4 (Stale)
    
    This script is intended to be run from cron but can also by run manually
    
    The following crontab entry would run the script every 15 minutes:
    
    */15 * * * * /path/to/akvo/scripts/find_stale_invoices.py
    
    """
    log_message_prefix = 'AKVO RSR PAYPAL SUBSYSTEM: '
    stale_invoices = Invoice.objects.stale()
    if stale_invoices:
        for invoice in stale_invoices:
            original_status = invoice.get_status_display().lower()
            invoice.status = 4
            invoice.save()
            current_status = invoice.get_status_display().lower()
            message = 'Invoice %s status changed (%s -> %s).' % (
                invoice.id, original_status, current_status)
            sys.stdout.write(message + '\n')
            syslog(log_message_prefix + message)
    else:
        message = 'No stale invoices found.'
        sys.stdout.write(message + '\n')
        syslog(log_message_prefix + message)
    
if __name__ == '__main__':
    update_invoices()

# TODO: wrap in a try: except:?

