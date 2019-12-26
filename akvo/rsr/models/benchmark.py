# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class Benchmark(models.Model):
    project = models.ForeignKey('Project', verbose_name=_('project'), related_name='benchmarks', )
    category = models.ForeignKey('Category', verbose_name=_('category'), )
    name = models.ForeignKey('Benchmarkname', verbose_name=_('benchmark name'), )
    value = models.IntegerField(_('benchmark value'), )

    def __str__(self):
        return _(
            'Category: %(category)s, Benchmark: %(value)d %(name)s'
        ) % {
            'category': self.category,
            'value': self.value,
            'name': self.name,
        }

    class Meta:
        app_label = 'rsr'
        ordering = ('category__name', 'name__order')
        verbose_name = _('benchmark')
        verbose_name_plural = _('benchmarks')


class Benchmarkname(models.Model):
    name = ValidXMLCharField(
        _('benchmark name'), max_length=80,
        help_text=_('Enter a name for the benchmark. (80 characters).')
    )
    order = models.IntegerField(
        _('order'), default=0,
        help_text=_('Used to order the benchmarks when displayed. '
                    'Larger numbers sink to the bottom of the list.')
    )

    def __str__(self):
        return self.name

    class Meta:
        app_label = 'rsr'
        ordering = ['order', 'name', ]
        verbose_name = _('benchmark name')
        verbose_name_plural = _('benchmark names')
