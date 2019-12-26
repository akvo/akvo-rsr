# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _


class IndicatorLabel(models.Model):
    project_relation = 'results__indicators__labels__in'

    indicator = models.ForeignKey('Indicator', verbose_name=_('indicator'),
                                  related_name='labels')
    label = models.ForeignKey('OrganisationIndicatorLabel', verbose_name=_('label'),
                              related_name='indicators', on_delete=models.PROTECT,
                              help_text="Thematic labels allow you to ‘tag’ your indicator by "
                                        "choosing from a pre-defined set of thematic program areas"
                                        " (e.g. Improved Business Environment) so that all "
                                        "similarly tagged indicators can be grouped together when "
                                        "creating a custom RSR report. An indicator can have more "
                                        "than one thematic label.")

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator label')
        verbose_name_plural = _('indicator labels')

    def __unicode__(self):
        return self.label.label
