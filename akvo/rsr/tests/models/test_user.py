# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from akvo import settings
from akvo.rsr.models import Organisation, Employment
from akvo.rsr.tests.base import BaseTestCase
from akvo.utils import check_auth_groups

User = get_user_model()


def _create_organisation(name, long_name=None, can_create_projects=True):
    if long_name is None:
        long_name = name
    return Organisation.objects.create(
        name=name, long_name=long_name, can_create_projects=can_create_projects
    )


def _create_employment(user, organisation, group='Users', is_approved=True):
    group = Group.objects.get(name=group)
    return Employment.objects.create(
        user=user, organisation=organisation, group=group, is_approved=is_approved,
    )


class UserModelTestCase(BaseTestCase):
    """"""

    def setUp(self):
        """
        User M       User N      User O
           \        /   \        /
            \      /     \      /
             Admins       Users
            /      \     /   \
           /        \   /     \
        Org X      Org Y     Org Z
        """

        # self.tearDown()
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        self.user_m = self.create_user('M@org.org')
        self.user_n = self.create_user('N@org.org')
        self.user_o = self.create_user('O@org.org')

        self.org_x = _create_organisation('X')
        self.org_y = _create_organisation('Y')
        self.org_z = _create_organisation('Z')

        self.admin_m_org_x = _create_employment(self.user_m, self.org_x, group='Admins')
        self.admin_m_org_y = _create_employment(self.user_m, self.org_y, group='Admins')

        self.admin_n_org_x = _create_employment(self.user_n, self.org_x, group='Admins')
        self.admin_n_org_y = _create_employment(self.user_n, self.org_y, group='Admins')
        self.user_n_org_y = _create_employment(self.user_n, self.org_y, group='Users')
        self.user_n_org_z = _create_employment(self.user_n, self.org_z, group='Users')

        self.user_o_org_z = _create_employment(self.user_o, self.org_z, group='Users')

    def test_get_admin_employment_orgs(self):
        orgs_x_y = list(Organisation.objects.filter(pk__in=[self.org_x.pk, self.org_y.pk]))
        self.assertListEqual(list(self.user_m.get_admin_employment_orgs()), orgs_x_y)
        self.assertListEqual(list(self.user_n.get_admin_employment_orgs()), orgs_x_y)
        self.assertListEqual(list(self.user_o.get_admin_employment_orgs()), [])

    def test_get_non_admin_employment_orgs(self):
        self.assertListEqual(list(self.user_m.get_non_admin_employment_orgs()), [])
        self.assertListEqual(list(self.user_n.get_non_admin_employment_orgs()), [self.org_z])
        self.assertListEqual(list(self.user_o.get_non_admin_employment_orgs()), [self.org_z])
