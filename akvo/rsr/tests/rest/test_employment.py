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

    def test_add_employment(self):
        # Logged in as superuser
        # Given
        org = self.create_organisation('Org')
        email = 'foo@bar.test.com'
        data = {
            'name': 'Foo Bar',
            'email': email,
            'role': ['Users', 'Admins']
        }

        # When
        response = self.c.post(
            '/rest/v1/organisations/{}/users/?format=json'.format(org.id),
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(201, response.status_code)
        self.assertEqual(set(data['role']), set(response.data['role']))
        self.assertEqual(data['email'], response.data['email'])

        # Not logged in user
        # When
        self.c.logout()
        response = self.c.post(
            '/rest/v1/organisations/{}/users/?format=json'.format(org.id),
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(403, response.status_code)

        # Logged in as non-org admin user
        # Given
        user = self.create_user("non-admin-user@akvo.org", "password")
        self.c.login(username=user.username, password="password")
        self.make_employment(user, org, 'M&E Managers')

        # When
        response = self.c.post(
            '/rest/v1/organisations/{}/users/?format=json'.format(org.id),
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(403, response.status_code)

    def test_change_user_roles(self):
        # Given
        org = self.create_organisation('Org')
        user = self.create_user('foo@example.com')
        self.make_employment(user, org, 'Users')
        self.make_employment(user, org, 'Admins')
        url = '/rest/v1/organisations/{}/users/{}/?format=json'.format(org.id, user.id)
        data = {
            'role': ['M&E Managers']
        }

        # When
        response = self.c.patch(url, json.dumps(data), content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual(['M&E Managers'], response.data['role'])

    def test_delete_user_roles(self):
        # Given
        org = self.create_organisation('Org')
        user = self.create_user('foo@example.com')
        self.make_employment(user, org, 'Users')
        self.make_employment(user, org, 'Project Editors')
        url = '/rest/v1/organisations/{}/users/{}/?format=json'.format(org.id, user.id)

        # When
        response = self.c.delete(url)

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual([], response.data['role'])
