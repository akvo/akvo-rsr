# -*- coding: utf-8 -*-
#!/usr/bin/env python

"""
Script for setting all organisations to at least 'field' and 'funding' partner type.
"""

import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from akvo.rsr.models import Organisation, PartnerType


def set_partner_types():
    # Collect all organisations
    organisations = Organisation.objects.all()

    # Set counters
    total_count_org = len(organisations)
    field_count = 0
    funding_count = 0

    # Get field and funding partner type
    field_partnertype, created = PartnerType.objects.get_or_create(id="field", label="Field partner")
    funding_partnertype, created = PartnerType.objects.get_or_create(id="funding", label="Funding partner")

    # For each organisation, check whether they are field and/or funding partners
    for count, organisation in enumerate(organisations):
        print "Checking organisation " + str(count + 1) + " of " + str(total_count_org) + ": " + organisation.long_name

        if field_partnertype not in organisation.partner_types.all():
            organisation.partner_types.add(field_partnertype)
            print organisation.long_name + " added as field partner"
            field_count += 1

        if funding_partnertype not in organisation.partner_types.all():
            organisation.partner_types.add(funding_partnertype)
            print organisation.long_name + " added as funding partner"
            funding_count += 1

    print "\nDone:\n"
    print "- " + str(field_count) + " organisations added as field partner."
    print "- " + str(funding_count) + " organisations added as funding partner.\n"


if __name__ == '__main__':
    set_partner_types()