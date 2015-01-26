# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import PolicyMarker, PolicyMarkerVocabulary, PolicySignificance
from akvo.utils import codelist_choices, codelist_value


class PolicyMarker(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='policy_markers')
    policy_marker = ValidXMLCharField(_(u'policy marker'), blank=True, max_length=2,
                                      choices=codelist_choices(PolicyMarker))
    significance = ValidXMLCharField(_(u'significance'), max_length=2, blank=True,
                                     choices=codelist_choices(PolicySignificance))
    vocabulary = ValidXMLCharField(_(u'vocabulary'), blank=True, max_length=5,
                                   choices=codelist_choices(PolicyMarkerVocabulary))
    description = ValidXMLCharField(
        _(u'description'), max_length=255, blank=True, help_text=_(u'(max 255 characters)')
    )

    def iati_policy_marker(self):
        return codelist_value(PolicyMarker, self, 'policy_marker')

    def iati_significance(self):
        return codelist_value(PolicySignificance, self, 'significance')

    def iati_vocabulary(self):
        return codelist_value(PolicyMarkerVocabulary, self, 'vocabulary')

    def __unicode__(self):
        return self.policy_marker

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'policy marker')
        verbose_name_plural = _(u'policy markers')
