# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class OrganisationIndicatorLabel(models.Model):
    from .organisation import Organisation

    organisation = models.ForeignKey(Organisation, verbose_name=_(u'organisation'),
                                     related_name='indicator_labels')
    label = ValidXMLCharField(_(u'label'), max_length=100)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'organisation indicator label')
        verbose_name_plural = _(u'organisation indicator labels')
        unique_together = ('organisation', 'label')
        ordering = ('organisation', 'label')

    def __unicode__(self):
        return self.label
