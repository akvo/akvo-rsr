# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import ConditionType
from akvo.utils import codelist_choices, codelist_value


class ProjectCondition(models.Model):
    project = models.ForeignKey('Project', verbose_name=u'project', related_name='conditions')
    text = ValidXMLCharField(_(u'condition'), blank=True, max_length=100, help_text=_(u'(100 characters)'))
    type = ValidXMLCharField(_(u'condition type'), blank=True, max_length=1, choices=codelist_choices(ConditionType))

    def iati_type(self):
        return codelist_value(ConditionType, self, 'type')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'condition')
        verbose_name_plural = _(u'conditions')
