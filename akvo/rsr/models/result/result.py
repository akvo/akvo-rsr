# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.codelists.models import ResultType
from akvo.codelists.store.default_codelists import RESULT_TYPE
from akvo.rsr.fields import ValidXMLCharField
from akvo.utils import codelist_choices, codelist_value


class Result(models.Model):
    project = models.ForeignKey('Project', verbose_name=_('project'), related_name='results')
    title = ValidXMLCharField(
        _('result title'), blank=True, max_length=500,
        help_text=_('The aim of the project in one sentence. This doesn’t need to be something '
                    'that can be directly counted, but it should describe an overall goal of the '
                    'project. There can be multiple results for one project.')
    )
    type = ValidXMLCharField(
        _('result type'), blank=True, max_length=1, choices=codelist_choices(RESULT_TYPE),
        help_text=_('Choose whether the result is an output, outcome or impact.<br/>'
                    '1 - Output: Direct result of the project activities. E.g. number of booklets '
                    'produced, workshops held, people trained, latrines build.<br/>'
                    '2 - Outcome: The changes or benefits that result from the program activities '
                    'and resulting outputs. E.g number of beneficiaries reached, knowledge '
                    'increased, capacity build, monitored behaviour change.<br/>'
                    '3 - Impact: Long-term results of program (on population) that can be '
                    'attributed to the project outputs and outcomes. E.g improved health, '
                    'increased political participation of women.<br/>'
                    '9 - Other: Another type of result, not specified above.')
    )
    aggregation_status = models.NullBooleanField(
        _('aggregation status'), blank=True,
        help_text=_('Indicate whether the data in the result set can be accumulated.')
    )
    description = ValidXMLCharField(
        _('result description'), blank=True, max_length=2000,
        help_text=_('You can provide further information of the result here.')
    )
    parent_result = models.ForeignKey('self', blank=True, null=True, default=None,
                                      help_text=_('The parent result of this result.'),
                                      related_name='child_results')
    order = models.PositiveSmallIntegerField(_('result order'), null=True, blank=True)

    def __unicode__(self):
        result_unicode = self.title if self.title else '%s' % _('No result title')

        if self.type:
            result_unicode += ' (' + self.iati_type().name + ')'

        if self.indicators.all():
            result_unicode += _(' - %s indicators') % (str(self.indicators.count()))

        return result_unicode

    def save(self, *args, **kwargs):
        """Update the values of child results, if a parent result is updated."""

        is_new_result = not self.pk

        for child_result in self.child_results.all():
            # Always copy title, type and aggregation status. They should be the same as the parent.
            child_result.title = self.title
            child_result.type = self.type
            child_result.aggregation_status = self.aggregation_status

            # Only copy the description if the child has none (e.g. new)
            if not child_result.description and self.description:
                child_result.description = self.description

            child_result.save()

        if is_new_result and Result.objects.filter(project_id=self.project.id).exists():
            prev_result = Result.objects.filter(project_id=self.project.id).reverse()[0]
            if prev_result.order:
                self.order = prev_result.order + 1

        super(Result, self).save(*args, **kwargs)

        if is_new_result:
            self.project.copy_result_to_children(self)

    def clean(self):
        validation_errors = {}

        if self.pk and self.parent_result:
            orig_result = Result.objects.get(pk=self.pk)

            # Don't allow some values to be changed when it is a child result
            if self.project != orig_result.project:
                validation_errors['project'] = '%s' % \
                    _('It is not possible to update the project of this result, '
                      'because it is linked to a parent result.')
            if self.title != orig_result.title:
                validation_errors['title'] = '%s' % \
                    _('It is not possible to update the title of this result, '
                      'because it is linked to a parent result.')
            if self.type != orig_result.type:
                validation_errors['type'] = '%s' % \
                    _('It is not possible to update the type of this result, '
                      'because it is linked to a parent result.')
            if self.aggregation_status != orig_result.aggregation_status:
                validation_errors['aggregation_status'] = '%s' % \
                    _('It is not possible to update the aggregation status of this result, '
                      'because it is linked to a parent result.')

        if validation_errors:
            raise ValidationError(validation_errors)

    def delete(self, *args, **kwargs):
        """
        Check if indicator is ordered manually, and cascade following indicators if needed
        """
        if self.order:
            sibling_results = Result.objects.filter(project_id=self.project.id)

            if not self == sibling_results.reverse()[0]:
                for ind in range(self.order + 1, len(sibling_results)):
                    sibling_results[ind].order -= 1
                    sibling_results[ind].save()

        super(Result, self).delete(*args, **kwargs)

    def iati_type(self):
        return codelist_value(ResultType, self, 'type')

    def iati_type_unicode(self):
        return str(self.iati_type())

    def has_info(self):
        if self.title or self.type or self.aggregation_status or self.description:
            return True
        return False

    def is_calculated(self):
        return self.project.is_impact_project

    def parent_project(self):
        """
        Return a dictionary of this result's parent project.
        """
        if self.parent_result:
            return {self.parent_result.project.id: self.parent_result.project.title}
        return {}

    def child_projects(self):
        """
        Return a dictionary of this result's child projects.
        """
        projects = {}
        for result in Result.objects.filter(parent_result=self).select_related('project'):
            projects[result.project.id] = result.project.title
        return projects

    class Meta:
        app_label = 'rsr'
        ordering = ['order', 'id']
        verbose_name = _('result')
        verbose_name_plural = _('results')
        unique_together = ('project', 'parent_result')
