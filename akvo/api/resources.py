# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from copy import deepcopy

from tastypie import fields
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource

#.GenericRelation(Location)
from akvo.rsr.models import (
    Organisation, Project, Category, Link, Partnership, Country, ProjectLocation, OrganisationLocation
)


class CategoryResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset = Category.objects.all()
        resource_name = 'category'


class CountryResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset = Country.objects.all()
        resource_name = 'country'


class OrganisationResource(ModelResource):
    partnerships = fields.ToManyField(
        'akvo.api.resources.PartnershipResource',
        'partnership_set',
        related_name='organisation',
        help_text='Show the projects the organisation is related to and how.'
    )
    locations   = fields.ToManyField('akvo.api.resources.OrganisationLocationResource', 'locations')

    class Meta:
        allowed_methods = ['get']
        queryset        = Organisation.objects.all()
        resource_name   = 'organisation'


class PartnershipResource(ModelResource):
    organisation    = fields.ToOneField('akvo.api.resources.OrganisationResource', 'organisation')
    project         = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    def __init__(self, api_name=None):
        """ override to be able to create custom help_text on the partner_type field
        """
        super(PartnershipResource, self).__init__(api_name=None)
        self.fields['partner_type'].help_text = "Uses the following key-value pair list: %s" % ', '.join(
            ["%s: %s" % (k, v) for k, v in Partnership.PARTNER_TYPES]
        )

    class Meta:
        allowed_methods = ['get']
        queryset        = Partnership.objects.all()
        resource_name   = 'partnership'


class ProjectResource(ModelResource):
    categories  = fields.ToManyField(CategoryResource, 'categories')
    links       = fields.ToManyField('akvo.api.resources.LinkResource', 'links')
    partners    = fields.ToManyField('akvo.api.resources.PartnershipResource', 'partners')
    locations   = fields.ToManyField('akvo.api.resources.ProjectLocationResource', 'locations')

    class Meta:
        allowed_methods = ['get']
        queryset        = Project.objects.all()
        resource_name   = 'project'
        filtering = dict(partners=ALL_WITH_RELATIONS)


class LinkResource(ModelResource):
    project = fields.ToOneField(ProjectResource, 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = Link.objects.all()
        resource_name   = 'link'


class OrganisationLocationResource(ModelResource):
    organisation = fields.ToOneField(OrganisationResource, 'location_target')
    country = fields.ToOneField(CountryResource, 'country')

    class Meta:
        allowed_methods = ['get']
        queryset        = OrganisationLocation.objects.all()
        resource_name   = 'organisation_location'


class ProjectLocationResource(ModelResource):
    project = fields.ToOneField(ProjectResource, 'location_target')
    country = fields.ToOneField(CountryResource, 'country')

    def apply_filters(self, request, applicable_filters):
        """
        An ORM-specific implementation of ``apply_filters``.

        The default simply applies the ``applicable_filters`` as ``**kwargs``,
        but should make it possible to do more advanced things.

        Here we override to check for a 'distinct' query string variable,
        if it's equal to True we apply distinct() to the queryset after filtering.
        """
        distinct = request.GET.get('distinct', False) == 'True'
        if distinct:
            return self.get_object_list(request).filter(**applicable_filters).distinct()
        else:
            return self.get_object_list(request).filter(**applicable_filters)

    class Meta:
        allowed_methods = ['get']
        queryset        = ProjectLocation.objects.all()
        resource_name   = 'project_location'
        filtering = dict(project=ALL_WITH_RELATIONS)

