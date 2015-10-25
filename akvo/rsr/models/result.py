# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import ResultType
from akvo.codelists.store.codelists_v201 import RESULT_TYPE
from akvo.utils import codelist_choices, codelist_value


class Result(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='results')
    title = ValidXMLCharField(
        _(u'title'), blank=True, max_length=255,
        help_text=_(u'Enter the title of the result for this project. (255 characters)')
    )
    type = ValidXMLCharField(
        _(u'type'), blank=True, max_length=1, choices=codelist_choices(RESULT_TYPE),
        help_text=_(u'Select whether the result is an output, outcome or impact. '
                    u'<a href="http://www.tacticalphilanthropy.com/2010/06/'
                    u'outputs-outcomes-impact-oh-my/" target="_blank">'
                    u'Further explanation on result types</a>')
    )
    aggregation_status = models.NullBooleanField(_(u'aggregation status'), blank=True)
    description = ValidXMLCharField(
        _(u'description'), blank=True, max_length=2000,
        help_text=_(u'You can provide further information of the result here. (2000 characters)')
    )
    parent_result = models.ForeignKey('self', blank=True, null=True, default=None,
                                      help_text=_(u'The parent result of this result.'),
                                      related_name='child_results')

    def __unicode__(self):
        result_unicode = self.title if self.title else u'%s' % _(u'No result title')

        if self.type:
            result_unicode += u' (' + self.iati_type().name + u')'

        if self.indicators.all():
            result_unicode += _(u' - %s indicators') % (unicode(self.indicators.count()))

        return result_unicode

    def save(self, *args, **kwargs):
        """Update the values of child results, if a parent result is updated."""
        for child_result in self.child_results.all():
            # Always copy title, type and aggregation status. They should be the same as the parent.
            child_result.title = self.title
            child_result.type = self.type
            child_result.aggregation_status = self.aggregation_status

            # Only copy the description if the child has none (e.g. new)
            if not child_result.description and self.description:
                child_result.description = self.description

            child_result.save()
        super(Result, self).save(*args, **kwargs)

    def clean(self):
        validation_errors = {}

        if self.pk and self.parent_result:
            orig_result = Result.objects.get(pk=self.pk)

            # Don't allow some values to be changed when it is a child result
            if self.project != orig_result.project:
                validation_errors['project'] = u'%s' % \
                    _(u'It is not possible to update the project of this result, '
                      u'because it is linked to a parent result.')
            if self.title != orig_result.title:
                validation_errors['title'] = u'%s' % \
                    _(u'It is not possible to update the title of this result, '
                      u'because it is linked to a parent result.')
            if self.type != orig_result.type:
                validation_errors['type'] = u'%s' % \
                    _(u'It is not possible to update the type of this result, '
                      u'because it is linked to a parent result.')
            if self.aggregation_status != orig_result.aggregation_status:
                validation_errors['aggregation_status'] = u'%s' % \
                    _(u'It is not possible to update the aggregation status of this result, '
                      u'because it is linked to a parent result.')

        if validation_errors:
            raise ValidationError(validation_errors)

    def iati_type(self):
        return codelist_value(ResultType, self, 'type')

    def has_info(self):
        if self.title or self.type or self.aggregation_status or self.description:
            return True
        return False

    def is_calculated(self):
        return self.project.is_impact_project

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'result')
        verbose_name_plural = _(u'results')
