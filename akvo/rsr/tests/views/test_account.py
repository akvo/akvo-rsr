# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from __future__ import print_function

import json
try:
    from urllib.parse import urlparse
except ImportError:
    from urlparse import urlparse

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client
from mock import patch

from akvo.rsr.forms import PASSWORD_MINIMUM_LENGTH
from akvo.rsr.models import Employment, Organisation, Partnership, Project, User
from akvo.utils import check_auth_groups
from akvo.rsr.tests.base import BaseTestCase


class AccountTestCase(TestCase):
    """Test account views."""

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        self.admin_group = Group.objects.get(name='Admins')
        self.user_group = Group.objects.get(name='Users')
        self.username = 'user@example.com'
        self.password = 'password1A$'
        self.title = 'Admiral'
        self.first_name = 'John'
        self.last_name = 'Doe'
        self.org1 = Organisation.objects.create(name='akvo', long_name='akvo foundation')
        self.org2 = Organisation.objects.create(name='icco', long_name='icco foundation')
        for org in (self.org1, self.org2):
            project = Project.objects.create()
            project.publish()
            Partnership.objects.create(project=project, organisation=org)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def tearDown(self):
        Group.objects.all().delete()
        Organisation.objects.all().delete()
        Project.objects.all().delete()
        User.objects.all().delete()

    def test_api_key_for_plain_user(self):
        # Given
        user = self._create_user(self.username, self.password, is_admin=False)
        Employment.objects.create(user=user, organisation=self.org1, group=self.user_group, is_approved=True)
        data = {
            'username': self.username,
            'password': self.password,
        }

        # When
        response = self.c.post('/auth/token/?format=json', data=data)

        # Then
        self.assertEqual(response.status_code, 200)
        edit_projects = json.loads(response.content)['allow_edit_projects']
        self.assertEqual([], edit_projects)

    def test_api_key_for_admin_group_user(self):
        # Given
        user = self._create_user(self.username, self.password, is_admin=False)
        Employment.objects.create(
            user=user, organisation=self.org1, group=self.admin_group, is_approved=True
        )
        data = {
            'username': self.username,
            'password': self.password,
        }

        # When
        response = self.c.post('/auth/token/?format=json', data=data)

        # Then
        self.assertEqual(response.status_code, 200)
        edit_projects = json.loads(response.content)['allow_edit_projects']
        self.assertEqual(
            set(self.org1.projects.published().values_list('id', flat=True)),
            set(edit_projects)
        )

    def test_api_key_for_rsr_admin_user(self):
        # Given
        user = self._create_user(self.username, self.password, is_admin=True)
        Employment.objects.create(
            user=user, organisation=self.org1, group=self.admin_group, is_approved=True
        )
        data = {
            'username': self.username,
            'password': self.password,
        }

        # When
        response = self.c.post('/auth/token/?format=json', data=data)

        # Then
        self.assertEqual(response.status_code, 200)
        edit_projects = json.loads(response.content)['allow_edit_projects']
        self.assertEqual(
            set(self.org1.projects.published().values_list('id', flat=True)),
            set(edit_projects)
        )

    def test_api_key_for_rsr_admin_all_orgs_user(self):
        # Given
        user = self._create_user(self.username, self.password, is_admin=True)
        for org in (self.org1, self.org2):
            Employment.objects.create(
                user=user, organisation=org, group=self.admin_group, is_approved=True
            )
        data = {
            'username': self.username,
            'password': self.password,
        }

        # When
        response = self.c.post('/auth/token/?format=json', data=data)

        # Then
        self.assertEqual(response.status_code, 200)
        edit_projects = json.loads(response.content)['allow_edit_projects']
        self.assertEqual(
            set(Project.objects.filter(publishingstatus__status='published').values_list('id', flat=True)),
            set(edit_projects)
        )

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


class AccountRegistrationTestCase(TestCase):
    """Test account views."""

    def setUp(self):
        self.username = 'user@example.com'
        self.password = 'passwdpasswdA1$'
        self.title = 'Admiral'
        self.first_name = 'John'
        self.last_name = 'Doe'
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def tearDown(self):
        User.objects.all().delete()
        self.data = None

    def _create_registration_data(self, password1, password2=None):
        if password2 is None:
            password2 = password1
        self.data = dict(
            first_name=self.first_name,
            last_name=self.last_name,
            email=self.username,
            password1=password1,
            password2=password2,
        )

    def test_registration_without_honeypot_filled_in(self):
        # Given
        self._create_registration_data(self.password)

        # When
        response = self.c.post('/en/register/', data=self.data)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertIn('confirmation will be sent to you via email', response.content.decode())

    def test_registration_password_too_short(self):
        # Given
        self._create_registration_data('passwdpassw')

        # When
        response = self.c.post('/en/register/', data=self.data)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.decode('utf-8').find(
            'Passwords must be at least {} characters long.'.format(PASSWORD_MINIMUM_LENGTH)) > 0)

    def test_registration_password_has_no_digit(self):
        # Given
        self._create_registration_data('passwdpasswdA$')

        # When
        response = self.c.post('/en/register/', data=self.data)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.decode('utf-8').find(
            'The password must contain at least one digit, 0-9.') > 0)

    def test_registration_password_has_no_symbol(self):
        # Given
        self._create_registration_data('passwdpasswdA1')

        # When
        response = self.c.post('/en/register/', data=self.data)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.decode('utf-8').find(
            'The password must contain at least one symbol: '
            '()[]{}|\\`~!@#$%%^&amp;*_-+=;:&#39;&quot;,&lt;&gt;./?') > 0
        )

    def test_registration_password_has_no_uppercase(self):
        # Given
        self._create_registration_data('passwdpasswd1$')

        # When
        response = self.c.post('/en/register/', data=self.data)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.decode('utf-8').find(
            'The password must contain at least one uppercase letter, A-Z.') > 0)

    def test_registration_password_has_no_lowercase(self):
        # Given
        self._create_registration_data('PASSWDPASSWD1$')

        # When
        response = self.c.post('/en/register/', data=self.data)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.decode('utf-8').find(
            'The password must contain at least one lowercase letter, a-z.') > 0)

    def test_registration_with_honeypot_filled_in(self):
        # Given
        data = dict(
            first_name=self.first_name,
            last_name=self.last_name,
            hp_title=self.title,
            email=self.username,
            password1=self.password,
            password2=self.password,
        )

        # When
        response = self.c.post('/en/register/', data=data)

        # Then
        self.assertEqual(response.status_code, 302)
        self.assertEqual(urlparse(response._headers['location'][1]).path, '/en/')


class PasswordResetTestCase(BaseTestCase):
    """Test password reset workflows."""

    email = 'foo@example.com'
    password = 'passwdpasswdA1$'

    def test_normal_user_gets_password_reset_email(self):
        user = self.create_user(self.email, self.password)
        self.assertTrue(user.has_usable_password())
        data = {'email': self.email}

        with patch('django.contrib.auth.forms.PasswordResetForm.send_mail') as patched_send:
            response = self.c.post('/en/sign_in/', data=data, follow=True)

        self.assertEqual(200, response.status_code)
        patched_send.assert_called_once()

    def test_newly_registered_user_gets_reset_email(self):
        register_data = dict(
            first_name=self.email,
            last_name=self.email,
            email=self.email,
            password1=self.password,
            password2=self.password,
        )
        response = self.c.post('/en/register/', data=register_data, follow=True)
        data = {'email': self.email}

        with patch('django.contrib.auth.forms.PasswordResetForm.send_mail') as patched_send:
            response = self.c.post('/en/sign_in/', data=data, follow=True)

        self.assertEqual(200, response.status_code)
        patched_send.assert_called_once()

    def test_invited_user_gets_reset_email(self):
        admin_email = 'admin@example.com'
        self.create_user(email=admin_email, password=self.password, is_superuser=True)
        user_group = Group.objects.get(name='Users')
        org = self.create_organisation('Akvo')
        self.c.login(username=admin_email, password=self.password)
        # Create dummy users along with one user to reset password for
        for i in range(5):
            email = self.email if i == 0 else (str(i) + self.email)
            invite_data = dict(
                user_data=json.dumps(dict(
                    email=email,
                    organisation=org.id,
                    group=user_group.id,
                ))
            )
            response = self.c.post('/rest/v1/invite_user/', data=invite_data, follow=True)
        data = {'email': self.email}

        with patch('django.contrib.auth.forms.PasswordResetForm.send_mail') as patched_send:
            response = self.c.post('/en/sign_in/', data=data, follow=True)

        self.assertEqual(200, response.status_code)
        patched_send.assert_called_once()

    def test_deactivated_users_donot_get_password_reset_email(self):
        email = 'foo@example.com'
        password = 'password'
        user = self.create_user(email, password)
        data = {'email': email}

        self.c.login(username=email, password=password)
        # Verify user has logged in at least once!
        user.refresh_from_db()
        self.assertNotEqual(user.last_login, user.date_joined)
        user.is_active = False
        user.save(update_fields=['is_active'])
        with patch('django.contrib.auth.forms.PasswordResetForm.send_mail') as patched_send:
            response = self.c.post('/en/sign_in/', data=data, follow=True)

        self.assertEqual(200, response.status_code)
        patched_send.assert_not_called()
