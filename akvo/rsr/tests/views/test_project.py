# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from __future__ import print_function

from unittest import skip

import django_perf_rec
from django.test import TestCase

from akvo.rsr.models import Organisation, Partnership, Project, ProjectUpdate
from akvo.rsr.tests.base import BaseTestCase


@skip('Needs Django >= 1.8')
class ProjectPerfomanceTestCase(TestCase):
    """Test performance of project views."""

    def setUp(self):
        return

    def test_project_directory_listing(self):
        with django_perf_rec.record():
            self.client.get('/en/projects/', follow=True)


class SetProjectUpdate(BaseTestCase):
    """Test creating and editing updates."""

    def setUp(self):
        super(SetProjectUpdate, self).setUp()
        self.user = self.create_user('user@example.org', 'password')
        self.admin = self.create_user('admin@example.org', 'password')
        self.project_editor = self.create_user('project-editor@example.org', 'password')
        self.org = Organisation.objects.create(name='Name', long_name='Long Name')
        self.make_org_admin(self.admin, self.org)
        self.make_org_project_editor(self.project_editor, self.org)
        self.make_employment(self.user, self.org, 'Users')
        self.project = Project.objects.create(title='Project')
        Partnership.objects.create(project=self.project, organisation=self.org)

    def test_admin_can_edit_user_project_update(self):
        # Given
        update = ProjectUpdate.objects.create(project=self.project, user=self.user)
        url = '/en/project/{}/update/{}/edit/'.format(self.project.id, update.id)
        data = {
            'title': 'Awesome New Title',
            'language': update.language,
            'latitude': '0',
            'longitude': '0',
            'event_date': '2017-11-21'
        }

        # When
        self.c.login(username=self.admin.email, password='password')
        response = self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        update = ProjectUpdate.objects.get(id=update.id)
        self.assertEqual(update.title, data['title'])
        self.assertEqual(update.event_date.strftime('%Y-%m-%d'), data['event_date'])

    def test_project_editor_cannot_edit_user_project_update(self):
        # Given
        update = ProjectUpdate.objects.create(project=self.project, user=self.user)
        url = '/en/project/{}/update/{}/edit/'.format(self.project.id, update.id)
        data = {
            'title': 'Awesome New Title (Project Editor)',
            'language': update.language,
            'latitude': '0',
            'longitude': '0',
            'event_date': '2017-11-21'
        }

        # When/Then
        self.c.login(username=self.project_editor.email, password='password')
        response = self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(response.status_code, 403)
