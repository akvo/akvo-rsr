# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand

from akvo.rsr.models import Country, OrganisationLocation, ProjectLocation, ProjectUpdateLocation
from akvo.utils import get_country


def add_country_to_locations(locations):
    """Populate the country field in the given queryset of locations."""

    print 'Setting country for {} {}s'.format(locations.count(), locations.model.__name__)
    for location in locations.only('latitude', 'longitude'):
        country, iso_code = get_country(float(location.latitude), float(location.longitude))
        if iso_code is not None:
            location.country = Country.objects.filter(iso_code__iexact=iso_code).first()
            if location.country is None:
                print 'Could not set country {} - {}'.format(country, iso_code)

            else:
                location.save(update_fields=['country'])

        else:
            print 'Could not compute country for {l.latitude},{l.longitude}'.format(l=location)


def get_locations_for_model(model):
    return model.objects.filter(country=None)\
                        .exclude(latitude=None)\
                        .exclude(longitude=None)\
                        .exclude(latitude=0, longitude=0)


class Command(BaseCommand):
    help = "Add countries to locations with missing countries"

    def handle(self, *args, **options):
        """Add missing country information to locations.

        Locations automatically get assigned countries, based on latitude and
        longitude. But, due to various bugs, some locations do not have
        countries. This is a script to fix such locations.

        """

        locations = get_locations_for_model(ProjectLocation)
        add_country_to_locations(locations)

        locations = get_locations_for_model(ProjectUpdateLocation)
        add_country_to_locations(locations)

        locations = get_locations_for_model(OrganisationLocation)
        add_country_to_locations(locations)
