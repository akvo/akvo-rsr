# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _


class IatiProjectImport(models.Model):
    CREATE_ACTION = 1
    UPDATE_ACTION = 2

    ACTION_CODES = (
        (CREATE_ACTION, _(u'create')),
        (UPDATE_ACTION, _(u'update'))
    )

    PENDING_STATUS = 1
    IN_PROGRESS_STATUS = 2
    COMPLETED_STATUS = 3
    CANCELLED_STATUS = 4

    STATUS_CODES = (
        (PENDING_STATUS, _(u'pending')),
        (IN_PROGRESS_STATUS, _(u'import in progress')),
        (COMPLETED_STATUS, _(u'completed')),
        (CANCELLED_STATUS, _(u'cancelled'))
    )

    iati_import = models.ForeignKey(
        'IatiImport', verbose_name=_(u'iati_import'), related_name='iati_project_imports'
    )
    project = models.ForeignKey(
        'Project', verbose_name=_(u'project'), related_name='iati_project_imports'
    )
    action = models.PositiveSmallIntegerField(_(u'action'), choices=ACTION_CODES)
    status = models.PositiveSmallIntegerField(_(u'status'), choices=STATUS_CODES,
                                              default=PENDING_STATUS)
    start_date = models.DateTimeField(_(u'start date'), null=True, blank=True)
    end_date = models.DateTimeField(_(u'end date'), null=True, blank=True)

    def __unicode__(self):
        return u'%s %s' % (_(u'IATI project import for'), self.project)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI project import')
        verbose_name_plural = _(u'IATI project imports')

    def show_action(self):
        return dict(map(lambda x: x, self.ACTION_CODES))[self.action]

    def show_status(self):
        return dict(map(lambda x: x, self.STATUS_CODES))[self.status]
