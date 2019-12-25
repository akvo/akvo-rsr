# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.fields import ValidXMLTextField

from django.db import models
from django.utils.translation import ugettext_lazy as _


STATUS_CODE = {
    1: _(u'success'),
    2: _(u'warning'),
    3: _(u'error')
}


class IatiCheck(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='iati_checks')
    status = models.PositiveSmallIntegerField(_(u'status'))
    description = ValidXMLTextField(_(u'description'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI check')
        verbose_name_plural = _(u'IATI checks')

    def __unicode__(self):
        if self.project and self.project.title:
            return u'%s %s' % (_(u'IATI check for'), self.project.title)
        else:
            return u'%s' % _(u'IATI check for unknown project')

    def show_status(self):
        if self.status not in STATUS_CODE:
            return _(u'unknown status')
        else:
            return STATUS_CODE[int(self.status)].title()
