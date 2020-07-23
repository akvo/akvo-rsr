# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""


from django.contrib.auth.models import Group

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import Employment, Organisation, User
from akvo.rsr.views.my_rsr import manageable_objects


class MyRSRTestCase(BaseTestCase):
    """Test my_rsr views."""

    def setUp(self):
        super().setUp()
        self.password = 'password'
        self.user1 = self.create_user('user1@example.com', self.password, is_admin=True)
        self.user2 = self.create_user('user2@example.com', self.password, is_admin=True)
        self.user3 = self.create_user('user3@example.com', self.password)
        self.org = Organisation.objects.create(name='akvo', long_name='akvo foundation')
        self.c.login(username=self.user1.username, password=self.password)
        self.admin_group = Group.objects.get(name='Admins')
        self.user_group = Group.objects.get(name='Users')

    def tearDown(self):
        Employment.objects.all().delete()
        User.objects.all().delete()

    def test_manageable_objects_employments_is_admin_can_manage_all(self):
        # Given a user that is_admin
        # When employments for two different organisations exist
        other_org = Organisation.objects.create(name='Other org', long_name='Other org')
        Employment.objects.create(user=self.user1, organisation=self.org, group=self.admin_group)
        Employment.objects.create(user=self.user2, organisation=self.org, group=self.user_group)
        Employment.objects.create(user=self.user3, organisation=other_org, group=self.user_group)

        # Then the is_admin user can manage all employments
        manageables = manageable_objects(self.user1)
        self.assertEqual(len(manageables['employments']), 3)
        self.assertTrue(manageables['employments'][0] in Employment.objects.all())
        self.assertTrue(manageables['employments'][1] in Employment.objects.all())
        self.assertTrue(manageables['employments'][2] in Employment.objects.all())

    def test_manageable_objects_employments_org_admin_can_manage_own(self):
        # Given a user that is "org admin", i.e. part of the 'Admins' group
        Employment.objects.create(user=self.user3, organisation=self.org, group=self.admin_group, is_approved=True)

        # When employments for two different organisations exist
        user4 = self.create_user('user4@example.com', self.password)
        user5 = self.create_user('user5@example.com', self.password)
        user6 = self.create_user('user6@example.com', self.password)
        other_org = Organisation.objects.create(name='Other org', long_name='Other org')
        Employment.objects.create(user=user4, organisation=self.org, group=self.user_group, is_approved=True)
        Employment.objects.create(user=user5, organisation=self.org, group=self.user_group)
        Employment.objects.create(user=user6, organisation=other_org, group=self.user_group)

        # Then the "Admins" user can only manage employments of the same organisation
        manageables = manageable_objects(self.user3)
        self.assertEqual(len(manageables['employments']), 3)
        self.assertTrue(manageables['employments'][0] in Employment.objects.filter(organisation=self.org))
        self.assertTrue(manageables['employments'][1] in Employment.objects.filter(organisation=self.org))
        self.assertTrue(manageables['employments'][2] in Employment.objects.filter(organisation=self.org))

    def test_manageable_objects_orgs_is_admin_can_manage_all(self):
        Organisation.objects.create(name='Other org', long_name='Other org')
        manageables = manageable_objects(self.user1)
        self.assertEqual(len(manageables['organisations']), 2)
        self.assertTrue(manageables['organisations'][0] in Organisation.objects.all())
        self.assertTrue(manageables['organisations'][1] in Organisation.objects.all())

    def test_manageable_objects_orgs_org_admin_can_manage_own(self):
        Employment.objects.create(user=self.user3, organisation=self.org, group=self.admin_group, is_approved=True)
        Organisation.objects.create(name='Other org', long_name='Other org')
        manageables = manageable_objects(self.user3)
        self.assertEqual(len(manageables['organisations']), 1)
        self.assertEqual(manageables['organisations'][0], Organisation.objects.get(name='akvo'))
