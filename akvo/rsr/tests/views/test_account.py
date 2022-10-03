# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""


import json

from django.conf import settings
from django.contrib.auth.models import Group
from django.core import mail
from django.test import TestCase, Client
from django.utils.html import escape

from akvo.rsr.forms import PASSWORD_MINIMUM_LENGTH, REQUIRED_SYMBOLS
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
        super().tearDown()
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
        str_content = response.content.decode('utf-8')
        self.assertIn('The password must contain at least one symbol:', str_content)
        self.assertIn(escape(REQUIRED_SYMBOLS), str_content)

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
        self.assertEqual(response.headers.get("location"), '/en/')


class PasswordResetTestCase(BaseTestCase):
    """Test password reset workflows."""

    email = 'foo@example.com'
    password = 'passwdpasswdA1$'

    def test_normal_user_gets_password_reset_email(self):
        user = self.create_user(self.email, self.password)
        self.assertTrue(user.has_usable_password())
        data = {'email': self.email}

        response = self.c.post('/en/sign_in/', data=data, follow=True)

        self.assertEqual(200, response.status_code)
        self.assertEqual(1, len(mail.outbox))

    def test_newly_registered_user_gets_reset_email(self):
        register_data = dict(
            first_name=self.email,
            last_name=self.email,
            email=self.email,
            password1=self.password,
            password2=self.password,
        )
        self.c.post('/en/register/', data=register_data, follow=True)
        mail.outbox = []

        data = {'email': self.email}
        response = self.c.post('/en/sign_in/', data=data, follow=True)

        self.assertEqual(200, response.status_code)
        self.assertEqual(1, len(mail.outbox))

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
        mail.outbox = []

        data = {'email': self.email}
        response = self.c.post('/en/sign_in/', data=data, follow=True)

        self.assertEqual(200, response.status_code)
        self.assertEqual(1, len(mail.outbox))

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

        response = self.c.post('/en/sign_in/', data=data, follow=True)

        self.assertEqual(200, response.status_code)
        self.assertEqual(0, len(mail.outbox))


class CsrfTokenRequestMixin(object):

    def get_csrf_token(self):
        response = self.c.get('/auth/csrf-token/')
        return response.client.cookies['csrftoken'].value


class JsonAuthLoginTestCase(BaseTestCase, CsrfTokenRequestMixin):

    def test_only_accept_http_post_method(self):
        csrftoken = self.get_csrf_token()
        response = self.c.get('/auth/login/', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(405, response.status_code)

    def test_unregistered_user(self):
        csrftoken = self.get_csrf_token()

        data = {
            'username': 'test@akvo.org',
            'password': 'secret',
        }
        response = self.c.post('/auth/login/', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(400, response.status_code)
        self.assertTrue(response.content.decode('utf-8').find('Please enter a correct username and password') > 0)

    def test_wrong_password(self):
        username, password = 'test@akvo.org', 'secret'
        self.create_user(username, password, is_active=False)
        csrftoken = self.get_csrf_token()

        data = {
            'username': username,
            'password': 'wrongpassword',
        }
        response = self.c.post('/auth/login/', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(400, response.status_code)
        self.assertTrue(response.content.decode('utf-8').find('Please enter a correct username and password') > 0)

    def test_incative_user(self):
        username, password = 'test@akvo.org', 'secret'
        self.create_user(username, password, is_active=False)
        csrftoken = self.get_csrf_token()

        data = {
            'username': username,
            'password': password,
        }
        response = self.c.post('/auth/login/', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(400, response.status_code)
        self.assertTrue(response.content.decode('utf-8').find('This account is inactive') > 0)

    def test_valid_json_data(self):
        username, password = 'test@akvo.org', 'secret'
        user = self.create_user(username, password)
        csrftoken = self.get_csrf_token()

        data = {
            'username': username,
            'password': password,
        }
        response = self.c.post('/auth/login/', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(200, response.status_code)
        self.assertEqual(user.id, int(response.client.session['_auth_user_id']))

    def test_valid_form_data(self):
        username, password = 'test@akvo.org', 'secret'
        user = self.create_user(username, password)
        csrftoken = self.get_csrf_token()

        data = {
            'username': username,
            'password': password,
        }
        response = self.c.post('/auth/login/', data, HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(200, response.status_code)
        self.assertEqual(user.id, int(response.client.session['_auth_user_id']))


class JsonAuthPasswordResetTestCase(BaseTestCase, CsrfTokenRequestMixin):

    def test_only_accept_http_post_method(self):
        csrftoken = self.get_csrf_token()
        response = self.c.get('/auth/reset-password/', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(405, response.status_code)

    def test_invalid_email(self):
        csrftoken = self.get_csrf_token()

        data = {
            'email': 'invalid.email.format'
        }
        response = self.c.post('/auth/reset-password/', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(400, response.status_code)
        self.assertTrue(response.content.decode('utf-8').find('Enter a valid email address') > 0)

    def test_valid_user_email(self):
        email, password = 'test@akvo.org', 'secret'
        self.create_user(email, password)
        csrftoken = self.get_csrf_token()
        data = {'email': email}

        response = self.c.post('/auth/reset-password/', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(200, response.status_code)
        self.assertEqual(1, len(mail.outbox))


class JsonAuthRegisterTestCase(BaseTestCase, CsrfTokenRequestMixin):

    def test_only_accept_http_post_method(self):
        csrftoken = self.get_csrf_token()
        response = self.c.get('/auth/register/', content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(405, response.status_code)

    def test_invalid_email(self):
        csrftoken = self.get_csrf_token()

        data = {
            'email': 'user.example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password1': 'passwdpasswdA1$',
            'password2': 'passwdpasswdA1$',
        }
        response = self.c.post('/auth/register/', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(400, response.status_code)
        self.assertTrue(response.content.decode('utf-8').find('Enter a valid email address') > 0)

    def test_invalid_password(self):
        csrftoken = self.get_csrf_token()

        data = {
            'email': 'user@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password1': 'passwdpasswdA1$',
            'password2': 'passwdpasswdA2$',
        }
        response = self.c.post('/auth/register/', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(400, response.status_code)
        self.assertTrue(response.content.decode('utf-8').find('Passwords do not match') > 0)

    def test_valid_json_data(self):
        csrftoken = self.get_csrf_token()

        data = {
            'email': 'user@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password1': 'passwdpasswdA1$',
            'password2': 'passwdpasswdA1$',
        }

        response = self.c.post('/auth/register/', json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(201, response.status_code)
        self.assertEqual(1, User.objects.filter(email=data['email']).count())
        self.assertEqual(1, len(mail.outbox))
