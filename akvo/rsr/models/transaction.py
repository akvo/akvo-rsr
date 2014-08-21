# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from ..iati.codelists import codelists_v104 as codelists


class Transaction(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='transactions')
    reference = ValidXMLCharField(_(u'reference'), blank=True, max_length=25)
    aid_type = ValidXMLCharField(
        _(u'aid type'), blank=True, max_length=3, choices=[code[:2] for code in codelists.AID_TYPE]
    )
    aid_type_text = ValidXMLCharField(
        _(u'aid type text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    description = ValidXMLCharField(_(u'description'), max_length=255, blank=True, help_text=_(u'(max 255 characters)'))
    disbursement_channel = ValidXMLCharField(
        _(u'disbursement channel'), blank=True, max_length=1, choices=codelists.DISBURSEMENT_CHANNEL
    )
    disbursement_channel_text = ValidXMLCharField(
        _(u'disbursement channel text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    finance_type = ValidXMLCharField(
        _(u'finance type'), max_length=3, blank=True, choices=[code[:2] for code in codelists.FINANCE_TYPE]
    )
    finance_type_text = ValidXMLCharField(
        _(u'finance type text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    flow_type = ValidXMLCharField(
        _(u'flow type'), max_length=2, blank=True, choices=[code[:2] for code in codelists.FLOW_TYPE]
    )
    flow_type_text = ValidXMLCharField(
        _(u'flow type text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    tied_status = ValidXMLCharField(
        _(u'tied status'), blank=True, max_length=1, choices=[code[:2] for code in codelists.TIED_STATUS]
    )
    tied_status_text = ValidXMLCharField(
        _(u'tied status text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    transaction_date = models.DateField(_(u'transaction date'), blank=True)
    transaction_type = ValidXMLCharField(
        _(u'transaction type'), blank=True, max_length=2, choices=[code[:2] for code in codelists.TRANSACTION_TYPE]
    )
    transaction_type_text = ValidXMLCharField(
        _(u'transaction type text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    value = models.DecimalField(_(u'value'), blank=True, null=True, max_digits=11, decimal_places=1)
    value_date = models.DateField(_(u'value date'), blank=True, null=True)
    currency = ValidXMLCharField(_(u'currency'), blank=True, max_length=3, choices=codelists.CURRENCY)
    provider_organisation = ValidXMLCharField(_(u'provider organisation'), blank=True, max_length=100)
    provider_organisation_ref = ValidXMLCharField(_(u'provider organisation reference'), blank=True, max_length=50)
    provider_organisation_activity = ValidXMLCharField(
        _(u'provider organisation activity id'), blank=True, max_length=50
    )
    receiver_organisation = ValidXMLCharField(_(u'receiver organisation'), blank=True, max_length=100)
    receiver_organisation_ref = ValidXMLCharField(_(u'receiver organisation reference'), blank=True, max_length=50)
    receiver_organisation_activity = ValidXMLCharField(
        _(u'receiver organisation activity id'), blank=True, max_length=50
    )

    def __unicode__(self):
        return self.value

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'transaction')
        verbose_name_plural = _(u'transactions')