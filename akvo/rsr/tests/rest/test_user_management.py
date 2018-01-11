# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the
# Akvo RSR module. For additional details on the GNU license please see
# <http://www.gnu.org/licenses/agpl.html>.

from __future__ import print_function

import json

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client
from mock import patch

from akvo.rsr.models import Employment, Organisation, User
from akvo.utils import check_auth_groups
from akvo.rest.views import user_management
from akvo.rsr import signals


class UserManagementTestCase(TestCase):
    """Tests REST endpoints in views/user_management.py."""

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.org = Organisation.objects.create(name='akvo', long_name='akvo foundation')
        self.other_org = Organisation.objects.create(name='iati', long_name='iati foundation')
        self.user_password = 'password'
        self.user = self._create_user(
            'abc@example.com', self.user_password, is_admin=True, is_active=True
        )
        self.c.login(username=self.user.username, password=self.user_password)

    @patch.object(user_management, 'rsr_send_mail')
    def test_should_invite_new_user(self, mock_send):
        # Given
        group = Group.objects.get(name='Users')
        email = 'rsr-tests-email@akvo.org'
        user_data = json.dumps({
            'organisation': self.org.id,
            'group': group.id,
            'email': email
        })
        data = {'user_data': user_data}

        # When
        response = self.c.post('/rest/v1/invite_user/?format=json', data)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(mock_send.call_count, 1)
        employment = Employment.objects.get(user__email=email, organisation_id=self.org.id)
        self.assertEqual(employment.group_id, group.id)
        self.assertFalse(employment.is_approved)

    @patch.object(user_management, 'rsr_send_mail')
    def test_should_create_new_employment_for_inactive_user(self, mock_send):
        # Given
        group = Group.objects.get(name='Users')
        email = 'rsr-tests-email@akvo.org'
        user = self._create_user(email=email, password=self.user_password)
        new_group = Group.objects.get(name='Admins')
        Employment.objects.create(user=user, organisation_id=self.org.id, group=group)

        user_data = json.dumps({
            'organisation': self.org.id,
            'group': new_group.id,
            'email': email
        })
        data = {'user_data': user_data}

        # When
        response = self.c.post('/rest/v1/invite_user/?format=json', data)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(mock_send.call_count, 1)
        employments = Employment.objects.filter(user__email=email, organisation_id=self.org.id)
        self.assertEqual(employments.count(), 2)

    @patch.object(signals, 'rsr_send_mail_to_users')
    @patch.object(signals, 'rsr_send_mail')
    def test_should_create_new_employment_for_active_user(self, send_approved, send_approval_request):
        # Given
        group = Group.objects.get(name='Users')
        email = 'rsr-tests-email@akvo.org'
        self._create_user(email=email, password=self.user_password, is_active=True)
        user_data = json.dumps({
            'organisation': self.org.id,
            'group': group.id,
            'email': email
        })
        data = {'user_data': user_data}

        # When
        response = self.c.post('/rest/v1/invite_user/?format=json', data)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(send_approved.call_count, 1)
        self.assertFalse(send_approval_request.called)
        employment = Employment.objects.get(user__email=email, organisation_id=self.org.id)
        self.assertTrue(employment.is_approved)

    @patch.object(signals, 'rsr_send_mail')
    def test_should_approve_existing_employment_for_active_user(self, mock_send):
        # Given
        group = Group.objects.get(name='Users')
        email = 'rsr-tests-email@akvo.org'
        user = self._create_user(email=email, password=self.user_password, is_active=True)
        Employment.objects.create(user=user, organisation=self.org, group=group)

        user_data = json.dumps({
            'organisation': self.org.id,
            'group': group.id,
            'email': email
        })
        data = {'user_data': user_data}

        # When
        response = self.c.post('/rest/v1/invite_user/?format=json', data)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(mock_send.call_count, 1)
        employment = Employment.objects.get(user__email=email, organisation_id=self.org.id)
        self.assertTrue(employment.is_approved)

    def _create_user(self, email, password, is_admin=False, is_active=False):
        """Create a user with the given email and password."""

        user = User.objects.create(
            email=email, username=email, is_active=is_active, is_admin=is_admin
        )
        user.set_password(password)
        user.save()

        return user
