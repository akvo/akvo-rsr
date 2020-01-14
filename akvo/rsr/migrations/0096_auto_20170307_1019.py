# -*- coding: utf-8 -*-


from django.db import models, migrations

from akvo.rsr.iso3166 import CONTINENTS, COUNTRY_CONTINENTS, ISO_3166_COUNTRIES
from akvo.utils import get_country


def add_country_to_locations(apps, schema_editor):
    """Populate the country field in the subclasses of BaseLocation."""

    model_names = ('OrganisationLocation', 'ProjectLocation', 'ProjectUpdateLocation')
    location_models = [apps.get_model('rsr', name) for name in model_names]
    Country = apps.get_model('rsr', 'Country')

    for model in location_models:
        locations = model.objects.filter(country=None)
        print('Setting country for {} {}s'.format(locations.count(), model.__name__))
        for location in locations:
            # Country is automatically set in the save method
            if location.latitude is None or location.longitude is None:
                continue

            country, iso_code = get_country(float(location.latitude), float(location.longitude))
            if iso_code is not None:
                location.country = Country.objects.filter(iso_code__iexact=iso_code).first()
                if location.country is None:
                    print('Could not set country {} - {}'.format(country, iso_code))
                else:
                    location.save()


def create_missing_countries(apps, schema_editor):
    """Add all missing countries from ISO_3166_COUNTRIES to the DB."""

    Country = apps.get_model('rsr', 'Country')
    for iso_code, _ in ISO_3166_COUNTRIES:
        country = Country.objects.filter(iso_code=iso_code).first()
        if country is None:
            # FIXME: Can't call Country.fields_from_iso_code in a migration
            # The code below is just duplicating that code
            fields = {
                'iso_code': iso_code,
                'continent_code': COUNTRY_CONTINENTS[iso_code],
                'name': dict(ISO_3166_COUNTRIES)[iso_code],
                'continent': dict(CONTINENTS)[COUNTRY_CONTINENTS[iso_code]]
            }
            Country.objects.create(**fields)


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0095_auto_20170309_0901'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectupdatelocation',
            name='country',
            field=models.ForeignKey(verbose_name='country', blank=True, to='rsr.Country', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisationlocation',
            name='country',
            field=models.ForeignKey(verbose_name='country', blank=True, to='rsr.Country', null=True),
            preserve_default=True,
        ),
        migrations.RunPython(
            create_missing_countries,
            reverse_code=lambda x, y: None,
        ),
        migrations.RunPython(
            add_country_to_locations,
            reverse_code=lambda x, y: None,
        )
    ]
