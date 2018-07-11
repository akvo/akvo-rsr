# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from indicator import Indicator

from akvo.codelists.models import IndicatorVocabulary
from akvo.codelists.store.default_codelists import INDICATOR_VOCABULARY
from akvo.rsr.fields import ValidXMLCharField
from akvo.utils import codelist_choices, codelist_value

from django.db import models
from django.utils.translation import ugettext_lazy as _


class IndicatorReference(models.Model):
    indicator = models.ForeignKey(Indicator, verbose_name=_(u'indicator'),
                                  related_name='references')
    reference = ValidXMLCharField(
        _(u'reference code'), blank=True, max_length=25,
        help_text=_(u'A code for an indicator defined in the specified vocabulary specified. '
                    u'For more information on the indicator reference, see the '
                    u'<a href="http://iatistandard.org/202/activity-standard/iati-activities/'
                    u'iati-activity/result/indicator/reference/" target="_blank">IATI '
                    u'codelist</a>.'))
    vocabulary = ValidXMLCharField(
        _(u'reference vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(INDICATOR_VOCABULARY),
        help_text=_(u'This is the code for the vocabulary used to describe the sector. Sectors '
                    u'should be mapped to DAC sectors to enable international comparison. '
                    u'For more information on the indicator reference, see the '
                    u'<a href="http://iatistandard.org/202/codelists/IndicatorVocabulary/" '
                    u'target="_blank">IATI codelist</a>.'))
    vocabulary_uri = ValidXMLCharField(
        _(u'reference indicator URI'), blank=True, max_length=1000,
        help_text=_(u'If the vocabulary is 99 (reporting organisation), the URI where this '
                    u'internal vocabulary is defined.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator reference')
        verbose_name_plural = _(u'indicator references')

    def __unicode__(self):
        return self.reference

    def iati_vocabulary(self):
        return codelist_value(IndicatorVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())
