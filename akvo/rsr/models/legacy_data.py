# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class LegacyData(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='legacy_data')
    name = ValidXMLCharField(_(u'name'), blank=True, max_length=100, help_text=_(u'(100 characters).'))
    value = ValidXMLCharField(_(u'value'), max_length=100, blank=True, help_text=_(u'(100 characters).'))
    iati_equivalent = ValidXMLCharField(
        _(u'iati equivalent'), blank=True, max_length=100, help_text=_(u'(100 characters).')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'legacy data')
        verbose_name_plural = _(u'legacy data')