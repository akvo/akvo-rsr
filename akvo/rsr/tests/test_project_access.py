# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase

from akvo.rsr.models import (
    Project, Organisation, Employment, Partnership, RestrictedUserProjectsByOrg
)
from akvo.rsr.models.user_projects import InvalidPermissionChange
from akvo.rsr.tests.test_permissions import PermissionsTestCase
from akvo.utils import check_auth_groups


class RestrictedUserProjectsByOrgTestCase(TestCase):

    def setUp(self):
        """
        User M      User N      User O
        Admin       Admin       User
           \        /   \      /
            \      /     \    /
              Org A       Org B
            /      \      /    \
           /        \    /      \
        Project X   Project Y   Project Z
        """

        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        self.org_a = Organisation.objects.create(name='A', long_name='A')
        self.org_b = Organisation.objects.create(name='B', long_name='B')

        self.projects = {}
        for title in "XYZ":
            project = Project.objects.create(title=title)
            self.projects[title] = project

        Partnership.objects.create(organisation=self.org_a, project=self.projects['X'])
        Partnership.objects.create(organisation=self.org_a, project=self.projects['Y'])
        Partnership.objects.create(organisation=self.org_b, project=self.projects['Y'])
        Partnership.objects.create(organisation=self.org_b, project=self.projects['Z'])

        self.user_m = PermissionsTestCase.create_user('M@org.org')
        self.user_n = PermissionsTestCase.create_user('N@org.org')
        self.user_o = PermissionsTestCase.create_user('O@org.org')

        self.users = Group.objects.get(name='Users')
        self.admins = Group.objects.get(name='Admins')

        Employment.objects.create(
            user=self.user_m, organisation=self.org_a, group=self.admins, is_approved=True
        )
        Employment.objects.create(
            user=self.user_n, organisation=self.org_a, group=self.admins, is_approved=True
        )
        Employment.objects.create(
            user=self.user_n, organisation=self.org_b, group=self.admins, is_approved=True
        )
        Employment.objects.create(
            user=self.user_o, organisation=self.org_b, group=self.users, is_approved=True
        )

    def test_user_project_access_default(self):
        self.assertTrue(self.projects['X'].connected_to_user(self.user_m))
        self.assertTrue(self.projects['X'].connected_to_user(self.user_n))
        self.assertTrue(self.projects['Y'].connected_to_user(self.user_m))
        self.assertTrue(self.projects['Y'].connected_to_user(self.user_n))
        self.assertTrue(self.projects['Y'].connected_to_user(self.user_o))
        self.assertTrue(self.projects['Z'].connected_to_user(self.user_n))
        self.assertTrue(self.projects['Z'].connected_to_user(self.user_o))

    def test_new_user_can_view_projects(self):
        unrestricted_user = PermissionsTestCase.create_user('A@org.org')
        Employment.objects.create(
            user=unrestricted_user, organisation=self.org_a, group=self.users, is_approved=True
        )

        self.assertTrue(unrestricted_user.has_perm('rsr.view_project', self.projects['X']))
        self.assertTrue(unrestricted_user.has_perm('rsr.view_project', self.projects['Y']))
        self.assertFalse(unrestricted_user.has_perm('rsr.view_project', self.projects['Z']))

    def test_admin_can_restrict_new_user(self):
        user = PermissionsTestCase.create_user('A@org.org')
        Employment.objects.create(
            user=user, organisation=self.org_a, group=self.users, is_approved=True
        )
        admin = self.user_m
        project = self.projects['X']

        RestrictedUserProjectsByOrg.restrict_projects(admin, user, [project])

        self.assertFalse(user.has_perm('rsr.view_project', self.projects['X']))
        self.assertTrue(user.has_perm('rsr.view_project', self.projects['Y']))

    def test_admin_can_restrict_new_content_owned_user(self):
        """
        User M      User N      User O         User C
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B                Org C (content owned)
            /      \      /    \                  |
           /        \    /      \                 |
        Project X   Project Y   Project Z         |
                        |                         |
                        +-------------------------+
        """
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False
        )
        Partnership.objects.create(organisation=org_content_owned, project=self.projects['Y'])
        user = PermissionsTestCase.create_user('A@org.org')
        Employment.objects.create(
            user=user, organisation=org_content_owned, group=self.users, is_approved=True
        )

        RestrictedUserProjectsByOrg.restrict_projects(self.user_m, user, [self.projects['Y']])

        self.assertFalse(user.has_perm('rsr.view_project', self.projects['X']))  # by employment
        self.assertFalse(user.has_perm('rsr.view_project', self.projects['Y']))

    def test_admin_cannot_restrict_inaccessible_projects(self):
        Z = self.projects['Z']

        with self.assertRaises(InvalidPermissionChange):
            RestrictedUserProjectsByOrg.restrict_projects(self.user_m, self.user_o, [Z])

        self.assertTrue(self.user_o.has_perm('rsr.view_project', self.projects['Z']))

    def test_admin_cannot_restrict_other_admins(self):
        with self.assertRaises(InvalidPermissionChange):
            RestrictedUserProjectsByOrg.restrict_projects(self.user_m, self.user_n, [self.projects['Y']])

        self.assertTrue(self.user_n.has_perm('rsr.view_project', self.projects['Y']))
        self.assertTrue(self.user_n.has_perm('rsr.view_project', self.projects['Z']))

    def test_admin_cannot_restrict_inaccessible_projects_for_content_owned_user(self):
        """
        User M      User N      User O         User C
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B             /--Org C
            /      \      /    \       /----      |
           /        \    /      \   ---           |
        Project X   Project Y   Project Z         |
                        |                         |
                        +-------------------------+
        """
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False
        )
        Partnership.objects.create(organisation=org_content_owned, project=self.projects['Y'])
        Partnership.objects.create(organisation=org_content_owned, project=self.projects['Z'])
        user = PermissionsTestCase.create_user('user@C.org')
        Employment.objects.create(
            user=user, organisation=org_content_owned, group=self.users, is_approved=True
        )

        with self.assertRaises(InvalidPermissionChange):
            RestrictedUserProjectsByOrg.restrict_projects(self.user_m, user, [self.projects['Z']])
