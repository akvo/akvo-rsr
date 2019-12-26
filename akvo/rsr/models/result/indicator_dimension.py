# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.fields import ValidXMLCharField

from django.core.exceptions import PermissionDenied
from django.db import models
from django.utils.translation import ugettext_lazy as _


class IndicatorDimensionName(models.Model):
    project = models.ForeignKey('Project', verbose_name='project', related_name='dimension_names')
    name = ValidXMLCharField(
        _('disaggregation name'), max_length=100,
        help_text=_('The name of a category to be used when disaggregating (e.g "Age").')
    )
    parent_dimension_name = models.ForeignKey(
        'self', blank=True, null=True, default=None,
        verbose_name=_('parent dimension name'),
        related_name='child_dimension_names'
    )

    def name_and_values(self):
        return '{}: ({})'.format(
            self.name,
            ', '.join([value.value for value in self.dimension_values.all()])
        )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator disaggregation name')
        verbose_name_plural = _('indicator disaggregation names')
        ordering = ['id']
        unique_together = ('project', 'name')

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        is_new_dimension_name = not self.pk
        super(IndicatorDimensionName, self).save(*args, **kwargs)

        if is_new_dimension_name:
            self.project.copy_dimension_name_to_children(self)

        for child_dimension_name in self.child_dimension_names.all():
            child_dimension_name.name = self.name
            child_dimension_name.save()

    def delete(self, *args, **kwargs):
        if self.parent_dimension_name is not None:
            raise PermissionDenied
        super(IndicatorDimensionName, self).delete(*args, **kwargs)


class IndicatorDimensionValue(models.Model):
    project_relation = 'dimension_names__dimension_values__in'
    name = models.ForeignKey(IndicatorDimensionName, verbose_name='dimension name',
                             related_name='dimension_values')
    value = ValidXMLCharField(
        _('disaggregation value'), max_length=100,
        help_text=_('A value in the category being disaggregated (e.g. "Older than 60 years").'))
    parent_dimension_value = models.ForeignKey(
        'self', blank=True, null=True, default=None,
        verbose_name=_('parent dimension value'),
        related_name='child_dimension_values'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator disaggregation value')
        verbose_name_plural = _('indicator disaggregation values')
        ordering = ['id']
        unique_together = ('name', 'value')

    def __unicode__(self):
        return '{} - {}'.format(self.name, self.value)

    def save(self, *args, **kwargs):
        new_dimension_value = not self.pk
        super(IndicatorDimensionValue, self).save(*args, **kwargs)
        child_dimension_names = self.name.child_dimension_names.select_related(
            'project'
        )
        for child_dimension_name in child_dimension_names.all():
            if new_dimension_value:
                child_dimension_name.project.copy_dimension_value(child_dimension_name, self)
            else:
                child_dimension_name.project.update_dimension_value(child_dimension_name, self)

    def delete(self, *args, **kwargs):
        if self.parent_dimension_value is not None:
            raise PermissionDenied
        super(IndicatorDimensionValue, self).delete(*args, **kwargs)
