# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.test import override_settings

from django.contrib.auth.models import AnonymousUser, Group

from akvo.rsr.models import Partnership, ProjectRole
from akvo.rsr.tests.base import BaseTestCase
from akvo.utils import check_auth_groups


@override_settings(AUTHENTICATION_BACKENDS=(
    'akvo.rsr.project_role_auth.ProjectRolePermissionBackend',
))
class ProjectRolePermissionBackendTestCase(BaseTestCase):

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        self.user = self.create_user('user@example.com')
        self.org = self.create_organisation('My Organisation')
        self.project = self.create_project('My Project')
        self.make_partner(self.project, self.org, role=Partnership.IATI_REPORTING_ORGANISATION)

    def test_rules_backend_ignored(self):
        self.make_employment(self.user, self.org, 'Admins')
        self.assertFalse(self.user.has_perm('rsr.change_project', self.project))

    def test_anonymous_user_does_not_have_permissions(self):
        # Given
        user = AnonymousUser()

        # When/Then
        self.assertFalse(user.has_perm('rsr.change_project', None))
        self.assertFalse(user.has_perm('rsr.change_project', self.project))

    def test_project_role_give_permissions(self):
        # Given
        user = self.user
        project = self.project
        group = Group.objects.get(name='Users')

        # When
        self.project.use_project_roles = True
        self.project.save(update_fields=['use_project_roles'])
        ProjectRole.objects.create(user=user, project=project, group=group)

        # Then
        self.assertTrue(user.has_perm('rsr.view_project', self.project))
        self.assertFalse(user.has_perm('rsr.change_project', self.project))

    def test_project_role_ignored_if_not_using_project_roles(self):
        # Given
        user = self.user
        project = self.project
        group = Group.objects.get(name='Users')

        # When
        ProjectRole.objects.create(user=user, project=project, group=group)

        # Then
        self.assertFalse(self.project.use_project_roles)
        self.assertFalse(user.has_perm('rsr.view_project', self.project))

    def test_reporting_org_admins_have_access(self):
        # Given
        user = self.user
        project = self.project
        self.make_employment(self.user, self.org, 'Admins')

        # When
        self.project.use_project_roles = True
        self.project.save(update_fields=['use_project_roles'])

        # Then
        self.assertTrue(user.has_perm('rsr.change_project', self.project))

        # When
        project.partnerships.all().delete()
        self.make_partner(project, self.org, role=Partnership.IATI_IMPLEMENTING_PARTNER)

        # Then
        self.assertFalse(user.has_perm('rsr.change_project', self.project))

    def test_rsr_admins_have_access(self):
        # Given
        user = self.user
        user.is_admin = True
        user.save(update_fields=['is_admin'])

        # When
        self.project.use_project_roles = True
        self.project.save(update_fields=['use_project_roles'])

        # Then
        self.assertTrue(user.has_perm('rsr.change_project', self.project))

    def test_permissions_with_ignored_rules_work_correctly(self):
        # Given
        user = self.user

        # When/Then
        self.assertFalse(user.has_perm('rsr.change_projectupdate', None))
        self.assertFalse(user.has_perm('rsr.change_user', None))
