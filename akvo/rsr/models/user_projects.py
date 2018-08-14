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
    # FIXME: Are we keeping this? Or getting rid of this?
    is_restricted = models.BooleanField(default=False)
    restricted_projects = models.ManyToManyField('Project', related_name='inaccessible_by',
                                                 null=True, blank=True)

    def __unicode__(self):
        return '{} - {} restricted projects'.format(
            self.user.email,
            self.restricted_projects.count())  # TODO: this is probably not what we want to show

    @staticmethod
    def restrict_projects(admin, user, projects):
        RestrictedUserProjectsByOrg.check_valid_permission_change(admin, user, projects)
        GROUP_NAME_ADMINS = 'Admins'
        for employment in admin.approved_employments(group_names=[GROUP_NAME_ADMINS]):
            rupbo, _ = RestrictedUserProjectsByOrg.objects.get_or_create(
                user=user, organisation=employment.organisation, defaults={'is_restricted': True}
            )
            # FIXME: Does this need to be only projects where the org is a partner?
            # See test_admin_employment_organisations_swapped_as_partners_retains_restrictions
            for project in projects:
                rupbo.restricted_projects.add(project)

    @staticmethod
    def unrestrict_projects(admin, user, projects):
        RestrictedUserProjectsByOrg.check_valid_permission_change(admin, user, projects)
        GROUP_NAME_ADMINS = 'Admins'
        for employment in admin.approved_employments(group_names=[GROUP_NAME_ADMINS]):
            rupbo, _ = RestrictedUserProjectsByOrg.objects.get_or_create(
                user=user, organisation=employment.organisation, defaults={'is_restricted': True}
            )
            for project in projects:
                rupbo.restricted_projects.remove(project)

    @staticmethod
    def check_valid_permission_change(admin, user, projects):
        project_ids = {project.id for project in projects}
        RestrictedUserProjectsByOrg.check_projects_adminable(admin, project_ids)
        RestrictedUserProjectsByOrg.check_user_not_admin(user, project_ids)
        RestrictedUserProjectsByOrg.check_user_manageable(admin, user)

    @staticmethod
    def check_projects_adminable(admin, project_ids):
        admin_projects = set(admin.admin_projects().values_list('pk', flat=True))
        if project_ids - admin_projects:
            raise(InvalidPermissionChange)

    @staticmethod
    def check_user_not_admin(user, project_ids):
        admin_projects = set(user.admin_projects().values_list('pk', flat=True))
        if project_ids & admin_projects:
            raise(InvalidPermissionChange)

    @staticmethod
    def check_user_manageable(admin, user):
        if not admin.get_owned_org_users().filter(id=user.id).exists():
            raise(InvalidPermissionChange)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'restricted user projects')
        verbose_name_plural = _(u'restricted users projects')
        unique_together = ('user', 'organisation')
