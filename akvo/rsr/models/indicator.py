# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from akvo.codelists.models import IndicatorMeasure
from akvo.codelists.store.codelists_v201 import INDICATOR_MEASURE
from akvo.utils import codelist_choices, codelist_value


class Indicator(models.Model):
    result = models.ForeignKey('Result', verbose_name=_(u'result'), related_name='indicators')
    title = ValidXMLCharField(
        _(u'title'), blank=True, max_length=255,
        help_text=_(u'Enter the title for the indicator from the project result. (255 characters)')
    )
    measure = ValidXMLCharField(
        _(u'measure'), blank=True, max_length=1, choices=codelist_choices(INDICATOR_MEASURE),
        help_text=_(u'Select whether the indicator counts units or evaluates a percentage.')
    )
    ascending = models.NullBooleanField(
        _(u'ascending'), blank=True,
        help_text=_(u'Is the aim of the project to increase or decrease the value of the '
                    u'indicator?'))
    description = ValidXMLCharField(
        _(u'description'), blank=True, max_length=2000,
        help_text=_(u'You can further define the indicator here. (2000 characters)')
    )
    baseline_year = models.PositiveIntegerField(
        _(u'baseline year'), blank=True, null=True, max_length=4,
        help_text=_(u'Enter the year that the baseline information was obtained.')
    )
    baseline_value = ValidXMLCharField(
        _(u'baseline value'), blank=True, max_length=50,
        help_text=_(u'Enter the value of the baseline indicator. (50 characters)')
    )
    baseline_comment = ValidXMLCharField(
        _(u'baseline comment'), blank=True, max_length=2000,
        help_text=_(u'You can further define the baseline here. (2000 characters)')
    )

    def __unicode__(self):
        indicator_unicode = self.title if self.title else u'%s' % _(u'No indicator title')

        if self.periods.all():
            indicator_unicode += u' - %s %s' % (unicode(self.periods.count()),
                                                _(u'period(s)'))

        return indicator_unicode

    def iati_measure(self):
        return codelist_value(IndicatorMeasure, self, 'measure')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator')
        verbose_name_plural = _(u'indicators')


class IndicatorPeriod(models.Model):
    indicator = models.ForeignKey(Indicator, verbose_name=_(u'indicator'), related_name='periods')
    period_start = models.DateField(
        _(u'period start'), null=True, blank=True,
        help_text=_(u'Enter the start date of the period the indicator is being tracked within.')
    )
    period_end = models.DateField(
        _(u'period end'), null=True, blank=True,
        help_text=_(u'Enter the end date of the period the indicator is being tracked within.')
    )
    target_value = ValidXMLCharField(
        _(u'target value'), blank=True, max_length=50,
        help_text=_(u'Enter the value of the indicator that the project is intending to reach. '
                    u'(50 characters)')
    )
    target_comment = ValidXMLCharField(
        _(u'target comment'), blank=True, max_length=2000,
        help_text=_(u'You can comment on the target value here. (2000 characters)')
    )
    actual_value = ValidXMLCharField(
        _(u'actual value'), blank=True, max_length=50,
        help_text=_(u'Enter the value of the indicator that the project has reached. '
                    u'(50 characters)')
    )
    actual_comment = ValidXMLCharField(
        _(u'actual comment'), blank=True, max_length=2000,
        help_text=_(u'You can comment on the actual value here. (2000 characters)')
    )

    def __unicode__(self):
        if self.period_start:
            period_unicode = unicode(self.period_start)
        else:
            period_unicode = u'%s' % _(u'No start date')

        if self.period_end:
            period_unicode += u' - %s' % unicode(self.period_end)
        else:
            period_unicode += u' - %s' % _(u'No end date')

        if self.actual_value or self.target_value:
            period_unicode += u' ('

            if self.actual_value and self.target_value:
                period_unicode += u'actual: %s / target: %s)' % (unicode(self.actual_value),
                                                                 unicode(self.target_value))
            elif self.actual_value:
                period_unicode += u'actual: %s)' % unicode(self.actual_value)
            else:
                period_unicode += u'target: %s)' % unicode(self.target_value)

        return period_unicode

    @property
    def percent_accomplishment(self):
        return round(float(self.actual_value) / float(self.target_value) * 100, 1)

    def clean(self):
        # Don't allow a start date before an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            raise ValidationError(
                {'period_start': u'%s' % _(u'Period start cannot be at a later time than period '
                                           u'end.'),
                 'period_end': u'%s' % _(u'Period start cannot be at a later time than period '
                                           u'end.')}
            )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period')
        verbose_name_plural = _(u'indicator periods')
