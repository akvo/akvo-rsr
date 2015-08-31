# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import Region, RegionVocabulary
from akvo.codelists.store.codelists_v201 import REGION, REGION_VOCABULARY
from akvo.utils import codelist_choices, codelist_value


class RecipientRegion(models.Model):
    project = models.ForeignKey(
        'Project', verbose_name=_(u'project'), related_name='recipient_regions'
    )
    region = ValidXMLCharField(
        _(u'region'), blank=True, max_length=3, choices=codelist_choices(REGION)
    )
    region_vocabulary = ValidXMLCharField(
        _(u'region vocabulary'), blank=True, max_length=1,
        choices=codelist_choices(REGION_VOCABULARY)
    )
    percentage = models.DecimalField(
        _(u'percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
        validators=[MaxValueValidator(100), MinValueValidator(0)]
    )
    text = ValidXMLCharField(
        _(u'region description'), blank=True, max_length=50, help_text=_(u'(max 50 characters)')
    )

    def __unicode__(self):
        if self.region:
            region_unicode = self.iati_region().name
        else:
            region_unicode = u'%s' % _(u'No region specified')

        if self.percentage:
            region_unicode += u' (%s%%)' % str(self.percentage)

        return region_unicode

    def iati_region(self):
        return codelist_value(Region, self, 'region')

    def iati_vocabulary(self):
        return codelist_value(RegionVocabulary, self, 'region_vocabulary')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'recipient region')
        verbose_name_plural = _(u'recipient regions')
