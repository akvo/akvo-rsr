# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.fields import ValidXMLTextField

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _


class NarrativeReport(models.Model):

    project = models.ForeignKey('Project',
                                verbose_name=_('project'),
                                related_name='narrative_reports')

    category = models.ForeignKey('OrganisationIndicatorLabel',
                                 verbose_name=_('category'),
                                 related_name='narrative_reports',
                                 on_delete=models.PROTECT)

    text = ValidXMLTextField(
        _('narrative report text'), blank=True,
        help_text=_('The text of the narrative report.')
    )

    published = models.BooleanField(_('published'), default=False)

    period_start = models.DateField(
        _('period start'),
        help_text=_('The start date of the reporting period for this narrative report.')
    )
    period_end = models.DateField(
        _('period end'),
        help_text=_('The end date of the reporting period for this narrative report.')
    )

    def clean(self):
        if not self.period_start:
            raise ValidationError(
                {
                    'period_start': '%s' % _('The narrative report needs a period start date.'),
                }
            )
        if not self.period_end:
            raise ValidationError(
                {
                    'period_start': '%s' % _('The narrative report needs a period end date.'),
                }
            )
        # Don't allow a start date later than an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            raise ValidationError(
                {
                    'period_start': '%s' % _('Period start cannot be at a later time than period '
                                             'end.'),
                    'period_end': '%s' % _('Period end cannot be at an earleir time than period '
                                           'start.')
                }
            )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('narrative report')
        verbose_name_plural = _('narrative reports')
        unique_together = ('project', 'category', 'period_start', 'period_end')
        ordering = ('id',)
