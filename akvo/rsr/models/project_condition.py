# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import ConditionType
from akvo.codelists.store.default_codelists import CONDITION_TYPE
from akvo.utils import codelist_choices, codelist_value


class ProjectCondition(models.Model):
    project = models.ForeignKey('Project', verbose_name=_('project'), related_name='conditions')
    text = ValidXMLCharField(
        _('condition'), blank=True, max_length=100,
        help_text=_('The text of a specific condition attached to the Project. Organisation-wide '
                    'terms and conditions that apply to all activities should not be reported '
                    'here, but in either iati-organisation/document-link or '
                    'iati-activity-document-link.')
    )
    type = ValidXMLCharField(
        _('condition type'), blank=True, max_length=1, choices=codelist_choices(CONDITION_TYPE),
        help_text=_('Condition type – e.g. policy, performance.<br/>'
                    '1 - Policy: The condition attached requires a particular policy to be '
                    'implemented by the recipient<br/>'
                    '2 - Performance: The condition attached requires certain outputs or outcomes '
                    'to be achieved by the recipient<br/>'
                    '3 - Fiduciary: The condition attached requires use of certain public '
                    'financial management or public accountability measures by the recipient')
    )

    def __unicode__(self):
        return self.text if self.text else '%s' % _('No condition specified')

    def iati_type(self):
        return codelist_value(ConditionType, self, 'type')

    def iati_type_unicode(self):
        return str(self.iati_type())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('condition')
        verbose_name_plural = _('conditions')
        ordering = ('pk',)
