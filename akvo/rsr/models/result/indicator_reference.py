# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .indicator import Indicator

from akvo.codelists.models import IndicatorVocabulary
from akvo.codelists.store.default_codelists import INDICATOR_VOCABULARY
from akvo.rsr.fields import ValidXMLCharField
from akvo.utils import codelist_choices, codelist_value

from django.db import models
from django.utils.translation import ugettext_lazy as _


class IndicatorReference(models.Model):

    project_relation = 'results__indicators__references__in'

    indicator = models.ForeignKey(Indicator, verbose_name=_('indicator'),
                                  related_name='references')
    reference = ValidXMLCharField(
        _('reference code'), blank=True, max_length=25,
        help_text=_('A code for an indicator defined in the specified vocabulary specified. '
                    'For more information on the indicator reference, see the '
                    '<a href="http://iatistandard.org/202/activity-standard/iati-activities/'
                    'iati-activity/result/indicator/reference/" target="_blank">IATI '
                    'codelist</a>.'))
    vocabulary = ValidXMLCharField(
        _('reference vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(INDICATOR_VOCABULARY),
        help_text=_('This is the code for the vocabulary used to describe the sector. Sectors '
                    'should be mapped to DAC sectors to enable international comparison. '
                    'For more information on the indicator reference, see the '
                    '<a href="http://iatistandard.org/202/codelists/IndicatorVocabulary/" '
                    'target="_blank">IATI codelist</a>.'))
    vocabulary_uri = ValidXMLCharField(
        _('reference indicator URI'), blank=True, max_length=1000,
        help_text=_('If the vocabulary is 99 (reporting organisation), the URI where this '
                    'internal vocabulary is defined.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator reference')
        verbose_name_plural = _('indicator references')
        ordering = ('pk',)

    def __unicode__(self):
        return self.reference

    def iati_vocabulary(self):
        return codelist_value(IndicatorVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())
