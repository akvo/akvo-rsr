# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""


import json

from django.conf import settings
from django.test import TransactionTestCase, Client

from akvo.codelists.models import Country, Version
from akvo.rsr.forms import PASSWORD_MINIMUM_LENGTH
from akvo.rsr.models import Organisation, ProjectHierarchy, User
from akvo.utils import check_auth_groups
from akvo.rsr.tests.base import BaseTestCase


# NOTE: Since these tests actually trigger some integrity errors and we want to
# see if they are handled correctly, we use a TransactionTestCase instead of
# TestCase, since wrapping the tests in a transaction isn't desirable.

class UserTestCase(TransactionTestCase):
    """Tests REST endpoints in views/user.py."""

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.org = Organisation.objects.create(name='akvo', long_name='akvo foundation')
        self.user_password = 'password'
        self.user = self._create_user('abc@example.com', self.user_password)
        self.c.login(username=self.user.username, password=self.user_password)

        version = Version.objects.create(code=settings.IATI_VERSION)
        self.country = Country.objects.create(
            code='CI',
            name='CI - C\xc3\xb4te Divoire',
            version=version
        )

    def test_request_to_list_user_are_forbidden(self):
        response = self.c.get('/rest/v1/user/?format=json')
        self.assertEqual(response.status_code, 403)

    def test_unauthenticated_request_for_user_detail_should_be_forbidden(self):
        self.c.logout()
        response = self.c.get('/rest/v1/user/{}/?format=json'.format(self.user.id))
        self.assertEqual(response.status_code, 403)

    def test_authenticated_request_for_user_detail(self):
        response = self.c.get('/rest/v1/user/{}/?format=json'.format(self.user.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.id, response.data['id'])
        self.assertEqual(self.user.email, response.data['email'])

    def test_change_user_details(self):
        # Given
        pk = self.user.id
        data = {'first_name': 'Angela', 'last_name': 'K'}

        # When
        response = self.c.post(
            '/rest/v1/user/{}/update_details/?format=json'.format(pk),
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(data['first_name'], self.user.first_name)
        self.assertEqual(data['last_name'], self.user.last_name)

    def test_change_password(self):
        # Given
        pk = self.user.id
        data = {
            'new_password1': 'my-@wesome-N3W-password',
            'new_password2': 'my-@wesome-N3W-password',
            'old_password': 'password'
        }

        # When
        response = self.c.post(
            '/rest/v1/user/{}/change_password/?format=json'.format(pk),
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertFalse(self.user.check_password(data['old_password']))
        self.assertTrue(self.user.check_password(data['new_password1']))

    def test_change_password_non_matching_passwords(self):
        # Given
        pk = self.user.id
        data = {
            'new_password1': 'passwdpasswd',
            'new_password2': 'passwdpassw',
            'old_password': 'password'
        }

        # When
        response = self.c.post(
            '/rest/v1/user/{}/change_password/?format=json'.format(pk),
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.content.decode('utf-8').find('Passwords do not match.') > 0)

    def test_change_password_too_short_password(self):
        # Given
        pk = self.user.id
        data = {
            'new_password1': 'passwdpassw',
            'new_password2': 'passwdpassw',
            'old_password': 'password'
        }

        # When
        response = self.c.post(
            '/rest/v1/user/{}/change_password/?format=json'.format(pk),
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.content.decode('utf-8').find(
            'Passwords must be at least {} characters long.'.format(PASSWORD_MINIMUM_LENGTH)) > 0)

    def test_change_password_no_digit_in_password(self):
        # Given
        pk = self.user.id
        data = {
            'new_password1': 'passwdpasswdA$',
            'new_password2': 'passwdpasswdA$',
            'old_password': 'password'
        }
        # When
        response = self.c.post(
            '/rest/v1/user/{}/change_password/?format=json'.format(pk),
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.content.decode('utf-8').find(
            'The password must contain at least one digit, 0-9.') > 0)

    def test_change_password_no_symbol_in_password(self):
        # Given
        pk = self.user.id
        data = {
            'new_password1': 'passwdpasswdA1',
            'new_password2': 'passwdpasswdA1',
            'old_password': 'password'
        }
        # When
        response = self.c.post(
            '/rest/v1/user/{}/change_password/?format=json'.format(pk),
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.content.decode('utf-8').find(
            'The password must contain at least one symbol:') > 0)

    def _create_user(self, email, password, is_active=True):
        """Create a user with the given email and password."""

        user = User.objects.create(email=email, username=email, is_active=is_active)
        user.set_password(password)
        user.save()

        return user


class CurrentUserTestCase(BaseTestCase):
    """Tests REST endpoint to get current logged in user data."""

    def test_unauthenticated_request_should_be_forbidden(self):
        response = self.c.get('/rest/v1/me/?format=json')
        self.assertEqual(response.status_code, 403)

    def test_should_return_current_logged_in_user_data(self):
        email = 'test@example.org'
        password = 'passwd'
        user = self.create_user(email, password)
        project = self.create_project('Test Program')
        org = self.create_organisation('Org')
        self.make_employment(user, org, 'Users')
        ProjectHierarchy.objects.create(root_project=project, organisation=org, max_depth=2)
        self.c.login(username=email, password=password)

        response = self.c.get('/rest/v1/me/?format=json')

        content = response.data
        self.assertEqual(content['email'], email)
        self.assertEqual(content['programs'],
                         [{'id': project.pk, 'name': project.title,
                           'can_edit_program': False, 'can_create_projects': False,
                           'project_count': 0}])

    def test_user_with_no_programs(self):
        email = 'test@example.org'
        password = 'passwd'
        user = self.create_user(email, password)
        org = self.create_organisation('Org')
        self.make_employment(user, org, 'Users')
        self.c.login(username=email, password=password)

        response = self.c.get('/rest/v1/me/?format=json')

        content = response.data
        self.assertEqual(content['email'], email)
        self.assertEqual(content['programs'], [])
