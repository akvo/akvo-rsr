# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _


ACTION_CODE = {
    1: _(u'create'),
    2: _(u'update')
}


STATUS_CODE = {
    1: _(u'pending'),
    2: _(u'import in progress'),
    3: _(u'completed'),
    4: _(u'cancelled')
}


class IatiProjectImport(models.Model):
    iati_import = models.ForeignKey(
        'IatiImport', verbose_name=_(u'iati_import'), related_name='iati_project_imports'
    )
    project = models.ForeignKey(
        'Project', verbose_name=_(u'project'), related_name='iati_project_imports'
    )
    action = models.PositiveSmallIntegerField(_(u'action'))
    status = models.PositiveSmallIntegerField(_(u'status'), default=1)
    start_date = models.DateTimeField(_(u'start date'), null=True, blank=True)
    end_date = models.DateTimeField(_(u'end date'), null=True, blank=True)

    def __unicode__(self):
        return u'%s %s' % (_(u'IATI project import for'), self.project)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI project import')
        verbose_name_plural = _(u'IATI project imports')

    def show_action(self):
        if self.action not in ACTION_CODE.keys():
            return _(u'unknown action')
        else:
            return ACTION_CODE[int(self.action)]

    def show_status(self):
        if self.status not in STATUS_CODE.keys():
            return _(u'unknown status')
        else:
            return STATUS_CODE[int(self.status)]
