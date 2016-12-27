# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists import models as codelist_models
from akvo.codelists.store.codelists_v202 import SECTOR_VOCABULARY
from akvo.utils import codelist_choices, codelist_value


class Sector(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='sectors')
    sector_code = ValidXMLCharField(
        _(u'sector code'), blank=True, max_length=25,
        help_text=_(u'It is possible to specify a variety of sector codes, based on the selected '
                    u'vocabulary. The sector codes for the DAC-5 and DAC-3 vocabularies can be '
                    u'found here: <a href="http://iatistandard.org/202/codelists/Sector/" '
                    u'target="_blank">DAC-5 sector codes</a> and '
                    u'<a href="http://iatistandard.org/202/codelists/SectorCategory/" '
                    u'target="_blank">DAC-3 sector codes</a>.')
    )
    text = ValidXMLCharField(
        _(u'sector description'), blank=True, max_length=100,
        help_text=_(u'Optionally enter a description.')
    )
    vocabulary = ValidXMLCharField(
        _(u'sector vocabulary'), blank=True, max_length=5,
        choices=codelist_choices(SECTOR_VOCABULARY),
        help_text=_(u'This is the code for the vocabulary used to describe the sector. Sectors '
                    u'should be mapped to DAC sectors to enable international comparison.')
    )
    vocabulary_uri = ValidXMLCharField(
        _(u'sector vocabulary URI'), blank=True, max_length=1000,
        help_text=_(u'If the vocabulary is 99 (reporting organisation), the URI where this '
                    u'internal vocabulary is defined.')
    )
    percentage = models.DecimalField(
        _(u'sector percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
        validators=[MaxValueValidator(100), MinValueValidator(0)],
        help_text=_(u'Percentages should add up to 100% of the activity being reported if they are '
                    u'shown for each sector. Fill in 100% if there\'s one sector. Use a period to '
                    u'denote decimals.')
    )

    def __unicode__(self):
        if self.sector_code:
            # Check if the code is specified
            try:
                sector_text = u'%s' % self.iati_sector().name.capitalize()
            except AttributeError:
                sector_text = self.text

            try:
                vocabulary = self.iati_vocabulary().name
            except AttributeError:
                vocabulary = ''

            return u'{0}{1}{2}{3}'.format(
                u'{0}: '.format(vocabulary) if vocabulary else u'',
                u'{0}'.format(self.sector_code),
                u' - {0}'.format(sector_text) if sector_text else u'',
                u' ({0}%)'.format(str(self.percentage)) if self.percentage else u'',
            )
        else:
            # In case no code is specified, return this
            return u'{0}'.format(_(u'No sector code specified'))

    def iati_sector_codes(self):
        if self.sector_code and (self.vocabulary == '1' or self.vocabulary == 'DAC'):
            return self.sector_code, codelist_value(codelist_models.Sector, self, 'sector_code')
        elif self.sector_code and (self.vocabulary == '2' or self.vocabulary == 'DAC-3'):
            return self.sector_code, codelist_value(codelist_models.SectorCategory,
                                                    self,
                                                    'sector_code')
        else:
            return self.sector_code, self.sector_code

    def iati_sector(self):
        if self.sector_code and (self.vocabulary == '1' or self.vocabulary == 'DAC'):
            return codelist_value(codelist_models.Sector, self, 'sector_code')
        elif self.sector_code and (self.vocabulary == '2' or self.vocabulary == 'DAC-3'):
            return codelist_value(codelist_models.SectorCategory, self, 'sector_code')
        else:
            return self.sector_code

    def iati_sector_unicode(self):
        return str(self.iati_sector())

    def iati_vocabulary(self):
        return codelist_value(codelist_models.SectorVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'sector')
        verbose_name_plural = _(u'sectors')
        ordering = ['sector_code', ]
