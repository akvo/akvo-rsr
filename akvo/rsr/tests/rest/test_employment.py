# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from akvo.rsr.tests.base import BaseTestCase


class RestEmploymentTestCase(BaseTestCase):
    """Tests the Employment REST endpoints."""

    def setUp(self):
        super(RestEmploymentTestCase, self).setUp()
        self.user = self.create_user("user@akvo.org", "password", is_superuser=True)
        self.c.login(username=self.user.username, password="password")

    def test_delete_employment(self):
        # Given
        org = self.create_organisation('Organisation')
        user = self.create_user('foo@example.com')
        employment = self.make_employment(user, org, 'Users')

        # When
        response = self.c.delete('/rest/v1/employment/{}/?format=json'.format(employment.id))

        # Then
        self.assertEqual(response.status_code, 204)

    def test_should_list_organisation_user_roles(self):
        # Given
        org = self.create_organisation('Org')
        user1 = self.create_user('foo@example.com')
        user2 = self.create_user('bar@example.com')
        self.make_employment(user1, org, 'Users')
        self.make_employment(user1, org, 'Admins')
        self.make_employment(user2, org, 'M&E Managers')

        # When
        response = self.c.get('/rest/v1/organisations/{}/users/?format=json'.format(org.id))

        # Then
        data = response.data
        self.assertEqual(2, len(data))
        for employment in data:
            if employment['email'] == user1.email:
                self.assertEqual(set(employment['role']), {'Users', 'Admins'})
            elif employment['email'] == user2.email:
                self.assertEqual(set(employment['role']), {'M&E Managers'})
