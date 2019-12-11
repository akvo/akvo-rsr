# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _


class DefaultPeriod(models.Model):

    project = models.ForeignKey(
        'Project', verbose_name=_(u'project'), related_name='default_periods')
    parent = models.ForeignKey(
        'self', blank=True, null=True, default=None,
        verbose_name=_(u'parent period'), related_name='child_periods'
    )
    period_start = models.DateField(
        _(u'period start'), null=True, blank=True,
        help_text=_(u'The start date of the reporting period.')
    )
    period_end = models.DateField(
        _(u'period end'), null=True, blank=True,
        help_text=_(u'The end date of the reporting period.')
    )

    def save(self, *args, **kwargs):
        """Update the values of child results, if a parent result is updated."""

        is_new_default_period = not self.pk

        for child_period in self.child_periods.all():
            child_period.period_start = self.period_start
            child_period.period_end = self.period_end
            child_period.save()

        super(DefaultPeriod, self).save(*args, **kwargs)

        if is_new_default_period:
            self.project.copy_default_period_to_children(self)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'default period')
        verbose_name_plural = _(u'default periods')
        ordering = ['period_start', 'period_end']
