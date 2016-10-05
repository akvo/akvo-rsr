# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists import models as codelist_models
from akvo.codelists.store.codelists_v202 import (POLICY_MARKER, POLICY_SIGNIFICANCE,
                                                 POLICY_MARKER_VOCABULARY)
from akvo.utils import codelist_choices, codelist_value, get_codelist_value_name


class PolicyMarker(models.Model):
    project = models.ForeignKey(
        'Project', verbose_name=_(u'project'), related_name='policy_markers'
    )
    policy_marker = ValidXMLCharField(
        _(u'policy marker'), blank=True, max_length=25, choices=codelist_choices(POLICY_MARKER),
        help_text=_(u'A policy or theme addressed by the activity, based on DAC policy markers. '
                    u'These indicators track key policy issues, like gender equality, environment, '
                    u'and trade development.')
    )
    significance = ValidXMLCharField(
        _(u'policy marker significance'), max_length=2, blank=True,
        choices=codelist_choices(POLICY_SIGNIFICANCE),
        help_text=_(u'Each reported marker must contain the significance of the policy marker for '
                    u'this activity. Choices are:<br/>'
                    u'0 - Not targeted<br/>'
                    u'1 - Significant objective: the policy objectives are important, but were not '
                    u'the prime motivation for undertaking the activity.<br/>'
                    u'2 - Principal objective: the policy objective was the primary reason to '
                    u'undertake this activity.<br/>'
                    u'3 - Principal objective AND in support of an action programme: valid for the '
                    u'markers dealing with Desertification only.<br/>'
                    u'4 - Explicit primary objective: only to be used in combination with policy '
                    u'marker.<br/>'
                    u'9 - reproductive, maternal, newborn and child health.')
    )
    vocabulary = ValidXMLCharField(_(u'vocabulary'), blank=True, max_length=5,
                                   choices=codelist_choices(POLICY_MARKER_VOCABULARY))
    vocabulary_uri = ValidXMLCharField(_(u'vocabulary URI'), blank=True, max_length=1000,
                                       help_text=_(u'If the vocabulary is 99 (reporting '
                                                   u'organisation), the URI where this internal '
                                                   u'vocabulary is defined.'))
    description = ValidXMLCharField(_(u'policy marker description'), max_length=255, blank=True)

    def __unicode__(self):
        name = get_codelist_value_name(self.iati_policy_marker())
        if not name and self.description:
            name = unicode(self.description)

        else:
            return u'%s' % _(u'Policy marker not specified')

    def iati_policy_marker(self):
        return codelist_value(codelist_models.PolicyMarker, self, 'policy_marker')

    def iati_significance(self):
        return codelist_value(codelist_models.PolicySignificance, self, 'significance')

    def iati_vocabulary(self):
        return codelist_value(codelist_models.PolicyMarkerVocabulary, self, 'vocabulary')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'policy marker')
        verbose_name_plural = _(u'policy markers')

@receiver(post_save, sender=PolicyMarker)
def update_pm_vocabulary(sender, **kwargs):
    "Updates the vocabulary if not specified."
    pm = kwargs['instance']
    if not pm.vocabulary and pm.policy_marker:
        pm.vocabulary = '1'
        pm.save()
