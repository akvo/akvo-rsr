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
from akvo.codelists.store.default_codelists import (POLICY_MARKER, POLICY_SIGNIFICANCE,
                                                    POLICY_MARKER_VOCABULARY)
from akvo.utils import codelist_choices, codelist_value


class PolicyMarker(models.Model):
    project = models.ForeignKey(
        'Project', verbose_name=_('project'), related_name='policy_markers'
    )
    policy_marker = ValidXMLCharField(
        _('policy marker'), blank=True, max_length=25, choices=codelist_choices(POLICY_MARKER),
        help_text=_('A policy or theme addressed by the activity, based on DAC policy markers. '
                    'These indicators track key policy issues, like gender equality, environment, '
                    'and trade development.')
    )
    significance = ValidXMLCharField(
        _('policy marker significance'), max_length=2, blank=True,
        choices=codelist_choices(POLICY_SIGNIFICANCE),
        help_text=_('Each reported marker must contain the significance of the policy marker for '
                    'this activity. Choices are:<br/>'
                    '0 - Not targeted<br/>'
                    '1 - Significant objective: the policy objectives are important, but were not '
                    'the prime motivation for undertaking the activity.<br/>'
                    '2 - Principal objective: the policy objective was the primary reason to '
                    'undertake this activity.<br/>'
                    '3 - Principal objective AND in support of an action programme: valid for the '
                    'markers dealing with Desertification only.<br/>'
                    '4 - Explicit primary objective: only to be used in combination with policy '
                    'marker.<br/>'
                    '9 - reproductive, maternal, newborn and child health.')
    )
    vocabulary = ValidXMLCharField(_('vocabulary'), blank=True, max_length=5,
                                   choices=codelist_choices(POLICY_MARKER_VOCABULARY))
    vocabulary_uri = ValidXMLCharField(_('vocabulary URI'), blank=True, max_length=1000,
                                       help_text=_('If the vocabulary is 99 (reporting '
                                                   'organisation), the URI where this internal '
                                                   'vocabulary is defined.'))
    description = ValidXMLCharField(_('policy marker description'), max_length=255, blank=True)

    def __str__(self):
        try:
            return self.iati_policy_marker().name
        except AttributeError:
            if self.description:
                return str(self.description)
            else:
                return '%s' % _('Policy marker not specified')

    def iati_policy_marker(self):
        return codelist_value(codelist_models.PolicyMarker, self, 'policy_marker')

    def iati_policy_marker_unicode(self):
        return str(self.iati_policy_marker())

    def iati_significance(self):
        return codelist_value(codelist_models.PolicySignificance, self, 'significance')

    def iati_significance_unicode(self):
        return str(self.iati_significance())

    def iati_vocabulary(self):
        return codelist_value(codelist_models.PolicyMarkerVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('policy marker')
        verbose_name_plural = _('policy markers')
        ordering = ('pk',)


@receiver(post_save, sender=PolicyMarker)
def update_pm_vocabulary(sender, **kwargs):
    "Updates the vocabulary if not specified."
    pm = kwargs['instance']
    if not pm.vocabulary and pm.policy_marker:
        pm.vocabulary = '1'
        pm.save()
