# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .indicator_period import IndicatorPeriod

from akvo.rsr.fields import ValidXMLCharField

from django.db import models
from django.utils.translation import ugettext_lazy as _


class IndicatorPeriodActualLocation(models.Model):
    project_relation = 'results__indicators__periods__actual_locations__in'

    period = models.ForeignKey(IndicatorPeriod, verbose_name=_('indicator period'),
                               related_name='actual_locations')
    location = ValidXMLCharField(
        _('location'), blank=True, max_length=25,
        help_text=_('A location of the actual of this indicator period. The location must be the '
                    'reference of an existing location of the current project.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator period actual location')
        verbose_name_plural = _('indicator period actual locations')
        ordering = ('pk',)

    def __str__(self):
        return self.location
