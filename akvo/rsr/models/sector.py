# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from ..iati.codelists import codelists_v104 as codelists


class Sector(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='sectors')
    sector_code = ValidXMLCharField(
        _(u'sector'), blank=True, max_length=5, choices=[code[:2] for code in codelists.SECTOR]
    )
    text = ValidXMLCharField(_(u'description'), blank=True, max_length=100, help_text=_(u'(max 100 characters)'))
    vocabulary = ValidXMLCharField(
        _(u'vocabulary'), blank=True, max_length=5, choices=[code[:2] for code in codelists.VOCABULARY]
    )
    percentage = models.DecimalField(
        _(u'percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
        validators=[MaxValueValidator(100), MinValueValidator(0)]
    )

    def iati_sector_codes(self):
        if self.sector_code and (self.vocabulary == '1' or self.vocabulary == 'DAC'):
            return self.sector_code, dict([code[:2] for code in codelists.SECTOR])[self.sector_code]
        elif self.sector_code and (self.vocabulary == '2' or self.vocabulary == 'DAC-3'):
            return self.sector_code, dict([code[:2] for code in codelists.SECTOR_CATEGORY])[self.sector_code]
        else:
            return "", ""

    def iati_sector(self):
        if self.sector_code and (self.vocabulary == '1' or self.vocabulary == 'DAC'):
            return dict([code[:2] for code in codelists.SECTOR])[self.sector_code]
        elif self.sector_code and (self.vocabulary == '2' or self.vocabulary == 'DAC-3'):
            return dict([code[:2] for code in codelists.SECTOR_CATEGORY])[self.sector_code]
        else:
            return ""

    def iati_vocabulary(self):
        if self.vocabulary:
            voc = 'DAC' if self.vocabulary == '1' else 'DAC-3'
            return dict([code[:2] for code in codelists.VOCABULARY])[voc]
        else:
            return ""

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'sector')
        verbose_name_plural = _(u'sectors')
