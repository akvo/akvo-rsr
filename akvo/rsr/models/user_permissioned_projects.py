# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _


class UserPermissionedProjects(models.Model):

    user = models.OneToOneField('user', related_name='permitted_projects')
    projects = models.ManyToManyField('Project', related_name='permitted_users')

    def __unicode__(self):
        return '{} - {} projects'.format(self.user.email, self.projects.count())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'user permissioned projects')
        verbose_name_plural = _(u'user permissioned projects')
        ordering = ['user_id', ]
