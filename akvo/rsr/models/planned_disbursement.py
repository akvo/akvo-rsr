# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from ..iati.codelists import codelists_v104 as codelists


class PlannedDisbursement(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='planned_disbursements')
    value = models.DecimalField(_(u'value'), blank=True, max_digits=10, decimal_places=2)
    value_date = models.DateField(_(u'value date'), null=True, blank=True)
    currency = ValidXMLCharField(_(u'currency'), blank=True, max_length=3, choices=codelists.CURRENCY)
    updated = models.DateField(_(u'updated'), null=True, blank=True)
    period_start = models.DateField(_(u'period start'), null=True, blank=True)
    period_end = models.DateField(_(u'period end'), null=True, blank=True)

    def __unicode__(self):
        return self.value

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'planned disbursement')
        verbose_name_plural = _(u'planned disbursements')