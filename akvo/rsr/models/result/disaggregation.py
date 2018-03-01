# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from indicator_dimension import IndicatorDimensionValue
from indicator_period_data import IndicatorPeriodData

from akvo.rsr.fields import ValidXMLTextField
from akvo.rsr.mixins import TimestampsMixin

from django.db import models
from django.utils.translation import ugettext_lazy as _


class Disaggregation(TimestampsMixin, models.Model):
    """Model for storing a disaggregated value along one axis of a dimension."""

    # TODO: rename to dimension_axis of simply axis?
    dimension_value = models.ForeignKey(
        IndicatorDimensionValue, null=True, related_name='disaggregations'
    )

    update = models.ForeignKey(IndicatorPeriodData,
                               verbose_name=_(u'indicator period update'),
                               related_name='disaggregations')

    # FIXME: Add a type to allow disaggregated values for target/baseline
    # type = models.CharField

    # NOTE: corresponding value field on Update is still a CharField
    value = models.DecimalField(
        _(u'quantitative disaggregated value'),
        max_digits=20,
        decimal_places=2,
        blank=True,
        null=True
    )
    narrative = ValidXMLTextField(_(u'qualitative narrative'), blank=True)
    numerator = models.DecimalField(
        _(u'numerator for indicator'),
        max_digits=20, decimal_places=2,
        null=True, blank=True,
        help_text=_(u'The numerator for a percentage value')
    )
    denominator = models.DecimalField(
        _(u'denominator for indicator'),
        max_digits=20, decimal_places=2,
        null=True, blank=True,
        help_text=_(u'The denominator for a percentage value')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'disaggregated value')
        verbose_name_plural = _(u'disaggregated values')
