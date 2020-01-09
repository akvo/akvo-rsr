# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from akvo.rsr.mixins import TimestampsMixin, IndicatorUpdateMixin
from django.utils.translation import ugettext_lazy as _


class DisaggregationContribution(TimestampsMixin, IndicatorUpdateMixin, models.Model):
    """
    Model to hold the disaggragation contribution
    """

    disaggregation = models.ForeignKey(
        'IndicatorPeriodDisaggregation',
        related_name='contributors'
    )

    contributing_project = models.ForeignKey(
        'Project',
        related_name='disaggregation_contributions'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('disaggregation contribution')
        verbose_name_plural = _('disaggregation contributions')
        ordering = ('id',)
