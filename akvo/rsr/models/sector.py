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
    percentage = models.DecimalField(_(u'percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
                                     validators=[MaxValueValidator(100), MinValueValidator(0)])

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'sector')
        verbose_name_plural = _(u'sectors')