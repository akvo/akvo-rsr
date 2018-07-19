# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from __future__ import print_function

import json

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client
from lxml import html

from akvo.rsr.models import Employment, Organisation, Project, User, Partnership, UserProjects
from akvo.rsr.views.my_rsr import manageable_objects
from akvo.utils import check_auth_groups


class MyRSRTestCase(TestCase):
    """Test my_rsr views."""

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.password = 'password'
        self.user1 = self._create_user('user1@example.com', self.password, is_admin=True)
        self.user2 = self._create_user('user2@example.com', self.password, is_admin=True)
        self.user3 = self._create_user('user3@example.com', self.password)
        self.org = Organisation.objects.create(name='akvo', long_name='akvo foundation')
        self.c.login(username=self.user1.username, password=self.password)
        self.admin_group = Group.objects.get(name='Admins')
        self.user_group = Group.objects.get(name='Users')

    def tearDown(self):
        Employment.objects.all().delete()
        User.objects.all().delete()

    def test_user_management_employments_ordering(self):
        # Given
        Employment.objects.create(user=self.user1, organisation=self.org, group=self.user_group)
        Employment.objects.create(user=self.user2, organisation=self.org, group=self.user_group)
        Employment.objects.create(user=self.user1, organisation=self.org, group=self.admin_group)
        Employment.objects.create(user=self.user2, organisation=self.org, group=self.admin_group)

        # When
        response = self.c.get('/myrsr/user_management', follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        doc = html.fromstring(response.content)
        script = doc.get_element_by_id('initial-employment-data')
        employments = json.loads(script.text)
        self.assertEqual(4, len(employments))
        self.assertEqual([(e['user']['id'], e['group']['name']) for e in employments],
                         [(self.user2.id, u'Admins'),
                          (self.user2.id, u'Users'),
                          (self.user1.id, u'Admins'),
                          (self.user1.id, u'Users')])

    def test_search_with_long_query_strings_works(self):
        """Test that search works with long query strings.

        *NOTE*: This test was written to ensure that the search works correctly
        when refactoring the code to make searches with long query strings
        faster.  The test doesn't actually test that the new code is faster and
        doesn't timeout, because there's no good way to do this (especially on
        a small test database). If ever we start using something like
        django_perf_rec, this may be feasible to test.

        """
        # Given
        title = 'This is a super long project title that will be used as a search query'
        Project.objects.create(title=title)
        url = '/myrsr/projects?q={}'.format(title.replace(' ', '+'))

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(200, response.status_code)
        self.assertIn(title, response.content)

    def test_search_filters_projects(self):
        # Given
        title = 'Project Title'
        query = 'search query'
        Project.objects.create(title=title)
        url = '/myrsr/projects?q={}'.format(query.replace(' ', '+'))

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(200, response.status_code)
        self.assertNotIn(title, response.content)

    def _create_user(self, email, password, is_active=True, is_admin=False):
        """Create a user with the given email and password."""

        user = User.objects.create(
            email=email,
            username=email,
            is_active=is_active,
            is_admin=is_admin
        )
        user.set_password(password)
        user.save()

        return user

    def test_projects_access_restrictions(self):
        # Given an org with two projects
        project1 = Project.objects.create(title='Project 1')
        project1.publish()
        project2 = Project.objects.create(title='Project 2')
        project2.publish()
        Partnership.objects.create(organisation=self.org, project=project1)
        Partnership.objects.create(organisation=self.org, project=project2)
        Employment.objects.create(
            user=self.user3, organisation=self.org, group=self.user_group, is_approved=True
        )

        # When project1 is added to user1's project white list
        white_list = UserProjects.objects.create(user=self.user3, is_restricted=True,)
        white_list.projects.add(project1)

        # Then user1's project list should include only project1
        self.c.login(username=self.user3.username, password=self.password)
        url = '/myrsr/projects'
        response = self.c.get(url, follow=True)
        from BeautifulSoup import BeautifulSoup
        soup = BeautifulSoup(response.content)

        self.assertEqual(len(soup.findAll('table')), 1)
        # There should be two table rows: one header and one for project1
        self.assertEqual(len(soup.findAll('table')[0].findChildren('tr')), 2)

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
        user4 = self._create_user('user4@example.com', self.password)
        user5 = self._create_user('user5@example.com', self.password)
        user6 = self._create_user('user6@example.com', self.password)
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
