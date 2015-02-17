# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import DescriptionType, ResultType
from akvo.utils import codelist_choices, codelist_value


class Result(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='results')
    title = ValidXMLCharField(
        _(u'title'), blank=True, max_length=255,
        help_text=_(u'Enter the title of the result for this project. (255 characters)')
    )
    type = ValidXMLCharField(
        _(u'type'), blank=True, max_length=1, choices=codelist_choices(ResultType),
        help_text=_(u'Select whether the result is an output, outcome or impact. '
                    u'<a href="http://www.tacticalphilanthropy.com/2010/06/outputs-outcomes-impact-oh-my/" '
                    u'target="_blank">Further explanation on result types</a>')
    )
    aggregation_status = models.NullBooleanField(_(u'aggregation status'), blank=True)
    description = ValidXMLCharField(
        _(u'description'), blank=True, max_length=255,
        help_text=_(u'You can provide further information of the result here. (255 characters)')
    )
    description_type = ValidXMLCharField(
        _(u'description type'), blank=True, max_length=1, choices=codelist_choices(DescriptionType)
    )

    def __unicode__(self):
        return self.title

    def iati_type(self):
        return codelist_value(ResultType, self, 'type')

    def has_info(self):
        if self.title or self.type or self.aggregation_status or self.description:
            return True
        return False

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'result')
        verbose_name_plural = _(u'results')
