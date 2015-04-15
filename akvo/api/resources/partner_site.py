# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie.constants import ALL, ALL_WITH_RELATIONS
from akvo.api.fields import ConditionalFullToManyField, ConditionalFullToOneField

from akvo.rsr.models import PartnerSite

from .resources import ConditionalFullResource


class PartnerSiteResource(ConditionalFullResource):
    organisation = ConditionalFullToOneField(
        'akvo.api.resources.OrganisationResource', 'organisation',
    )
    keywords = ConditionalFullToManyField(
        'akvo.api.resources.KeywordResource', 'keywords',
    )

    class Meta:
        max_limit = 10
        allowed_methods = ['get']
        queryset = PartnerSite.objects.all()
        resource_name = 'partner_site'
        fields = [
            'id',
            'organisation',
            'hostname',
            'cname',
            'enabled',
            'ui_translation',
            'google_translation',
            'partner_projects',
            'keywords',
        ]

        filtering = dict(
            hostname = ALL,
            cname = ALL,
            enabled = ALL,
            ui_translation = ALL,
            google_translation = ALL,
            partner_projects = ALL,
            keywords = ALL_WITH_RELATIONS,
            organisation = ALL_WITH_RELATIONS,
        )
