# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.fields import ValidXMLCharField
from akvo.rsr.iati.codelists import codelists_v104 as codelists


class PolicyMarker(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='policy_markers')
    policy_marker = ValidXMLCharField(_(u'policy marker'), blank=True, max_length=2, choices=codelists.POLICY_MARKER)
    significance = ValidXMLCharField(
        _(u'significance'), max_length=2, blank=True, choices=[code[:2] for code in codelists.POLICY_SIGNIFICANCE]
    )
    vocabulary = ValidXMLCharField(
        _(u'vocabulary'), blank=True, max_length=5, choices=[code[:2] for code in codelists.VOCABULARY]
    )
    description = ValidXMLCharField(_(u'description'), max_length=255, blank=True, help_text=_(u'(max 255 characters)'))

    def __unicode__(self):
        return self.policy_marker

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'policy marker')
        verbose_name_plural = _(u'policy markers')