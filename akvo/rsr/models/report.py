# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import re

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField, ValidXMLTextField


PARAMETER_REGEX = re.compile('{(.*?)}')
ALLOWED_PARAMETERS = {
    'project', 'organisation', 'format', 'start_date', 'end_date', 'language_code', 'comment'
}
MANDATORY_PARAMETERS = {'format'}

NEWLINE_REGEX = re.compile('.*\n.*')


class ReportFormat(models.Model):
    name = ValidXMLCharField(_('name'), max_length=30, unique=True)
    display_name = ValidXMLCharField(_('display name'), max_length=30, unique=True)
    icon = ValidXMLCharField(_('icon'), max_length=30)

    def __unicode__(self):
        return u'{}'.format(self.name)


class Report(models.Model):
    name = ValidXMLCharField(_(u'name'), max_length=100, unique=True)
    title = ValidXMLCharField(_(u'title'), max_length=200)
    description = ValidXMLTextField(
        _(u'description'), blank=True, help_text=_(u'Describe the report.')
    )
    url = ValidXMLCharField(
        _(u'url'),
        max_length=200,
        help_text=_(u'Enter the parametrized path for downloading the report. NOTE: one line only '
                    u'even if the input field allows for more!'),
    )
    formats = models.ManyToManyField(ReportFormat)
    organisations = models.ManyToManyField('Organisation', blank=True)

    @property
    def parameters(self):
        return sorted(PARAMETER_REGEX.findall(self.url))

    @property
    def multiple_lines(self):
        return len(NEWLINE_REGEX.findall(self.url)) > 0

    def __unicode__(self):
        return u'{}'.format(self.name)

    def clean(self, *args, **kwargs):
        """Over-ridden to automatically fill in the parameters field."""

        parameters = set(self.parameters)

        missing_mandatory_parameters = MANDATORY_PARAMETERS - parameters
        if missing_mandatory_parameters:
            missing_mandatory_parameters = ', '.join(missing_mandatory_parameters)
            raise ValidationError(
                'Missing mandatory parameters in URL: {}'.format(missing_mandatory_parameters)
            )

        additional_parameters = parameters - ALLOWED_PARAMETERS
        if additional_parameters:
            additional_parameters = ', '.join(additional_parameters)
            raise ValidationError(
                'These parameters are not allowed in URL: {}'.format(additional_parameters)
            )

        if self.multiple_lines:
            raise ValidationError(
                'The URL template must be a single line.'
            )

        super(Report, self).clean(*args, **kwargs)

    class Meta:
        ordering = ('name',)
