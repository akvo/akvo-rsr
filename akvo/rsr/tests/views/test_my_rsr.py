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

from akvo.rsr.models import Employment, Organisation, Project, User
from akvo.utils import check_auth_groups


class MyRSRTestCase(TestCase):
    """Test my_rsr views."""

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.password = 'password'
        self.user1 = self._create_user('user1@example.com', self.password, is_admin=True)
        self.user2 = self._create_user('user2@example.com', self.password, is_admin=True)
        self.org = Organisation.objects.create(name='akvo', long_name='akvo foundation')
        self.c.login(username=self.user1.username, password=self.password)
        self.admin_group = Group.objects.get(name='Admins')
        self.user_group = Group.objects.get(name='Users')

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
