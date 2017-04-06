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
from urlparse import urlparse

from akvo.rsr.models import Employment, Organisation, Partnership, Project, User
from akvo.utils import check_auth_groups


class AccountTestCase(TestCase):
    """Test account views."""

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        self.admin_group = Group.objects.get(name='Admins')
        self.user_group = Group.objects.get(name='Users')
        self.username = 'user@example.com'
        self.password = 'password'
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

    def test_registration_without_honeypot_filled_in(self):
        # Given
        data = dict(
            first_name=self.first_name,
            last_name=self.last_name,
            email=self.username,
            password1=self.password,
            password2=self.password,
        )

        # When
        response = self.c.post('/en/register/', data=data)

        # Then
        self.assertEqual(response.status_code, 200)

    def test_registration_with_honeypot_filled_in(self):
        # Given
        data = dict(
            hp_title=self.title,
            first_name=self.first_name,
            last_name=self.last_name,
            email=self.username,
            password1=self.password,
            password2=self.password,
        )

        # When
        response = self.c.post('/en/register/', data=data)

        # Then
        self.assertEqual(response.status_code, 302)
        self.assertEqual(urlparse(response._headers['location'][1]).path, '/en/')

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
