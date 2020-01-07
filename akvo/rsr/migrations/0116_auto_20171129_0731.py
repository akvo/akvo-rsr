# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import print_function

from django.db import models, migrations
import akvo.rsr.fields
from akvo.utils import get_country


def get_country_from_lat_lon(Country, location):
    """Get the country based on the location's latitude and longitude.

    NOTE: This code is duplicated from the BaseLocation model, since the method
    is not available in a migration.

    """

    try:
        country, iso_code = get_country(float(location.latitude), float(location.longitude))

    except ValueError:
        iso_code = None

    if iso_code is not None:
        return Country.objects.filter(iso_code=iso_code).first()


def fix_country(apps, schema_editor):
    location_models = (
        'OrganisationLocation',
        'ProjectLocation',
        'ProjectUpdateLocation'
    )

    Country = apps.get_model('rsr', 'Country')

    for model_name in location_models:
        Model = apps.get_model('rsr', model_name)
        locations = Model.objects.exclude(country=None)\
                                 .exclude(latitude=None)\
                                 .exclude(longitude=None)\
                                 .only(
                                     'id', 'country',
                                     'latitude', 'longitude')\
                                 .select_related('country')\
                                 .distinct()

        fixed_count = 0
        for location in locations:
            country = get_country_from_lat_lon(Country, location)
            if country and country != location.country:
                location.country = country
                location.save()
                fixed_count += 1
        print("Fixed country for {} {}s".format(fixed_count, model_name))


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0115_auto_20171110_1159'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organisationlocation',
            name='latitude',
            field=akvo.rsr.fields.LatitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='latitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisationlocation',
            name='longitude',
            field=akvo.rsr.fields.LongitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='longitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='latitude',
            field=akvo.rsr.fields.LatitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='latitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='longitude',
            field=akvo.rsr.fields.LongitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='longitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdatelocation',
            name='latitude',
            field=akvo.rsr.fields.LatitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='latitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdatelocation',
            name='longitude',
            field=akvo.rsr.fields.LongitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='longitude', db_index=True),
            preserve_default=True,
        ),
        migrations.RunPython(fix_country, lambda x, y: None)
    ]
