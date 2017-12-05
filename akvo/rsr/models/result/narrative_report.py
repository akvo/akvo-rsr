# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.fields import ValidXMLCharField


from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _


class NarrativeReport(models.Model):

    project = models.ForeignKey('Project',
                                verbose_name=_(u'project'),
                                related_name='narrative_reports')

    category = models.ForeignKey('OrganisationIndicatorLabel',
                                 verbose_name=_(u'category'),
                                 related_name='narrative_reports',
                                 on_delete=models.PROTECT)

    description = ValidXMLCharField(
        _(u'narrative report description'), blank=True, max_length=2000,
        help_text=_(u'The text of the narrative report.')
    )

    published = models.BooleanField(_(u'locked'), default=False)

    period_start = models.DateField(
        _(u'period start'),
        help_text=_(u'The start date of the reporting period for this narrative report.')
    )
    period_end = models.DateField(
        _(u'period end'),
        help_text=_(u'The end date of the reporting period for this narrative report.')
    )

    def clean(self):
        # Don't allow a start date before an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            raise ValidationError(
                {
                    'period_start': u'%s' % _(u'Period start cannot be at a later time than period '
                                              u'end.'),
                    'period_end': u'%s' % _(u'Period start cannot be at a later time than period '
                                            u'end.')
                }
            )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'narrative report')
        verbose_name_plural = _(u'narrative reports')
        unique_together = ('project', 'category', 'period_start', 'period_end')
