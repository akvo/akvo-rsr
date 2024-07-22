# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .indicator_period_data import IndicatorPeriodData

from akvo.rsr.fields import ValidXMLTextField
from akvo.rsr.mixins import TimestampsMixin

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class IndicatorPeriodDataComment(TimestampsMixin):
    """
    Model for adding comments to data of an indicator period.
    """
    project_relation = 'results__indicators__periods__data__comments__in'

    data = models.ForeignKey(IndicatorPeriodData, on_delete=models.CASCADE, verbose_name=_('indicator period data'),
                             related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name=_('user'), db_index=True)
    comment = ValidXMLTextField(_('comment'), blank=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator period data comment')
        verbose_name_plural = _('indicator period data comments')
        ordering = ('-id', )
