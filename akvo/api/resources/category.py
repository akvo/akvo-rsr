# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie import fields
from tastypie.authorization import Authorization

from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource
from akvo.api.authentication import ConditionalApiKeyAuthentication

from akvo.rsr.models import Category

from .resources import ConditionalFullResource


class IATICategoryResource(ModelResource):
    # project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'project')

    class Meta:
        max_limit = 10
        allowed_methods = ['get', 'post']
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        queryset        = Category.objects.all()
        resource_name   = 'iati_category'
        filtering       = dict(
            # other fields
            name        = ALL,
            # foreign keys
            focus_area  = ALL_WITH_RELATIONS,
        )


class CategoryResource(ConditionalFullResource):
    class Meta:
        max_limit = 10
        allowed_methods = ['get']
        queryset        = Category.objects.all()
        resource_name   = 'category'
        filtering       = dict(
            # other fields
            name        = ALL,
            # foreign keys
            focus_area  = ALL_WITH_RELATIONS,
        )
