# -*- coding: utf-8 -*-
#!/usr/bin/env python

"""
Script for setting all organisations to at least 'field' and 'funding' partner type.
"""

from django.core.management import setup_environ
from akvo import settings
setup_environ(settings)

from akvo.rsr.models import Organisation, PartnerType


def set_partner_types():
    # Collect all organisations
    organisations = Organisation.objects.all()

    # Set counters
    total_count_org = len(organisations)
    count = 1
    field_count = 0
    funding_count = 0

    # Initialize field partner type
    field_partnertype = PartnerType(id="field", label="Field partner")
    field_partnertype.save()

    # Initialize funding partner type
    funding_partnertype = PartnerType(id="funding", label="Funding partner")
    funding_partnertype.save()

    # For each organisation, check whether they are field and/or funding partners
    for organisation in organisations:
        print "Checking organisation " + str(count) + " of " + str(total_count_org) + ": " + organisation.long_name

        organisation.save()

        # Retrieve field partner type of organisation and add entry to database if not existing
        field_entry = PartnerType.objects.filter(organisation=organisation.pk, id="field")

        if len(field_entry) == 0:
            organisation.partner_types.add(field_partnertype)
            print organisation.long_name + " added as field partner"
            field_count += 1

        # Retrieve funding partner type of organisation and add entry to database if not existing
        funding_partner = PartnerType.objects.filter(organisation=organisation.pk, id="funding")

        if len(funding_partner) == 0:
            organisation.partner_types.add(funding_partnertype)
            print organisation.long_name + " added as funding partner"
            funding_count += 1

        count += 1

    print ""
    print "Done:"
    print ""
    print "- " + str(field_count) + " organisations added as field partner."
    print "- " + str(funding_count) + " organisations added as funding partner."
    print ""


if __name__ == '__main__':
    set_partner_types()

