# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.rsr.models import Project, User, ProjectUpdate

from django.conf import settings
from django.test import TestCase, Client


class RestProjectUpdateTestCase(TestCase):
    """Tests the project update REST endpoints."""

    def setUp(self):
        """
        For all tests, we at least need two projects and an update in the database. And a client.
        """

        # Create projects
        Project.objects.create(
            title="REST test project",
        )
        self.project = Project.objects.create(
            title="REST test project 2",
        )

        # Create active (super)user
        self.user = User.objects.create_superuser(
            username="Super user REST",
            email="superuser.rest@test.akvo.org",
            password="password",
        )
        self.user.is_active = True
        self.user.save()

        # Create update
        ProjectUpdate.objects.create(
            project=self.project,
            user=self.user,
            title="Update title",
        )

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_rest_project_update_project_filter(self):
        """
        Checks the REST project update endpoint with a project filter.
        """
        response = self.c.get('/rest/v1/project_update/', {'format': 'json', 'project__gte': 1})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 1)

        response = self.c.get('/rest/v1/project_update/',
                                  {'format': 'json', 'project__title__exact': 'REST test project'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 0)

        response = self.c.get('/rest/v1/project_update/',
                              {'format': 'json', 'project__partners': 1})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 0)

    def test_rest_project_update_title_filter(self):
        """
        Checks the REST project update endpoint with a title filter.
        """
        response = self.c.get('/rest/v1/project_update/', {'format': 'json',
                                                           'title__exact': 'Update title'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 1)

    def test_rest_post_project_update(self):
        """
        Checks the REST project update endpoint POST functions.
        """
        response = self.c.post('/rest/v1/project_update/',
                               {
                                   'project': self.project.pk,
                                   'user': self.user.pk,
                                   'title': 'Not allowed'
                               })
        self.assertEqual(response.status_code, 403)

        self.c.login(username=self.user.username, password='password')
        response = self.c.post('/rest/v1/project_update/',
                               {
                                   'project': self.project.pk,
                                   'user': self.user.pk,
                                   'title': 'Allowed'
                               })
        self.assertEqual(response.status_code, 201)
