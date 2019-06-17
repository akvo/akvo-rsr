# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo import settings
from akvo.rsr.models import Organisation
from akvo.rsr.tests.base import BaseTestCase
from akvo.utils import check_auth_groups


class UserModelTestCase(BaseTestCase):

    def create_employments(self):
        """
        User M       User N      User O
           \        /   \        /
            \      /     \      /
             Admins       Users
            /      \     /   \
           /        \   /     \
        Org X      Org Y     Org Z
        """

        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        self.user_m = self.create_user('M@org.org')
        self.user_n = self.create_user('N@org.org')
        self.user_o = self.create_user('O@org.org')

        self.org_x = self.create_organisation('X')
        self.org_y = self.create_organisation('Y')
        self.org_z = self.create_organisation('Z')

        self.admin_m_org_x = self.make_employment(self.user_m, self.org_x, group_name='Admins')
        self.admin_m_org_y = self.make_employment(self.user_m, self.org_y, group_name='Admins')

        self.admin_n_org_x = self.make_employment(self.user_n, self.org_x, group_name='Admins')
        self.admin_n_org_y = self.make_employment(self.user_n, self.org_y, group_name='Admins')
        self.user_n_org_y = self.make_employment(self.user_n, self.org_y, group_name='Users')
        self.user_n_org_z = self.make_employment(self.user_n, self.org_z, group_name='Users')

        self.user_o_org_z = self.make_employment(self.user_o, self.org_z, group_name='Users')

    def test_get_admin_employment_orgs(self):
        self.create_employments()
        orgs_x_y = list(Organisation.objects.filter(pk__in=[self.org_x.pk, self.org_y.pk]))
        self.assertListEqual(list(self.user_m.get_admin_employment_orgs()), orgs_x_y)
        self.assertListEqual(list(self.user_n.get_admin_employment_orgs()), orgs_x_y)
        self.assertListEqual(list(self.user_o.get_admin_employment_orgs()), [])

    def test_get_non_admin_employment_orgs(self):
        self.create_employments()
        self.assertListEqual(list(self.user_m.get_non_admin_employment_orgs()), [])
        self.assertListEqual(list(self.user_n.get_non_admin_employment_orgs()), [self.org_z])
        self.assertListEqual(list(self.user_o.get_non_admin_employment_orgs()), [self.org_z])
