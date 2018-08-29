# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.contrib.auth.models import Group

from akvo.rsr.models import (
    Project, Organisation, Employment, Partnership
)
from akvo.rsr.models.user_projects import restrict_projects, unrestrict_projects
from akvo.rsr.models.user_projects import InvalidPermissionChange
from akvo.rsr.tests.base import BaseTestCase
from akvo.utils import check_auth_groups


class RestrictedUserProjects(BaseTestCase):

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

        self.org_a = Organisation.objects.create(name='A', long_name='A', can_create_projects=True)
        self.org_b = Organisation.objects.create(name='B', long_name='B', can_create_projects=True)

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


class RestrictedUserProjectsByOrgTestCase(RestrictedUserProjects):

    def test_user_project_access_default(self):
        self.assertTrue(self.projects['X'].connected_to_user(self.user_m))
        self.assertTrue(self.projects['X'].connected_to_user(self.user_n))
        self.assertTrue(self.projects['Y'].connected_to_user(self.user_m))
        self.assertTrue(self.projects['Y'].connected_to_user(self.user_n))
        self.assertTrue(self.projects['Y'].connected_to_user(self.user_o))
        self.assertTrue(self.projects['Z'].connected_to_user(self.user_n))
        self.assertTrue(self.projects['Z'].connected_to_user(self.user_o))

    def test_new_user_can_view_projects(self):
        unrestricted_user = self.create_user('A@org.org')
        Employment.objects.create(
            user=unrestricted_user, organisation=self.org_a, group=self.users, is_approved=True
        )

        self.assertTrue(unrestricted_user.has_perm('rsr.view_project', self.projects['X']))
        self.assertTrue(unrestricted_user.has_perm('rsr.view_project', self.projects['Y']))
        self.assertFalse(unrestricted_user.has_perm('rsr.view_project', self.projects['Z']))

    def test_admin_can_restrict_new_user(self):
        user = self.create_user('A@org.org')
        Employment.objects.create(
            user=user, organisation=self.org_a, group=self.users, is_approved=True
        )
        admin = self.user_m
        project = self.projects['X']

        restrict_projects(admin, user, [project])

        self.assertFalse(user.has_perm('rsr.view_project', self.projects['X']))
        self.assertTrue(user.has_perm('rsr.view_project', self.projects['Y']))

    def test_admin_can_restrict_new_content_owned_user(self):
        """
        User M      User N      User O         User P
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
        Partnership.objects.create(
            organisation=org_content_owned,
            project=self.projects['Y'],
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )
        self.user_p = self.create_user('P@org.org')
        Employment.objects.create(
            user=self.user_p, organisation=org_content_owned, group=self.users, is_approved=True
        )

        restrict_projects(self.user_m, self.user_p, [self.projects['Y']])

        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['X']))  # no empl
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['Y']))

    def test_another_admin_can_unrestrict_user(self):
        """
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B                Org C (content owned)
            /             /    \                  |
           /             /      \                 |
        Project X   Project Y   Project Z         |
                        |                         |
                        +-------------------------+
        """
        # Given
        self.test_admin_can_restrict_new_content_owned_user()
        project = self.projects['Y']

        # When
        project.partnerships.filter(organisation=self.org_a).delete()
        unrestrict_projects(self.user_n, self.user_p, [self.projects['Y']])

        # Then
        self.assertTrue(self.user_p.has_perm('rsr.view_project', self.projects['Y']))

    def test_user_can_be_restricted_by_multiple_admins(self):
        Employment.objects.create(
            user=self.user_o, organisation=self.org_a, group=self.users, is_approved=True
        )
        X, Y, Z = (self.projects[name] for name in 'XYZ')

        restrict_projects(self.user_m, self.user_o, [X])
        restrict_projects(self.user_n, self.user_o, [Y])
        restrict_projects(self.user_n, self.user_o, [Z])

        self.assertFalse(self.user_o.has_perm('rsr.view_project', X))
        self.assertFalse(self.user_o.has_perm('rsr.view_project', Y))
        self.assertFalse(self.user_o.has_perm('rsr.view_project', Z))

    def test_admin_cannot_restrict_inaccessible_projects(self):
        Z = self.projects['Z']

        with self.assertRaises(InvalidPermissionChange):
            restrict_projects(self.user_m, self.user_o, [Z])

        self.assertTrue(self.user_o.has_perm('rsr.view_project', self.projects['Z']))

    def test_admin_cannot_restrict_inaccessible_projects_for_content_owned_user(self):
        """
        User M      User N      User O         User P
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
            name='C', long_name='C', can_create_projects=False,
        )
        Partnership.objects.create(
            organisation=org_content_owned,
            project=self.projects['Y'],
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )
        Partnership.objects.create(
            organisation=org_content_owned,
            project=self.projects['Z'],
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )
        user = self.create_user('P@org.org')
        Employment.objects.create(
            user=user, organisation=org_content_owned, group=self.users, is_approved=True
        )

        with self.assertRaises(InvalidPermissionChange):
            restrict_projects(self.user_m, user, [self.projects['Z']])

    def test_admin_cannot_restrict_other_admins(self):
        with self.assertRaises(InvalidPermissionChange):
            restrict_projects(
                self.user_m, self.user_n, [self.projects['Y']]
            )

        self.assertTrue(self.user_n.has_perm('rsr.view_project', self.projects['Y']))
        self.assertTrue(self.user_n.has_perm('rsr.view_project', self.projects['Z']))

    def test_admin_cannot_restrict_unmanageable_user(self):
        Y = self.projects['Y']

        with self.assertRaises(InvalidPermissionChange):
            restrict_projects(self.user_m, self.user_o, [Y])

        self.assertTrue(self.user_o.has_perm('rsr.view_project', Y))

    def test_admin_employers_swapped_as_partners_retains_restrictions(self):
        """
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B                Org C (content owned)
            /             /    \                  |
           /             /      \                 |
        Project X   Project Y   Project Z         |
                        |                         |
                        +-------------------------+
        """
        Y = self.projects['Y']
        Partnership.objects.get(organisation=self.org_a, project=Y).delete()
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False,
        )
        Partnership.objects.create(
            organisation=org_content_owned,
            project=Y,
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )
        user_p = self.create_user('P@org.org')
        Employment.objects.create(
            user=user_p, organisation=org_content_owned, group=self.users, is_approved=True
        )

        restrict_projects(self.user_n, user_p, [Y])
        Partnership.objects.get(organisation=self.org_b, project=Y).delete()
        Partnership.objects.create(organisation=self.org_a, project=Y)

        self.assertFalse(user_p.has_perm('rsr.view_project', Y))

    # Remove Restrictions

    def test_admin_can_remove_restrictions(self):
        user = self.create_user('A@org.org')
        Employment.objects.create(
            user=user, organisation=self.org_a, group=self.users, is_approved=True
        )
        restrict_projects(self.user_m, user, [self.projects['X']])

        unrestrict_projects(self.user_m, user, [self.projects['X']])

        self.assertTrue(user.has_perm('rsr.view_project', self.projects['X']))
        self.assertTrue(user.has_perm('rsr.view_project', self.projects['Y']))

    def test_admin_cannot_remove_restrictions_from_non_manageable_user(self):
        user = self.create_user('P@org.org')
        Employment.objects.create(
            user=user, organisation=self.org_b, group=self.users, is_approved=True
        )
        restrict_projects(self.user_n, user, [self.projects['Y']])

        with self.assertRaises(InvalidPermissionChange):
            unrestrict_projects(self.user_m, user, [self.projects['Y']])

        self.assertFalse(user.has_perm('rsr.view_project', self.projects['Y']))
        self.assertTrue(user.has_perm('rsr.view_project', self.projects['Z']))

    # Add Restrictions

    def test_can_add_new_restrictions(self):
        restrict_projects(
            self.user_n, self.user_o, [self.projects['Z']]
        )

        restrict_projects(
            self.user_n, self.user_o, [self.projects['Y']]
        )

        self.assertFalse(self.user_o.has_perm('rsr.view_project', self.projects['Z']))
        self.assertFalse(self.user_o.has_perm('rsr.view_project', self.projects['Y']))

    # Add a new project

    def test_new_projects_are_not_accessible_to_restricted_users(self):
        restrict_projects(
            self.user_n, self.user_o, [self.projects['Z']]
        )

        project = Project.objects.create(title='W')
        Partnership.objects.create(organisation=self.org_b, project=project)

        self.assertFalse(self.user_o.has_perm('rsr.view_project', project))
        self.assertFalse(self.user_o.has_perm('rsr.view_project', self.projects['Z']))

    def test_new_projects_are_accessible_to_restricted_users_if_include_restricted(self):
        # Given
        restrict_projects(
            self.user_n, self.user_o, [self.projects['Z']]
        )

        # When
        project = Project.objects.create(title='W')
        Project.new_project_created(project.id, self.user_n)

        # Then
        self.assertTrue(self.org_b.include_restricted)
        self.assertFalse(self.user_o.has_perm('rsr.view_project', self.projects['Z']))
        self.assertTrue(self.user_o.has_perm('rsr.view_project', project))

    def test_new_projects_are_accessible_to_unrestricted_users(self):
        project = Project.objects.create(title='W')
        Partnership.objects.create(organisation=self.org_b, project=project)

        self.assertTrue(self.user_o.has_perm('rsr.view_project', project))
        self.assertTrue(self.user_o.has_perm('rsr.view_project', self.projects['Z']))

    def test_new_projects_are_accessible_in_unrestricted_orgs(self):
        """
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B - -Project W- - Org C
            /      \      /    \          _____/  |
           /        \    /      \        /        |
        Project X   Project Y   Project Z         |
                        |                         |
                        +-------------------------+
        """
        # Given
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False
        )
        Partnership.objects.create(
            organisation=org_content_owned,
            project=self.projects['Y'],
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )
        Partnership.objects.create(
            organisation=org_content_owned,
            project=self.projects['Z'],
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )
        self.user_p = self.create_user('P@org.org')
        Employment.objects.create(
            user=self.user_p, organisation=org_content_owned, group=self.users, is_approved=True
        )
        restrict_projects(self.user_m, self.user_p, [self.projects['Y']])

        # When
        self.assertTrue(self.org_b.include_restricted)
        self.projects['W'] = project = Project.objects.create(title='W')
        # FIXME: Ideally, this call should be automatic, but is manual now.
        Project.new_project_created(project.id, self.user_n)
        Partnership.objects.create(
            organisation=org_content_owned,
            project=project,
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )

        # Then
        self.assertTrue(self.user_p.has_perm('rsr.view_project', self.projects['Z']))
        self.assertTrue(self.user_p.has_perm('rsr.view_project', project))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['Y']))

    # Remove a partner

    def test_removing_partner_does_not_restore_access(self):
        """
        User M      User N      User O         User P
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
        Partnership.objects.create(
            organisation=org_content_owned,
            project=self.projects['Y'],
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )
        user_p = self.create_user('P@org.org')
        Employment.objects.create(
            user=user_p, organisation=org_content_owned, group=self.users, is_approved=True
        )
        restrict_projects(self.user_m, user_p, [self.projects['Y']])

        Partnership.objects.get(organisation=self.org_a, project=self.projects['Y']).delete()

        self.assertFalse(user_p.has_perm('rsr.view_project', self.projects['Y']))

    def test_removing_one_role_of_partner_does_not_restore_access(self):
        """
        User M      User N      User O
        Admin       Admin       User
           \        /   \      /
            \      /     \    /  Funding partner
              Org A       Org B-------+
            /      \      /    \      | (default partnership)
           /        \    /      \     |
        Project X   Project Y   Project Z
        """
        extra_partnership = Partnership.objects.create(
            organisation=self.org_b,
            project=self.projects['Z'],
            iati_organisation_role=Partnership.IATI_FUNDING_PARTNER
        )
        Z = self.projects['Z']
        restrict_projects(self.user_n, self.user_o, [Z])

        extra_partnership.delete()

        self.assertFalse(self.user_o.has_perm('rsr.view_project', Z))

    def test_removing_and_adding_partnership_doesnot_change_permissions(self):
        Z = self.projects['Z']
        restrict_projects(self.user_n, self.user_o, [Z])

        Partnership.objects.get(organisation=self.org_b, project=Z).delete()
        Partnership.objects.create(organisation=self.org_b, project=Z)

        self.assertFalse(self.user_o.has_perm('rsr.view_project', Z))

    def test_removing_reporting_partner_does_not_change_access(self):
        """
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B - -Project W- - Org C
            /      \      /    \          _____/  |
           /        \    /      \        /        |
        Project X   Project Y   Project Z         |
                        |                         |
                        +-------------------------+
        """
        # Given
        self.test_new_projects_are_accessible_in_unrestricted_orgs()
        project = self.projects['W']

        # When
        project.partnerships.filter(
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
        ).delete()

        # Then
        self.assertTrue(self.user_p.has_perm('rsr.view_project', project))
        self.assertTrue(self.user_p.has_perm('rsr.view_project', self.projects['Z']))
        self.assertTrue(self.user_p.has_perm('rsr.view_project', project))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['Y']))
