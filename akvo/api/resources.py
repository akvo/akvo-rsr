# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from copy import deepcopy

from tastypie import fields
from tastypie.resources import ModelResource

#.GenericRelation(Location)
from akvo.rsr.models import Organisation, Project, Category, Link, Partnership, Country, ProjectLocation


class CategoryResource(ModelResource):
    class Meta:
        queryset = Category.objects.all()
        resource_name = 'category'


class CountryResource(ModelResource):
    class Meta:
        queryset = Country.objects.all()
        resource_name = 'country'


class OrganisationResource(ModelResource):
    partnerships = fields.ToManyField(
        'akvo.api.resources.PartnershipResource',
        'partnership_set',
        related_name='organisation',
        help_text='Show the projects the org is related to and how.'
    )

    class Meta:
        queryset        = Organisation.objects.all()
        resource_name   = 'organisation'


class PartnershipResource(ModelResource):
    organisation    = fields.ToOneField('akvo.api.resources.OrganisationResource', 'organisation')
    project         = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    def __init__(self, api_name=None):
        super(PartnershipResource, self).__init__(api_name=None)
        self.fields['partner_type'].help_text = "Uses the following key-value pair list: %s" % ', '.join(
            ["%s: %s" % (k, v) for k, v in Partnership.PARTNER_TYPES]
        )

    class Meta:
        queryset        = Partnership.objects.all()
        resource_name   = 'partnership'


class ProjectResource(ModelResource):
    categories  = fields.ToManyField(CategoryResource, 'categories')
    links       = fields.ToManyField('akvo.api.resources.LinkResource', 'links')
    partners    = fields.ToManyField('akvo.api.resources.PartnershipResource', 'partners')
    locations   = fields.ToManyField('akvo.api.resources.ProjectLocationResource', 'locations')

    class Meta:
        queryset        = Project.objects.all()
        resource_name   = 'project'


class LinkResource(ModelResource):
    project = fields.ToOneField(ProjectResource, 'project')

    class Meta:
        queryset        = Link.objects.all()
        resource_name   = 'link'


class OrganisationLocationResource(ModelResource):
    organisation = fields.ToOneField(OrganisationResource, 'organisation')
    country = fields.ToOneField(CountryResource, 'country')

    class Meta:
        queryset        = ProjectLocation.objects.all()
        resource_name   = 'project_location'


class ProjectLocationResource(ModelResource):
    project = fields.ToOneField(ProjectResource, 'location_target')
    country = fields.ToOneField(CountryResource, 'country')

    class Meta:
        queryset        = ProjectLocation.objects.all()
        resource_name   = 'project_location'

