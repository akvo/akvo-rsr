# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.urlresolvers import reverse

from tastypie import fields

from tastypie.authorization import Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource

from akvo.api.authentication import ConditionalApiKeyAuthentication
from akvo.api.fields import ConditionalFullToOneField

from akvo.rsr.models import OrganisationLocation, ProjectLocation
from akvo.rsr.utils import custom_get_or_create_country

from .resources import ConditionalFullResource
from .organisation import OrganisationResource
from .country import CountryResource
from .project import ProjectResource


class IATIProjectLocationResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'location_target')
    country = fields.ToOneField('akvo.api.resources.CountryResource', 'country')

    class Meta:
        allowed_methods = ['post']
        resource_name   = 'iati_project_location'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        queryset        = ProjectLocation.objects.all()

    def hydrate_country(self, bundle):
        country = custom_get_or_create_country(bundle.data['country'])
        bundle.data['country'] = reverse(
            'api_dispatch_detail', kwargs={'resource_name':'country', 'api_name': 'v1', 'pk': country.pk}
        )
        return bundle


class OrganisationLocationResource(ConditionalFullResource):
    organisation = ConditionalFullToOneField(OrganisationResource, 'location_target')
    country = ConditionalFullToOneField(CountryResource, 'country')

    class Meta:
        allowed_methods = ['get']
        queryset        = OrganisationLocation.objects.all()
        resource_name   = 'organisation_location'
        filtering       = dict(
            # foreign keys
            organisation= ALL_WITH_RELATIONS,
            country     = ALL_WITH_RELATIONS,
        )


class ProjectLocationResource(ConditionalFullResource):
    project = ConditionalFullToOneField(ProjectResource, 'location_target')
    country = ConditionalFullToOneField(CountryResource, 'country')

    class Meta:
        allowed_methods = ['get']
        queryset        = ProjectLocation.objects.all()
        resource_name   = 'project_location'
        filtering       = dict(
            # other fields
            latitude    = ALL,
            longitude   = ALL,
            primary     = ALL,
            # foreign keys
            country     = ALL_WITH_RELATIONS,
            project     = ALL_WITH_RELATIONS,
        )
