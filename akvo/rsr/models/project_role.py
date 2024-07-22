# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth.models import Group
from django.db import models
from django.utils.translation import gettext_lazy as _


class ProjectRole(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, verbose_name=_(u'project'))
    user = models.ForeignKey('User', on_delete=models.CASCADE, verbose_name=_(u'user'))
    group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name=_(u'group'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project role')
        verbose_name_plural = _(u'project roles')
        unique_together = ('project', 'user', 'group')
