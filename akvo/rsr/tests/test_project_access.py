# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.contrib.auth.models import Group

from akvo.rsr.models import (
    Project, Organisation, Employment, Partnership, ProjectRole
)
from akvo.rsr.models.organisation import CannotDisableRestrictions
from akvo.rsr.models.user_projects import restrict_projects, unrestrict_projects
from akvo.rsr.models.user_projects import InvalidPermissionChange
from akvo.rsr.tests.base import BaseTestCase
from akvo.utils import check_auth_groups


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


class RestrictedUserProjectsByOrgTestCase(RestrictedUserProjects):

    def assertProjectConnectedToUser(self, project, user):
        '''
        Assert if a user is connected to project through an organisation
        '''
        projects = [p
                    for organisation in user.organisations.all()
                    for p in organisation.all_projects()]
        self.assertIn(project, projects)

    def test_user_project_access_default(self):
        self.assertProjectConnectedToUser(self.projects['X'], self.user_m)
        self.assertProjectConnectedToUser(self.projects['X'], self.user_n)
        self.assertProjectConnectedToUser(self.projects['Y'], self.user_m)
        self.assertProjectConnectedToUser(self.projects['Y'], self.user_n)
        self.assertProjectConnectedToUser(self.projects['Y'], self.user_o)
        self.assertProjectConnectedToUser(self.projects['Z'], self.user_n)
        self.assertProjectConnectedToUser(self.projects['Z'], self.user_o)

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
        r"""
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
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
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
        r"""
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
        r"""
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
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
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
        r"""
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
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
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

    def test_new_projects_are_not_accessible_to_restricted_users_if_enable_restrictions(self):
        restrict_projects(
            self.user_n, self.user_o, [self.projects['Z']]
        )

        project = Project.objects.create(title='W')
        Project.new_project_created(project.id, self.user_n)

        self.assertFalse(self.user_o.has_perm('rsr.view_project', project))
        self.assertFalse(self.user_o.has_perm('rsr.view_project', self.projects['Z']))

    def test_new_projects_are_accessible_to_unrestricted_users(self):
        project = Project.objects.create(title='W')
        Partnership.objects.create(organisation=self.org_b, project=project)

        self.assertTrue(self.user_o.has_perm('rsr.view_project', project))
        self.assertTrue(self.user_o.has_perm('rsr.view_project', self.projects['Z']))

    def test_new_projects_are_accessible_in_unrestricted_orgs(self):
        r"""
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B - -Project W- - Org C
            /      \      /    \          _____/  |
           /        \    /      \        /        |
        Project X   Project Y   Project Z         |
            |                                     |
            +-------------------------------------+
        """
        # Given
        self.org_b.enable_restrictions = False
        self.org_b.save()
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
        )
        Partnership.objects.create(
            organisation=org_content_owned,
            project=self.projects['X'],
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
        restrict_projects(self.user_m, self.user_p, [self.projects['X']])

        # When
        self.projects['W'] = project = Project.objects.create(title='W')
        # FIXME: Ideally, this call should be automatic, but is manual now.
        Project.new_project_created(project.id, self.user_n)
        Partnership.objects.create(
            organisation=org_content_owned,
            project=project,
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )

        # Then
        self.assertFalse(self.org_b.enable_restrictions)
        self.assertTrue(self.user_p.has_perm('rsr.view_project', self.projects['Z']))
        self.assertTrue(self.user_p.has_perm('rsr.view_project', project))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['Y']))

    def test_new_projects_become_accessible_to_new_content_owned_org_users(self):
        r"""
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B --- Project W---Org C
            /      \      /    \                  |
           /        \    /      \                 |
        Project X   Project Y   Project Z         |
            |                                     |
            +-------------------------------------+
        """
        # Given
        self.org_b.enable_restrictions = False
        self.org_b.save()
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
        )
        Partnership.objects.create(
            organisation=org_content_owned,
            project=self.projects['X'],
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )
        self.user_p = self.create_user('P@org.org')
        Employment.objects.create(
            user=self.user_p, organisation=org_content_owned, group=self.users, is_approved=True
        )
        restrict_projects(self.user_m, self.user_p, [self.projects['X']])

        # When
        self.projects['W'] = project = Project.objects.create(title='W')
        # FIXME: Ideally, this call should be automatic, but is manual now.
        Project.new_project_created(project.id, self.user_n)
        Partnership.objects.create(
            organisation=org_content_owned,
            project=project,
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )

        # Then
        self.assertFalse(self.org_b.enable_restrictions)
        self.assertTrue(org_content_owned.enable_restrictions)
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['X']))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['Y']))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['Z']))
        self.assertTrue(self.user_p.has_perm('rsr.view_project', project))

    def test_new_projects_not_accessible_to_implementing_partners_not_content_owned_org_users(self):
        r"""
           ---------------------------------------------+
          /                                             |
        User M      User N      User O         User P   |
        Admin       Admin       User              |     |
           \        /   \      /                  |     |
            \      /     \    /                   |     |
              Org A       Org B --- Project W---Org C --+
            /      \      /    \                  |
           /        \    /      \                 |
        Project X   Project Y   Project Z         |
            |                                     |
            +-------------------------------------+
        """
        # Given
        self.org_b.enable_restrictions = False
        self.org_b.save()
        implementing_partner = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=True, enable_restrictions=True
        )
        Partnership.objects.create(
            organisation=implementing_partner,
            project=self.projects['X'],
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )
        self.user_p = self.create_user('P@org.org')
        Employment.objects.create(
            user=self.user_p, organisation=implementing_partner, group=self.users, is_approved=True
        )
        Employment.objects.create(
            user=self.user_m, organisation=implementing_partner, group=self.admins, is_approved=True
        )
        restrict_projects(self.user_m, self.user_p, [self.projects['X']])

        # When
        self.projects['W'] = project = Project.objects.create(title='W')
        # FIXME: Ideally, this call should be automatic, but is manual now.
        Project.new_project_created(project.id, self.user_n)
        Partnership.objects.create(
            organisation=implementing_partner,
            project=project,
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )

        # Then
        self.assertFalse(self.org_b.enable_restrictions)
        self.assertTrue(implementing_partner.enable_restrictions)
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['X']))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['Y']))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['Z']))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', project))

    def test_new_projects_are_accessible_in_unrestricted_content_owner_orgs(self):
        r"""
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B - -Project W- - Org C
            /      \      /    \          _____/  |
           /        \    /      \        /        |
        Project X   Project Y   Project Z         |
            |                                     |
            +-------------------------------------+
            |                                     |
        Project U --------------------------------+

        """
        # Given
        self.org_b.enable_restrictions = False
        self.org_b.save()
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
        )
        Partnership.objects.create(
            organisation=org_content_owned,
            project=self.projects['X'],
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
        restrict_projects(self.user_m, self.user_p, [self.projects['X']])

        # When
        self.projects['W'] = project = Project.objects.create(title='W')
        # FIXME: Ideally, this call should be automatic, but is manual now.
        Project.new_project_created(project.id, self.user_n)
        Partnership.objects.create(
            organisation=org_content_owned,
            project=project,
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )

        self.projects['U'] = project = Project.objects.create(title='U')
        # FIXME: Ideally, this call should be automatic, but is manual now.
        Project.new_project_created(project.id, self.user_m)
        Partnership.objects.create(
            organisation=org_content_owned,
            project=project,
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
        )

        # Then
        self.assertFalse(self.org_b.enable_restrictions)
        self.assertTrue(self.org_a.enable_restrictions)
        self.assertTrue(org_content_owned.enable_restrictions)
        self.assertTrue(self.user_p.has_perm('rsr.view_project', self.projects['Z']))
        self.assertTrue(self.user_p.has_perm('rsr.view_project', self.projects['W']))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['Y']))
        self.assertFalse(self.user_p.has_perm('rsr.view_project', self.projects['U']))

    # Add an employment

    def test_adding_employment_gives_access_to_new_org_projects(self):
        r"""
        User M      User N      User O
        Admin       Admin       User
           \        /   \      /
            \      /     \    /
              Org A       Org B                Org C
            /      \      /    \                 /\
           /        \    /      \               /  \
        Project X   Project Y   Project Z      /  Project W
                        |                     /
                        +---------------------
        """
        org_c = Organisation.objects.create(name='C', long_name='C', can_create_projects=True)
        Partnership.objects.create(
            organisation=org_c,
            project=self.projects['Y'],
            iati_organisation_role=Partnership.IATI_FUNDING_PARTNER
        )
        project_w = Project.objects.create(title='W')
        Partnership.objects.create(
            organisation=org_c,
            project=project_w,
            iati_organisation_role=Partnership.IATI_FUNDING_PARTNER
        )
        restrict_projects(self.user_n, self.user_o, [self.projects['Y']])

        # When
        Employment.objects.create(
            user=self.user_o, organisation=org_c, group=self.users, is_approved=True
        )

        # Then
        self.assertTrue(self.user_o.has_perm('rsr.view_project', project_w))
        self.assertFalse(self.user_o.has_perm('rsr.view_project', self.projects['Y']))

    # Remove a partner

    def test_removing_partner_does_not_restore_access(self):
        r"""
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
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
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
        r"""
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
        r"""
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

    # Toggling Enable restrictions

    def test_disable_restrictions_if_no_restricted_users(self):
        # Given
        self.assertTrue(self.org_b.enable_restrictions)

        # When
        self.org_b.enable_restrictions = False
        self.org_b.save()

        # Then
        self.assertFalse(self.org_b.enable_restrictions)

    def test_should_not_disable_restrictions_when_restricted_users(self):
        # Given
        self.assertTrue(self.org_b.enable_restrictions)
        restrict_projects(self.user_n, self.user_o, [self.projects['Z']])

        # When/Then
        self.org_b.enable_restrictions = False
        with self.assertRaises(CannotDisableRestrictions):
            self.org_b.save()

        # Then
        org_b = Organisation.objects.get(pk=self.org_b.pk)
        self.assertTrue(org_b.enable_restrictions)

    def test_should_not_disable_restrictions_when_restricted_content_owned_users(self):
        r"""
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B                 Org C
            /      \      /    \          _____/
           /        \    /      \        /
        Project X   Project Y   Project Z
        """
        # Given
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
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
        restrict_projects(self.user_n, self.user_p, [self.projects['Z']])

        # When
        self.org_b.enable_restrictions = False
        with self.assertRaises(CannotDisableRestrictions):
            self.org_b.save()

    def test_can_disable_when_is_restricted_turned_off(self):
        r"""
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B                 Org C
            /      \      /    \          _____/
           /        \    /      \        /
        Project X   Project Y   Project Z
        """
        # Given
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
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
        restrict_projects(self.user_n, self.user_p, [self.projects['Z']])
        self.org_b.enable_restrictions = False
        with self.assertRaises(CannotDisableRestrictions):
            self.org_b.save()

        # When
        from akvo.rsr.models import UserProjects
        user_projects = UserProjects.objects.get(user=self.user_p)
        user_projects.is_restricted = False
        user_projects.save()

        # Then
        self.org_b.enable_restrictions = False
        self.org_b.save()
        self.assertFalse(self.org_b.enable_restrictions)

    def test_cannot_disable_restrictions_when_any_restricted_users_exist(self):
        r"""
        User M      User N      User O         User P
        Admin       Admin       User              |
           \        /   \      /                  |
            \      /     \    /                   |
              Org A       Org B                 Org C
            /      \      /    \          _____/  |
           /        \    /      \        /        |
        Project X   Project Y   Project Z         |
                        |                         |
                        +-------------------------+
        """
        # Given
        org_content_owned = Organisation.objects.create(
            name='C', long_name='C', can_create_projects=False, enable_restrictions=True
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
        with self.assertRaises(CannotDisableRestrictions):
            self.org_b.enable_restrictions = False
            self.org_b.save()
        with self.assertRaises(CannotDisableRestrictions):
            self.org_a.enable_restrictions = False
            self.org_a.save()


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
