# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase

from akvo.rsr.models import (
    User, Project, Organisation, Employment, Partnership, ProjectUpdate, PartnerSite, IatiExport,
    Result, Indicator, IndicatorPeriod, IndicatorPeriodData, IndicatorPeriodDataComment,
    AdministrativeLocation, ProjectLocation, OrganisationLocation, UserProjects
)
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

