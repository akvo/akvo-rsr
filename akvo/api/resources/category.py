# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie.constants import ALL, ALL_WITH_RELATIONS

from akvo.rsr.models import Category

from .resources import ConditionalFullResource


class CategoryResource(ConditionalFullResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = Category.objects.all()
        resource_name   = 'category'
        filtering       = dict(
            # other fields
            name        = ALL,
            # foreign keys
            focus_area  = ALL_WITH_RELATIONS,
        )