# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class LegacyData(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='legacy_data')
    name = ValidXMLCharField(
        _(u'name'), blank=True, max_length=1000,
        help_text=_(u'The original field name in the reporting organisation\'s system.')
    )
    value = ValidXMLCharField(
        _(u'value'), blank=True, max_length=1000,
        help_text=_(u'The original field value in the reporting organisation\'s system.')
    )
    iati_equivalent = ValidXMLCharField(
        _(u'iati equivalent'), blank=True, max_length=1000,
        help_text=_(u'The name of the equivalent IATI element.')
    )

    def __unicode__(self):
        if self.name and self.value:
            return u'{0}: {1}'.format(self.name, self.value)
        elif self.value:
            return self.value
        else:
            return u'%s' % _(u'No value specified')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'legacy data')
        verbose_name_plural = _(u'legacy data')
        ordering = ('pk',)
