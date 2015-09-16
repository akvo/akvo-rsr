# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLTextField

SEVERITY_CODE = {
    0: _(u'information'),
    1: _(u'critical error'),
    2: _(u'value not saved'),
    3: _(u'value partly saved'),
}


class IatiImportLog(models.Model):
    iati_import = models.ForeignKey(
        'IatiImport', verbose_name=_(u'iati_import'), related_name='iati_import_logs'
    )
    project = models.ForeignKey(
        'Project', verbose_name=_(u'project'), related_name='iati_project_import_logs',
        blank=True, null=True
    )
    severity = models.IntegerField(_(u'severity'), default=1)
    text = ValidXMLTextField(_(u'text'))

    def __unicode__(self):
        return u'%s (ID: %s): %s' % (_(u'IATI import log'), str(self.iati_import.pk), self.text)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI import log')
        verbose_name_plural = _(u'IATI import logs')

    def show_severity(self):
        if not self.severity in SEVERITY_CODE.keys():
            return _(u'unknown severity')
        else:
            return SEVERITY_CODE[int(self.severity)]
