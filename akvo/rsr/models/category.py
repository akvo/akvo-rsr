# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.text import capfirst
from django.utils.translation import gettext_lazy as _

from ..fields import ValidXMLCharField


class Category(models.Model):
    name = ValidXMLCharField(
        _('category name'), max_length=50, db_index=True,
        help_text=_('Enter a name for the category. (50 characters).')
    )
    focus_area = models.ManyToManyField(
        'FocusArea', verbose_name=_('focus area'), related_name='categories',
        help_text=_('Select the Focus area(s) the category belongs to.')
    )
    benchmarknames = models.ManyToManyField(
        'Benchmarkname', verbose_name=_('benchmark names'),
        blank=True, help_text=_('Select the benchmark names for the category.')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['name', ]

    def __str__(self):
        return '%s (%s)' % (self.name, self.focus_areas())

    def category_benchmarks_html(self):
        return "<br/>".join([b.name for b in self.benchmarknames.all()])
    category_benchmarks_html.allow_tags = True

    def focus_areas(self):
        return ', '.join([capfirst(area.name) for area in self.focus_area.all()])
    focus_areas.allow_tags = True

    def focus_areas_html(self):
        return '<br/>'.join([capfirst(area.name) for area in self.focus_area.all()])
    focus_areas_html.allow_tags = True
