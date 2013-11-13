# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie import fields
from tastypie.cache import SimpleCache
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource

from akvo.api.fields import ConditionalFullToManyField

from akvo.rsr.models import Organisation, Project

from .resources import ConditionalFullResource, get_extra_thumbnails


class OrganisationMapResource(ConditionalFullResource):
    """
    a limited resource for delivering data to be used when creating maps
    """
    locations           = ConditionalFullToManyField('akvo.api.resources.OrganisationLocationResource', 'locations', null=True)
    primary_location    = fields.ToOneField('akvo.api.resources.OrganisationLocationResource', 'primary_location', full=True, null=True)

    class Meta:
        allowed_methods = ['get']
        queryset = Organisation.objects.all()
        resource_name = 'map_for_organisation'
        include_absolute_url = True
        cache = SimpleCache(timeout=900) # 15 minutes

        filtering       = dict(
            # other fields
            iati_org_id         = ALL,
            name                = ALL,
            organisation_type   = ALL,
            # foreign keys
            locations           = ALL_WITH_RELATIONS,
            partnerships        = ALL_WITH_RELATIONS,
            )

    def dehydrate(self, bundle):
        """ add thumbnails inline info for Organisation.logo
        """
        bundle = super(OrganisationMapResource, self).dehydrate(bundle)
        del bundle.data['description']
        bundle.data['logo'] = {
            'original': bundle.data['logo'],
            'thumbnails': get_extra_thumbnails(bundle.obj.logo),
            }
        return bundle


class ProjectMapResource(ModelResource):
    """
    a limited resource for delivering data to be used when creating maps
    """
    #locations           = ConditionalFullToManyField('akvo.api.resources.ProjectLocationResource', 'locations')
    primary_location    = fields.ToOneField('akvo.api.resources.ProjectLocationResource', 'primary_location', full=True, null=True)

    class Meta:
        allowed_methods = ['get']
        queryset = Project.objects.select_related('primary_location', 'primary_location__country').published()
        resource_name = 'map_for_project'
        include_absolute_url = True
        cache = SimpleCache(timeout=900) # 15 minutes

        filtering               = dict(
            # other fields
            status              = ALL,
            title               = ALL,
            budget              = ALL,
            funds               = ALL,
            funds_needed        = ALL,
            # foreign keys
            benchmarks          = ALL_WITH_RELATIONS,
            budget_items        = ALL_WITH_RELATIONS,
            categories          = ALL_WITH_RELATIONS,
            goals               = ALL_WITH_RELATIONS,
            invoices            = ALL_WITH_RELATIONS,
            links               = ALL_WITH_RELATIONS,
            locations           = ALL_WITH_RELATIONS,
            partnerships        = ALL_WITH_RELATIONS,
            project_comments    = ALL_WITH_RELATIONS,
            project_updates     = ALL_WITH_RELATIONS,
        )

    def dehydrate(self, bundle):
        """ add thumbnails inline info for Project.current_image
        """
        bundle = super(ProjectMapResource, self).dehydrate(bundle)
        ignored_fields = ('goals_overview', 'current_status', 'project_plan', 'sustainability', 'background', 'project_rating', 'notes',)
        for field in ignored_fields:
            del bundle.data[field]
        bundle.data['current_image'] = {
            'original': bundle.data['current_image'],
            'thumbnails': get_extra_thumbnails(bundle.obj.current_image),
            }
        return bundle
