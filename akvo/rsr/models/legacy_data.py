# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class LegacyData(models.Model):
    project = models.ForeignKey('Project', verbose_name=_('project'), related_name='legacy_data')
    name = ValidXMLCharField(
        _('name'), blank=True, max_length=1000,
        help_text=_('The original field name in the reporting organisation\'s system.')
    )
    value = ValidXMLCharField(
        _('value'), blank=True, max_length=1000,
        help_text=_('The original field value in the reporting organisation\'s system.')
    )
    iati_equivalent = ValidXMLCharField(
        _('iati equivalent'), blank=True, max_length=1000,
        help_text=_('The name of the equivalent IATI element.')
    )

    def __str__(self):
        if self.name and self.value:
            return '{0}: {1}'.format(self.name, self.value)
        elif self.value:
            return self.value
        else:
            return '%s' % _('No value specified')

    class Meta:
        app_label = 'rsr'
        verbose_name = _('legacy data')
        verbose_name_plural = _('legacy data')
        ordering = ('pk',)
