# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie.constants import ALL

from akvo.api.fields import ConditionalFullToManyField

from akvo.rsr.models import FocusArea

from .resources import ConditionalFullResource


class FocusAreaResource(ConditionalFullResource):
    categories = ConditionalFullToManyField('akvo.api.resources.CategoryResource', 'categories')

    class Meta:
        max_limit = 10
        allowed_methods = ['get']
        queryset        = FocusArea.objects.all()
        resource_name   = 'focus_area'
        filtering       = dict(
            # other fields
            slug        = ALL,
        )
