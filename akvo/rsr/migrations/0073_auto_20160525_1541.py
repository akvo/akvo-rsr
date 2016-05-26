# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def convert_org_locations_to_iati_countries(apps, schema_editor):
    """
    Convert the organisation location countries to the new 'iati_country' field.
    """
    OrganisationLocation = apps.get_model("rsr", "OrganisationLocation")

    for location in OrganisationLocation.objects.all():
        country = location.country
        if country:
            location.iati_country = country.iso_code.upper()
            location.save()


def convert_employments_to_iati_countries(apps, schema_editor):
    """
    Convert the employment countries to the 'new_country_field' field. This field is renamed in
    the following migration.
    """
    Employment = apps.get_model("rsr", "Employment")

    for employment in Employment.objects.all():
        country = employment.country
        if country:
            employment.new_country_field = country.iso_code.upper()
            employment.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0072_auto_20160525_1528'),
    ]

    operations = [
        migrations.RunPython(convert_org_locations_to_iati_countries),
        migrations.RunPython(convert_employments_to_iati_countries),
    ]
