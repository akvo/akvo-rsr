# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from .iati_project_import import IatiProjectImport


def file_path(self, filename):
    return 'db/organisation/%s/iati_import/%s' % (str(self.reporting_organisation.pk), filename)


STATUS_CODE = {
    1: _(u'pending'),
    2: _(u'retrieving file'),
    3: _(u'import in progress'),
    4: _(u'completed'),
    5: _(u'cancelled')
}


class IatiImport(models.Model):
    reporting_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'reporting organisation'), related_name='iati_imports'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, verbose_name=_(u'user'), related_name='iati_imports'
    )
    url = models.URLField(_(u'url'), blank=True)
    local_file = models.FileField(_(u'local file'), blank=True, upload_to=file_path)
    status = models.PositiveSmallIntegerField(_(u'status'), default=1)
    start_date = models.DateTimeField(_(u'start date'), null=True, blank=True)
    end_date = models.DateTimeField(_(u'end date'), null=True, blank=True)
    projects = models.ManyToManyField(
        'Project', verbose_name=_(u'projects'), through=IatiProjectImport, blank=True
    )

    def __unicode__(self):
        return u'%s %s (%s)' % (_(u'IATI import for'),
                                self.reporting_organisation,
                                self.show_status())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI import')
        verbose_name_plural = _(u'IATI imports')

    def show_status(self):
        if not self.status in STATUS_CODE.keys():
            return _(u'unknown status')
        else:
            return STATUS_CODE[int(self.status)]
