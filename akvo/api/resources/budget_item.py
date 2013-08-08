# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.urlresolvers import reverse

from tastypie import fields

from tastypie.authorization import Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource

from akvo.api.authentication import ConditionalApiKeyAuthentication
from akvo.api.fields import ConditionalFullToOneField

from akvo.rsr.models import BudgetItem, BudgetItemLabel

from .resources import ConditionalFullResource


class IATIBudgetItemResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'project', full=True,)
    label = fields.ToOneField('akvo.api.resources.BudgetItemLabelResource', 'label',)

    class Meta:
        allowed_methods = ['post']
        resource_name   = 'iati_budget_item'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        queryset        = BudgetItem.objects.all()

    def hydrate_label(self, bundle):
        bundle.data['label'] = reverse(
            'api_dispatch_detail', kwargs={
                'resource_name':'budget_item_label', 'api_name': 'v1', 'pk': bundle.data['label']
            }
        )
        return bundle


class BudgetItemResource(ConditionalFullResource):
    label = ConditionalFullToOneField('akvo.api.resources.BudgetItemLabelResource', 'label', full=True)
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = BudgetItem.objects.all()
        resource_name   = 'budget_item'
        filtering       = dict(
            # foreign keys
            label       = ALL_WITH_RELATIONS,
            project     = ALL_WITH_RELATIONS,
        )


class BudgetItemLabelResource(ConditionalFullResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = BudgetItemLabel.objects.all()
        resource_name   = 'budget_item_label'
        filtering       = dict(
            # other fields
            label       = ALL,
        )
