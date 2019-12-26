# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Use a reverse geocoding API to backfill city names for locations with lat, lng.

Usage:

    python manage.py reverse_geocode_city_names

"""
from __future__ import print_function

import atexit
import json
import os
import tempfile
import sys

from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
import requests

from akvo.rsr.models import ProjectLocation, Organisation

CACHE_PATH = os.path.join(tempfile.gettempdir(), 'reverse-geocode-data.json')
RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY', None)
if not RAPIDAPI_KEY:
    print('Please set the RAPIDAPI_KEY environment variable')
    sys.exit(1)

session = requests.Session()


def read_cached_locations():
    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH) as f:
            data = json.load(f)
            data = {
                (entry['latitude'], entry['longitude']):
                (entry['city_name'], entry['country_code']) for entry in data
            }
            return data
    else:
        return {}


def write_cached_locations(data):
    serializable_data = [
        {'latitude': lat, 'longitude': lng, 'city_name': city_name, 'country_code': country_code}
        for (lat, lng), (city_name, country_code) in data.items()
    ]
    with open(CACHE_PATH, 'w') as f:
        json.dump(serializable_data, f, indent=1)


def reverse_geocode(lat, lng, range_m=50000):
    url = "https://geocodeapi.p.rapidapi.com/GetNearestCities"
    data = {
        "latitude": lat,
        "longitude": lng,
        "range": range_m,
    }
    headers = {
        "x-rapidapi-host": "geocodeapi.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPI_KEY
    }
    response = session.get(url, params=data, headers=headers)
    if response.status_code == 200:
        print("Fetching city name for {},{} within {} meters".format(lat, lng, range_m))
        for city in response.json():
            return city['City'], city['CountryId']
    else:
        print(lat, lng, response.status_code)
    return None, None


def update_locations(cached_data, locations=None):
    if locations is None:
        locations = ProjectLocation.objects
    # Look for locations with lat, lng and country specified, but no city specified
    query = Q(latitude=None) | Q(longitude=None) | Q(country=None)
    locations = locations.exclude(query).filter(city='')
    print('Trying to reverse geocode {} locations'.format(locations.count()))
    for location in locations:
        pos = (location.latitude, location.longitude)
        city_name, country_code = cached_data.get(pos, (None, None))
        if city_name is None:
            city_name, country_code = reverse_geocode(*pos)
        if city_name is None or location.country.iso_code != country_code.lower():
            print("{} does not match {}".format(location.country.iso_code, country_code))
            continue

        location.city = city_name
        location.save(update_fields=['city'])
        print('Updated location {} with city: {}'.format(location.pk, city_name.encode('utf8')))
        cached_data[pos] = city_name, country_code


class Command(BaseCommand):
    help = __doc__

    def add_arguments(self, parser):
        parser.add_argument(
            'org_ids',
            type=int,
            nargs='*',
            help='List of organisation IDs whose project locations to fix',
        )

    def handle(self, *args, **options):
        if options['org_ids']:
            organisations = Organisation.objects.filter(id__in=options['org_ids'])
            locations = ProjectLocation.objects.filter(location_target__in=organisations.all_projects())
        else:
            locations = None
            confirm = input('Do you want to update locations for all organisations [y/N]? ')
            if confirm.lower()[:1] != 'y':
                raise CommandError('Aborting')

        cached_data = read_cached_locations()
        atexit.register(write_cached_locations, cached_data)
        update_locations(cached_data, locations)
