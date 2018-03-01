# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.fields import ValidXMLCharField

from django.db import models
from django.utils.translation import ugettext_lazy as _


class IndicatorDimensionName(models.Model):
    project = models.ForeignKey('Project', verbose_name=u'project', related_name='dimension_names')
    # indicators: related name of Indicator.dimension_names ManyToManyField
    name = ValidXMLCharField(
        _(u'dimension name'), max_length=100,
        help_text=_(u'The name of a category to be used when disaggregating (e.g "Age").'))

    def name_and_values(self):
        return u'{}: ({})'.format(
            self.name,
            ', '.join([value.value for value in self.dimension_values.all()])
        )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator dimension name')
        verbose_name_plural = _(u'indicator dimension names')
        ordering = ['id']
        unique_together = ('project', 'name')

    def __unicode__(self):
        return self.name


class IndicatorDimensionValue(models.Model):
    name = models.ForeignKey(IndicatorDimensionName, verbose_name=u'dimension name',
                             related_name='dimension_values')
    value = ValidXMLCharField(
        _(u'dimension value'), max_length=100,
        help_text=_(u'A value in the category being disaggregated (e.g. "Older than 60 years").'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator dimension value')
        verbose_name_plural = _(u'indicator dimension values')
        ordering = ['id']
        unique_together = ('name', 'value')

    def __unicode__(self):
        return u'{} - {}'.format(self.name, self.value)
