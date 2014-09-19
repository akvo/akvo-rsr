# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLTextField
from ..mixins import TimestampsMixin


class ProjectComment(TimestampsMixin, models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_(u'user'))
    comment = ValidXMLTextField(_(u'comment'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project comment')
        verbose_name_plural = _(u'project comments')
        ordering = ('-id',)
