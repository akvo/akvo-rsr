# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie.constants import ALL

from akvo.rsr.models import Country

from .resources import ConditionalFullResource


class CountryResource(ConditionalFullResource):
    class Meta:
        max_limit = 10
        allowed_methods = ['get']
        queryset        = Country.objects.all()
        resource_name   = 'country'
        filtering       = dict(
            # other fields
            iso_code        = ALL,
            continent_code  = ALL,
        )
