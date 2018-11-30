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


def restrict_projects(admin, user, projects):
    if admin is not None:
        check_valid_permission_change(admin, user, projects)

    user_projects, created = UserProjects.objects.get_or_create(
        user=user, defaults={'is_restricted': True}
    )

    if created:
        allowed_projects = user.approved_employments().organisations().all_projects()
        project_ids = [p.id for p in projects]
        for project in allowed_projects.exclude(id__in=project_ids):
            user_projects.projects.add(project)
    else:
        for project in projects:
            user_projects.projects.remove(project)

        if not user_projects.is_restricted:
            user_projects.is_restricted = True
            user_projects.save(update_fields=['is_restricted'])

    return user_projects


def unrestrict_projects(admin, user, projects, is_restricted=True):
    if admin is not None:
        check_valid_permission_change(admin, user, projects)

    try:
        user_projects = UserProjects.objects.get(user=user, is_restricted=is_restricted)
    except UserProjects.DoesNotExist:
        return

    for project in projects:
        user_projects.projects.add(project)

    return user_projects


def check_valid_permission_change(admin, user, projects):
    project_ids = {project.id for project in projects}
    check_projects_adminable(admin, project_ids)
    check_user_not_admin(user, project_ids)
    check_user_manageable(admin, user)


def check_projects_adminable(admin, project_ids):
    admin_projects = set(admin.admin_projects().values_list('pk', flat=True))
    if project_ids - admin_projects:
        raise InvalidPermissionChange


def check_user_not_admin(user, project_ids):
    admin_projects = set(user.admin_projects().values_list('pk', flat=True))
    if project_ids & admin_projects:
        raise InvalidPermissionChange


def check_user_manageable(admin, user):
    orgs_with_restrictions = admin.get_admin_employment_orgs().content_owned_organisations().filter(
        enable_restrictions=True
    )
    if not orgs_with_restrictions.users().filter(id=user.id).exists():
        raise InvalidPermissionChange


EUTF_ORG_ID = 3394
EUTF_PROJECT_ID = 4401


class InvalidPermissionChange(Exception):
    pass
