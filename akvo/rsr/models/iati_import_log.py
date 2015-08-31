# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLTextField


class IatiImportLog(models.Model):
    iati_import = models.ForeignKey(
        'IatiImport', verbose_name=_(u'iati_import'), related_name='iati_import_logs'
    )
    text = ValidXMLTextField(_(u'text'))
    error = models.BooleanField(_(u'error'), default=False)
    project = models.ForeignKey(
        'Project', verbose_name=_(u'project'), related_name='iati_project_import_logs',
        blank=True, null=True
    )

    def __unicode__(self):
        return u'%s (ID: %s): %s' % (_(u'IATI import log'), str(self.iati_import.pk), self.text)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI import log')
        verbose_name_plural = _(u'IATI import logs')
