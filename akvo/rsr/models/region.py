# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import Region, RegionVocabulary
from akvo.codelists.store.default_codelists import REGION, REGION_VOCABULARY
from akvo.utils import codelist_choices, codelist_value


class RecipientRegion(models.Model):
    project = models.ForeignKey(
        'Project', verbose_name=_('project'), related_name='recipient_regions'
    )
    region = ValidXMLCharField(
        _('recipient region'), blank=True, max_length=25, choices=codelist_choices(REGION),
        help_text=_('This identifies the region in which the activity takes place. Regions can be '
                    'supra-national (a geographical or administrative grouping of countries into '
                    'a region - e.g. Sub-Saharan Africa, Mekong Delta) or \'global\' (activities '
                    'benefiting substantially all developing countries). For the codes to use, '
                    'please see <a href="http://iatistandard.org/202/codelists/Region/" '
                    'target="_blank">http://iatistandard.org/202/codelists/Region/</a>.')
    )
    region_vocabulary = ValidXMLCharField(
        _('recipient region vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(REGION_VOCABULARY),
        help_text=_('The vocabulary from which the region code is drawn. If it is not present 1 – '
                    '\'OECD DAC\' is assumed. For more information, see '
                    '<a href="http://iatistandard.org/202/codelists/RegionVocabulary/" '
                    'target="_blank">http://iatistandard.org/202/codelists/RegionVocabulary/</a>.')
    )
    region_vocabulary_uri = ValidXMLCharField(
        _('recipient region vocabulary URI'), blank=True, max_length=1000,
        help_text=_('If the vocabulary is 99 (reporting organisation), the URI where this '
                    'internal vocabulary is defined.')
    )
    percentage = models.DecimalField(
        _('recipient region percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
        validators=[MaxValueValidator(100), MinValueValidator(0)],
        help_text=_('If the activity occurs in more than one region, the percentage of activity '
                    'commitment allocated to each region should be provided if available. '
                    'Percentages should add up to 100% of the activity being reported if they are '
                    'shown for each region. Use a period to denote decimals.')
    )
    text = ValidXMLCharField(
        _('recipient region description'), blank=True, max_length=50,
        help_text=_('Optionally enter a description.')
    )

    def __unicode__(self):
        if self.region:
            try:
                region_unicode = self.iati_region().name
            except AttributeError:
                region_unicode = self.iati_region()
        else:
            region_unicode = '%s' % _('No region specified')

        if self.percentage:
            region_unicode += ' (%s%%)' % str(self.percentage)

        return region_unicode

    def iati_region(self):
        return codelist_value(Region, self, 'region')

    def iati_region_unicode(self):
        return str(self.iati_region())

    def iati_vocabulary(self):
        return codelist_value(RegionVocabulary, self, 'region_vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('recipient region')
        verbose_name_plural = _('recipient regions')
        ordering = ('pk',)
