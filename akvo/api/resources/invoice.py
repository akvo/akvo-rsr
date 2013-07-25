# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie.constants import ALL_WITH_RELATIONS

from akvo.api.fields import ConditionalFullToOneField

from akvo.rsr.models import Invoice
from akvo.rsr.utils import PAYPAL_INVOICE_STATUS_COMPLETE

from .resources import ConditionalFullResource


class InvoiceResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = Invoice.objects.filter(status__exact=PAYPAL_INVOICE_STATUS_COMPLETE)
        resource_name   = 'invoice'
        fields          = ['amount', 'amount_received', 'is_anonymous',]
        filtering       = dict(
            # foreign keys
            project     = ALL_WITH_RELATIONS,
            user        = ALL_WITH_RELATIONS,
        )

    def dehydrate(self, bundle):
        """ Add name and email for non-anonymous donators
        """
        bundle = super(InvoiceResource, self).dehydrate(bundle)
        if not bundle.obj.is_anonymous:
            bundle.data['email'] = bundle.obj.email
            bundle.data['name'] = bundle.obj.name
        return bundle
