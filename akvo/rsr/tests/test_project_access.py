# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import override_settings

from akvo.rsr.models import (
    Project, Organisation, Employment, Partnership, ProjectRole
)
from akvo.rsr.tests.base import BaseTestCase
from akvo.utils import check_auth_groups


CACHES = {'default': {'BACKEND': 'django.core.cache.backends.dummy.DummyCache'},
          'database': {'BACKEND': 'django.core.cache.backends.dummy.DummyCache'}}


@override_settings(CACHES=CACHES)
class RestrictedUserProjects(BaseTestCase):

    def setUp(self):
        r"""
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

        self.org_a = Organisation.objects.create(
            name='A', long_name='A', can_create_projects=True, enable_restrictions=True
        )
        self.org_b = Organisation.objects.create(
            name='B', long_name='B', can_create_projects=True, enable_restrictions=True
        )

        self.projects = {}
        for title in "XYZ":
            project = Project.objects.create(title=title)
            self.projects[title] = project

        Partnership.objects.create(organisation=self.org_a, project=self.projects['X'])
        Partnership.objects.create(organisation=self.org_a, project=self.projects['Y'])
        Partnership.objects.create(organisation=self.org_b, project=self.projects['Y'])
        Partnership.objects.create(organisation=self.org_b, project=self.projects['Z'])

        self.user_m = self.create_user('M@org.org')
        self.user_n = self.create_user('N@org.org')
        self.user_o = self.create_user('O@org.org')

        self.users = Group.objects.get(name='Users')
        self.admins = Group.objects.get(name='Admins')

        Employment.objects.create(
            user=self.user_m, organisation=self.org_a, group=self.admins, is_approved=True
        )
        # Primary organisation for user is org B
        Employment.objects.create(
            user=self.user_n, organisation=self.org_b, group=self.admins, is_approved=True
        )
        Employment.objects.create(
            user=self.user_n, organisation=self.org_a, group=self.admins, is_approved=True
        )
        Employment.objects.create(
            user=self.user_o, organisation=self.org_b, group=self.users, is_approved=True
        )


class ProjectAccessTestCase(BaseTestCase):

    def setUp(self):
        r"""
           User-L   User-M      User-N     User-O   User-P
             |         \        /   \      /          /
         (A-owned)      \      /     \    /          /
         Org-AA -------- Org-A       Org-B ----- Org-BB (explicitly B-owned)
            |           /      \      /    \             \
            |          /        \    /      \             \
            +------ Project-X   Project-Y   Project-Z    Project-W
        """

        # Setup groups
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        # Setup projects
        self.project_x = self.create_project('Project-X')
        self.project_y = self.create_project('Project-Y')
        self.project_z = self.create_project('Project-Z')
        self.project_w = self.create_project('Project-W')

        # Setup organisations and partnerships
        self.org_a = self.create_organisation(name='Org-A')
        self.make_partner(self.project_x, self.org_a, Partnership.IATI_REPORTING_ORGANISATION)
        self.make_partner(self.project_y, self.org_a, Partnership.IATI_REPORTING_ORGANISATION)

        self.org_b = self.create_organisation(name='Org-B')
        self.make_partner(self.project_y, self.org_b, Partnership.IATI_IMPLEMENTING_PARTNER)
        self.make_partner(self.project_z, self.org_b, Partnership.IATI_REPORTING_ORGANISATION)

        self.org_aa = self.create_organisation(name='Org-AA', can_create_projects=False)
        self.make_partner(self.project_x, self.org_aa, Partnership.IATI_IMPLEMENTING_PARTNER)

        self.org_bb = self.create_organisation(name='Org-BB', can_create_projects=False)
        self.org_bb.content_owner = self.org_b
        self.org_bb.save()
        self.make_partner(self.project_w, self.org_bb, Partnership.IATI_REPORTING_ORGANISATION)

        # Setup users (employments are setup in tests)
        self.user_l = self.create_user('user-l@example.com')
        self.user_m = self.create_user('user-m@example.com')
        self.user_n = self.create_user('user-n@example.com')
        self.user_o = self.create_user('user-o@example.com')
        self.user_p = self.create_user('user-p@example.com')

    def test_normal_access_to_org_projects(self):
        # Given/When
        self.employ_users_in_group('Users')

        # Then
        self.assertAccess(self.user_l, 'rsr.view_project', {self.project_x})
        self.assertAccess(self.user_m, 'rsr.view_project', {self.project_x, self.project_y})
        self.assertAccess(self.user_n, 'rsr.view_project',
                          {self.project_x, self.project_y, self.project_z, self.project_w})
        self.assertAccess(self.user_o, 'rsr.view_project',
                          {self.project_y, self.project_z, self.project_w})
        self.assertAccess(self.user_p, 'rsr.view_project', {self.project_w})

        self.assertEqual(set(self.user_l.my_projects()), {self.project_x})
        self.assertEqual(set(self.user_m.my_projects()), {self.project_x, self.project_y})
        self.assertEqual(set(self.user_n.my_projects()),
                         {self.project_x, self.project_y, self.project_z, self.project_w})
        self.assertEqual(set(self.user_o.my_projects()),
                         {self.project_y, self.project_z, self.project_w})
        self.assertEqual(set(self.user_p.my_projects()), {self.project_w})
        for user in [self.user_l, self.user_m, self.user_n, self.user_o, self.user_p]:
            self.assertAccess(user, 'rsr.change_project', set())

    def test_use_project_roles_disables_access(self):
        # Given
        self.employ_users_in_group('Users')

        # When
        self.project_x.use_project_roles = True
        self.project_y.use_project_roles = True
        self.project_x.save()
        self.project_y.save()

        # Then
        self.assertAccess(self.user_l, 'rsr.view_project', set())
        self.assertAccess(self.user_m, 'rsr.view_project', set())
        self.assertAccess(self.user_n, 'rsr.view_project', {self.project_z, self.project_w})
        self.assertAccess(self.user_o, 'rsr.view_project', {self.project_z, self.project_w})
        self.assertAccess(self.user_p, 'rsr.view_project', {self.project_w})

        self.assertEqual(set(self.user_l.my_projects()), set())
        self.assertEqual(set(self.user_m.my_projects()), set())
        self.assertEqual(set(self.user_n.my_projects()), {self.project_z, self.project_w})
        self.assertEqual(set(self.user_o.my_projects()), {self.project_z, self.project_w})
        self.assertEqual(set(self.user_p.my_projects()), {self.project_w})

    def test_specific_project_access_works(self):
        # Given
        self.employ_users_in_group('Users')
        self.project_x.use_project_roles = True
        self.project_y.use_project_roles = True
        self.project_x.save()
        self.project_y.save()
        users = Group.objects.get(name='Users')

        # When
        for user in [self.user_l, self.user_m, self.user_n, self.user_o, self.user_p]:
            ProjectRole.objects.create(user=user, project=self.project_y, group=users)

        # Then
        self.assertAccess(self.user_l, 'rsr.view_project', {self.project_y})
        self.assertAccess(self.user_m, 'rsr.view_project', {self.project_y})
        self.assertAccess(self.user_n, 'rsr.view_project',
                          {self.project_y, self.project_z, self.project_w})
        self.assertAccess(self.user_o, 'rsr.view_project',
                          {self.project_y, self.project_z, self.project_w})
        self.assertAccess(self.user_p, 'rsr.view_project', {self.project_y, self.project_w})
        for user in [self.user_l, self.user_m, self.user_n, self.user_o, self.user_p]:
            self.assertAccess(user, 'rsr.change_project', set())

        self.assertEqual(set(self.user_l.my_projects()), {self.project_y})
        self.assertEqual(set(self.user_m.my_projects()), {self.project_y})
        self.assertEqual(set(self.user_n.my_projects()),
                         {self.project_y, self.project_z, self.project_w})
        self.assertEqual(set(self.user_o.my_projects()),
                         {self.project_y, self.project_z, self.project_w})
        self.assertEqual(set(self.user_p.my_projects()), {self.project_y, self.project_w})

    def test_reporting_org_admin_has_access(self):
        # Given
        self.employ_users_in_group('Users')
        self.project_x.use_project_roles = True
        self.project_y.use_project_roles = True
        self.project_x.save()
        self.project_y.save()

        # When
        self.make_employment(self.user_n, self.org_a, 'Admins')

        # Then
        self.assertAccess(self.user_l, 'rsr.view_project', set())
        self.assertAccess(self.user_m, 'rsr.view_project', set())
        self.assertAccess(self.user_n, 'rsr.view_project',
                          {self.project_x, self.project_y, self.project_z, self.project_w})
        self.assertAccess(self.user_o, 'rsr.view_project', {self.project_z, self.project_w})
        self.assertAccess(self.user_p, 'rsr.view_project', {self.project_w})

        self.assertAccess(self.user_n, 'rsr.change_project', {self.project_x, self.project_y})

        self.assertEqual(set(self.user_l.my_projects()), set())
        self.assertEqual(set(self.user_m.my_projects()), set())
        self.assertEqual(set(self.user_n.my_projects()),
                         {self.project_x, self.project_y, self.project_z, self.project_w})
        self.assertEqual(set(self.user_o.my_projects()),
                         {self.project_z, self.project_w})
        self.assertEqual(set(self.user_p.my_projects()), {self.project_w})

    def employ_users_in_group(self, group_name):
        self.make_employment(self.user_l, self.org_aa, group_name)
        self.make_employment(self.user_m, self.org_a, group_name)
        self.make_employment(self.user_n, self.org_a, group_name)
        self.make_employment(self.user_n, self.org_b, group_name)
        self.make_employment(self.user_o, self.org_b, group_name)
        self.make_employment(self.user_p, self.org_bb, group_name)

    def assertAccess(self, user, permission, accessible_projects):
        all_projects = {self.project_x, self.project_y, self.project_z, self.project_w}
        inaccessible_projects = all_projects - set(accessible_projects)

        for project in accessible_projects:
            self.assertTrue(user.has_perm(permission, project),
                            '{} has no {} access to {}'.format(user, permission, project))

        for project in inaccessible_projects:
            self.assertFalse(user.has_perm(permission, project),
                             '{} incorrectly has {} access to {}'.format(user, permission, project))
