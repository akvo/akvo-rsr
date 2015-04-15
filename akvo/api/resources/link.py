# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie.constants import ALL_WITH_RELATIONS

from akvo.api.fields import ConditionalFullToOneField

from akvo.rsr.models import Link

from .resources import ConditionalFullResource


class LinkResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        max_limit = 10
        allowed_methods = ['get']
        queryset        = Link.objects.all()
        resource_name   = 'link'
        filtering       = dict(
            # foreign keys
            project     = ALL_WITH_RELATIONS,
        )
