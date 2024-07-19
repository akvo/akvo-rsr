# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.fields import ValidXMLTextField

from django.db import models
from django.utils.translation import gettext_lazy as _


class IndicatorPeriodLabel(models.Model):
    """ Model for adding a label on an indicator period."""

    project_relation = ''
    project = models.ForeignKey('Project',
                                on_delete=models.CASCADE,
                                verbose_name=_('indicator period data'),
                                related_name='period_labels')
    label = ValidXMLTextField(_('label'), blank=True)

    def __str__(self):
        return self.label

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator period label')
        verbose_name_plural = _('indicator period labels')
        ordering = ('-id', )
