#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.core.management import setup_environ
import settings
setup_environ(settings)

from django.db.models import get_model

from rsr.iso3166 import ISO_3166_COUNTRIES, COUNTRY_CONTINENTS, CONTINENTS

def convert():
    countries = get_model('rsr', 'country').objects.all()
    for country in countries:
        if not country.iso_code:
            for iso in ISO_3166_COUNTRIES:
                if country.name == iso[1]:
                    country.iso_code = iso[0]
                    country.name = iso[1]
        if country.iso_code:
            continent_code = COUNTRY_CONTINENTS[country.iso_code]
            country.continent = dict(CONTINENTS)[continent_code]
            country.continent_code = continent_code
        country.save()

if __name__ == '__main__':
    convert()
