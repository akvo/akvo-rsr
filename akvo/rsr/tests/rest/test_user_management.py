# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the
# Akvo RSR module. For additional details on the GNU license please see
# <http://www.gnu.org/licenses/agpl.html>.


import json

from django.contrib.auth.models import Group
from mock import patch

from akvo.rsr.models import Employment
from akvo.rest.views import user_management
from akvo.rsr import signals
from akvo.rsr.tests.base import BaseTestCase


class UserManagementTestCase(BaseTestCase):
    """Tests REST endpoints in views/user_management.py."""

    def setUp(self):
        super(UserManagementTestCase, self).setUp()
        self.org = self.create_organisation(name='akvo')
        self.other_org = self.create_organisation(name='iati')
        self.username = 'abc@example.com'
        self.password = 'password'
        self.user = self.create_user(self.username, self.password, is_admin=True)
        self.c.login(username=self.username, password=self.password)

    @patch.object(user_management, 'send_user_invitation')
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
        response = self.c.post(
            '/rest/v1/invite_user/?format=json',
            json.dumps(data),
            content_type='application/json',
        )

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(mock_send.call_count, 1)
        employment = Employment.objects.get(user__email=email, organisation_id=self.org.id)
        self.assertEqual(employment.group_id, group.id)
        self.assertFalse(employment.is_approved)

    @patch.object(user_management, 'send_user_invitation')
    def test_should_create_new_employment_for_inactive_user(self, mock_send):
        # Given
        group = Group.objects.get(name='Users')
        email = 'rsr-tests-email@akvo.org'
        user = self.create_user(email=email, password=self.password, is_active=False)
        Employment.objects.create(user=user, organisation_id=self.org.id, group=group)

        # When
        new_group = Group.objects.get(name='Admins')
        user_data = json.dumps({
            'organisation': self.org.id,
            'group': new_group.id,
            'email': email
        })
        data = {'user_data': user_data}
        response = self.c.post(
            '/rest/v1/invite_user/?format=json',
            json.dumps(data),
            content_type='application/json',
        )

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
        self.create_user(email=email, password=self.password, is_active=True)
        user_data = json.dumps({
            'organisation': self.org.id,
            'group': group.id,
            'email': email
        })
        data = {'user_data': user_data}

        # When
        response = self.c.post(
            '/rest/v1/invite_user/?format=json',
            json.dumps(data),
            content_type='application/json',
        )

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
        user = self.create_user(email=email, password=self.password, is_active=True)
        Employment.objects.create(user=user, organisation=self.org, group=group)

        user_data = json.dumps({
            'organisation': self.org.id,
            'group': group.id,
            'email': email
        })
        data = {'user_data': user_data}

        # When
        response = self.c.post(
            '/rest/v1/invite_user/?format=json',
            json.dumps(data),
            content_type='application/json',
        )

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(mock_send.call_count, 1)
        employment = Employment.objects.get(user__email=email, organisation_id=self.org.id)
        self.assertTrue(employment.is_approved)

    def test_should_approve_new_employment(self):
        # Given
        user = self.create_user('foo@bar.com', self.password)
        employment = self.make_employment(user, self.org, 'Users')
        employment.is_approved = False
        employment.save(update_fields=['is_approved'])
        url = '/rest/v1/employment/{}/approve/?format=json'.format(employment.id)

        # When
        response = self.c.post(url)

        # Then
        self.assertEqual(response.status_code, 200)
        employment.refresh_from_db()
        self.assertTrue(employment.is_approved)

    def test_should_set_employment_group(self):
        # Given
        user = self.create_user('foo@bar.com', self.password)
        employment = self.make_employment(user, self.org, 'Users')
        admins = Group.objects.get(name='Admins')
        url = '/rest/v1/employment/{}/set_group/{}/?format=json'.format(employment.id, admins.id)

        # When
        response = self.c.post(url)

        # Then
        self.assertEqual(response.status_code, 200)
        employment.refresh_from_db()
        self.assertEqual(admins.name, employment.group.name)
