# -*- coding: utf-8 -*-


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
            location.save(update_fields=['iati_country', ])


def convert_org_locations_to_iati_countries_reverse(apps, schema_editor):
    """
    Revert the organisation location countries to the old 'country' field.
    """
    OrganisationLocation = apps.get_model("rsr", "OrganisationLocation")
    Country = apps.get_model("rsr", "Country")

    for location in OrganisationLocation.objects.all():
        country = location.iati_country
        if country:
            try:
                location.country = Country.objects.get(iso_code=country.lower())
                location.save(update_fields=['country', ])
            except Country.DoesNotExist:
                pass


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
            employment.save(update_fields=['new_country_field', ])


def convert_employments_to_iati_countries_reverse(apps, schema_editor):
    """
    Revert the employment countries to the old 'country' field.
    """
    Employment = apps.get_model("rsr", "Employment")
    Country = apps.get_model("rsr", "Country")

    for employment in Employment.objects.all():
        new_country_field = employment.new_country_field
        if new_country_field:
            try:
                employment.country = Country.objects.get(iso_code=new_country_field.lower())
                employment.save(update_fields=['country', ])
            except Country.DoesNotExist:
                pass


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0072_auto_20160525_1528'),
    ]

    operations = [
        migrations.RunPython(convert_org_locations_to_iati_countries,
                             convert_org_locations_to_iati_countries_reverse),
        migrations.RunPython(convert_employments_to_iati_countries,
                             convert_employments_to_iati_countries_reverse),
    ]
