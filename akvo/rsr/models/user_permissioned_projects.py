# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models


class UserPermissionedProjects(models.Model):

    user = models.OneToOneField('user', related_name='permitted_projects')
    projects = models.ManyToManyField('Project', related_name='permitted_users')
