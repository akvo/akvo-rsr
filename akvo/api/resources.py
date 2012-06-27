# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from tastypie import fields
from tastypie.resources import ModelResource

#.GenericRelation(Location)
from akvo.rsr.models import Organisation, Project, Category, Link, Partnership

http://www.jmedata.se/PartDetail.aspx?q=p:10507213
class CategoryResource(ModelResource):
    class Meta:
        queryset = Category.objects.all()
        resource_name = 'category'


class OrganisationResource(ModelResource):
    partnerships = fields.ToManyField('akvo.api.resources.PartnershipResource', 'partnership_set', related_name='organisation', help_text='Show the projects the org is related to and how.')

    class Meta:
        queryset        = Organisation.objects.all()
        resource_name   = 'organisation'


class PartnershipResource(ModelResource):
    organisation    = fields.ToOneField('akvo.api.resources.OrganisationResource', 'organisation')
    project         = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        queryset        = Partnership.objects.all()
        resource_name   = 'partnership'


class ProjectResource(ModelResource):
    categories  = fields.ToManyField(CategoryResource, 'categories')
    links       = fields.ToManyField('akvo.api.resources.LinkResource', 'links')
    partners    = fields.ToManyField('akvo.api.resources.PartnershipResource', 'partners')

    class Meta:
        queryset        = Project.objects.all()
        resource_name   = 'project'


class LinkResource(ModelResource):
    project = fields.ToOneField(ProjectResource, 'project')

    class Meta:
        queryset        = Link.objects.all()
        resource_name   = 'link'