# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from indicator import Indicator

from ..organisation_indicator_label import OrganisationIndicatorLabel

from django.db import models
from django.utils.translation import ugettext_lazy as _


class IndicatorLabel(models.Model):
    indicator = models.ForeignKey(Indicator, verbose_name=_(u'indicator'),
                                  related_name='labels')
    label = models.ForeignKey(OrganisationIndicatorLabel, verbose_name=_(u'label'),
                              related_name='indicators', on_delete=models.PROTECT,
                              help_text=u"Thematic labels allow you to ‘tag’ your indicator by "
                                        u"choosing from a pre-defined set of thematic program areas"
                                        u" (e.g. Improved Business Environment) so that all "
                                        u"similarly tagged indicators can be grouped together when "
                                        u"creating a custom RSR report. An indicator can have more "
                                        u"than one thematic label.")

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator label')
        verbose_name_plural = _(u'indicator labels')

    def __unicode__(self):
        return self.label.label
