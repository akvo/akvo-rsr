# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.mixins import TimestampsMixin

from django.db import models
from django.utils.translation import gettext_lazy as _


STATUS_CODE = {
    1: _('in progress'),
    2: _('finished')
}


class IatiActivityExport(TimestampsMixin):
    """
    The IatiActivityExport tracks the export of one IATI activity. Each project exported by an
    IATI export will have a IatiActivityExport record.
    """
    iati_export = models.ForeignKey('IatiExport', on_delete=models.CASCADE, related_name='iati_activity_exports')
    project = models.ForeignKey(
        'Project', on_delete=models.SET_NULL, verbose_name=_('project'), related_name='iati_project_exports', null=True
    )
    status = models.PositiveSmallIntegerField(_('status'), default=1)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('IATI activity export')
        verbose_name_plural = _('IATI activity exports')

    def __str__(self):
        if self.project and self.project.title:
            return '%s %s' % (_('IATI export for'), self.project.title)
        else:
            return '%s' % _('IATI export for project with no title')

    def show_status(self):
        if self.status not in STATUS_CODE:
            return _('unknown status')
        else:
            return STATUS_CODE[int(self.status)].title()
