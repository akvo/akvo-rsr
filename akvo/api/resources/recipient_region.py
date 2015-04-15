# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from tastypie import fields

from tastypie.authorization import Authorization
from tastypie.resources import ModelResource

from akvo.api.authentication import ConditionalApiKeyAuthentication

from akvo.rsr.models import RecipientRegion


class IATIRecipientRegionResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'project',)

    class Meta:
        max_limit = 10
        allowed_methods = ['post', 'put']
        resource_name   = 'iati_recipient_region'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST', 'PUT'])
        queryset        = RecipientRegion.objects.all()
