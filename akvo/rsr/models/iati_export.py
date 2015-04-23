# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from ..mixins import TimestampsMixin


def file_path(self, filename):
    return 'db/organisation/%s/iati/%s' % (str(self.reporting_organisation.pk), filename)


STATUS_CODE = {
    1: _(u'pending'),
    2: _(u'in progress'),
    3: _(u'completed'),
    4: _(u'cancelled')
}


class IatiExport(TimestampsMixin, models.Model):
    reporting_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'reporting organisation'), related_name='iati_exports'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, verbose_name=_(u'user'), related_name='iati_exports'
    )
    projects = models.ManyToManyField('Project', verbose_name=_(u'projects'))
    version = ValidXMLCharField(_(u'version'), max_length=4, default='2.01')
    status = models.PositiveSmallIntegerField(_(u'status'), default=1)
    iati_file = models.FileField(_(u'IATI file'), blank=True, upload_to=file_path)
    is_public = models.BooleanField(_(u'public'), default=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI export')
        verbose_name_plural = _(u'IATI exports')

    def show_status(self):
        if not self.status in STATUS_CODE.keys():
            return _(u'unknown status')
        else:
            return STATUS_CODE[int(self.status)]
