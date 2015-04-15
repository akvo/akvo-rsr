# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from tastypie import fields

from tastypie.authorization import Authorization
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.resources import ModelResource

from akvo.api.authentication import ConditionalApiKeyAuthentication
from akvo.api.fields import ConditionalFullToOneField

from akvo.rsr.models import Goal

from .resources import ConditionalFullResource


class IATIGoalResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'project',)

    class Meta:
        max_limit = 10
        allowed_methods = ['post', 'put']
        resource_name   = 'iati_goal'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST', 'PUT'])
        queryset        = Goal.objects.all()


class GoalResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        max_limit = 10
        allowed_methods = ['get']
        queryset        = Goal.objects.all()
        resource_name   = 'goal'
        filtering       = dict(
            # foreign keys
            project     = ALL_WITH_RELATIONS,
        )
