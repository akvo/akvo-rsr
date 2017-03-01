# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import ConditionType
from akvo.codelists.store.codelists_v202 import CONDITION_TYPE
from akvo.utils import codelist_choices, codelist_value


class ProjectCondition(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='conditions')
    text = ValidXMLCharField(
        _(u'condition'), blank=True, max_length=100,
        help_text=_(u'The text of a specific condition attached to the Project. Organisation-wide '
                    u'terms and conditions that apply to all activities should not be reported '
                    u'here, but in either iati-organisation/document-link or '
                    u'iati-activity-document-link.')
    )
    type = ValidXMLCharField(
        _(u'condition type'), blank=True, max_length=1, choices=codelist_choices(CONDITION_TYPE),
        help_text=_(u'Condition type – e.g. policy, performance.<br/>'
                    u'1 - Policy: The condition attached requires a particular policy to be '
                    u'implemented by the recipient<br/>'
                    u'2 - Performance: The condition attached requires certain outputs or outcomes '
                    u'to be achieved by the recipient<br/>'
                    u'3 - Fiduciary: The condition attached requires use of certain public '
                    u'financial management or public accountability measures by the recipient')
    )

    def __unicode__(self):
        return self.text if self.text else u'%s' % _(u'No condition specified')

    def iati_type(self):
        return codelist_value(ConditionType, self, 'type')

    def iati_type_unicode(self):
        return str(self.iati_type())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'condition')
        verbose_name_plural = _(u'conditions')
