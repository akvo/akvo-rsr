# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.fields import ValidXMLTextField

from django.db import models
from django.utils.translation import ugettext_lazy as _


STATUS_CODE = {
    1: _('success'),
    2: _('warning'),
    3: _('error')
}


class IatiCheck(models.Model):
    project = models.ForeignKey('Project', verbose_name=_('project'), related_name='iati_checks')
    status = models.PositiveSmallIntegerField(_('status'))
    description = ValidXMLTextField(_('description'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _('IATI check')
        verbose_name_plural = _('IATI checks')

    def __unicode__(self):
        if self.project and self.project.title:
            return '%s %s' % (_('IATI check for'), self.project.title)
        else:
            return '%s' % _('IATI check for unknown project')

    def show_status(self):
        if self.status not in STATUS_CODE:
            return _('unknown status')
        else:
            return STATUS_CODE[int(self.status)].title()
