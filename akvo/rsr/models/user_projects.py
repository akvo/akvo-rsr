# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _


class UserProjects(models.Model):

    user = models.OneToOneField('User', related_name='user_projects')
    is_restricted = models.BooleanField(default=False)
    projects = models.ManyToManyField(
        'Project', related_name='accessible_by', null=True, blank=True)

    def __unicode__(self):
        return '{} - {} projects'.format(
            self.user.email,
            self.projects.count())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'user projects')
        verbose_name_plural = _(u'users projects')
        ordering = ('user_id',)


class InvalidPermissionChange(Exception):
    pass


class RestrictedUserProjectsByOrg(models.Model):
    user = models.ForeignKey('User', related_name='restricted_projects')
    organisation = models.ForeignKey('Organisation', related_name='restricted_users')
    is_restricted = models.BooleanField(default=False)
    restricted_projects = models.ManyToManyField('Project', related_name='inaccessible_by',
                                                 null=True, blank=True)

    def __unicode__(self):
        return '{} - {} restricted projects'.format(
            self.user.email,
            self.restricted_projects.count())  # TODO: this is probably not what we want to show

    @staticmethod
    def restrict_projects(admin, user, projects):
        pass

    @staticmethod
    def unrestrict_projects(admin, user, projects):
        pass

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'restricted user projects')
        verbose_name_plural = _(u'restricted users projects')
        unique_together = ('user', 'organisation')
