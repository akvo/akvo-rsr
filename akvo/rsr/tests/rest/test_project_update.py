# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import base64
import json
import tempfile

from akvo.rsr.models import Project, User, ProjectUpdate

from django.conf import settings
from django.test import TestCase, Client

# Data for a WMF image file
WMF_DATA = (
    '\xd7\xcd\xc6\x9a\x00\x00\x00\x00\x00\x00\xd4\x00\xd4\x00\xb0\x04\x00\x00\x00\x00\xa1S\x01\x00\t\x00\x00\x03'
    'p\x00\x00\x00\x03\x00\x14\x00\x00\x00\x00\x00\x05\x00\x00\x00\x0c\x02\xd4\x00\xd4\x00\x05\x00\x00\x00\x0b\x02'
    '\x00\x00\x00\x00\x04\x00\x00\x00\x03\x01\x08\x00\x05\x00\x00\x00\x02\x01\x01\x00\x00\x00\x05\x00\x00\x00\x06\x01'
    '\x02\x00\x00\x00\x05\x00\x00\x00.\x01\x18\x00\x00\x00\x05\x00\x00\x00\t\x02\x00\x00\x00\x00\x05\x00\x00\x00'
    '\x04\x01\r\x00\x00\x00\x07\x00\x00\x00&\x06\x17\x00\x04\x00\x05\x00\x00\x00\x08\x00\x00\x00\xfa\x02\x00\x00'
    '\x01\x00\x00\x00\x00\x00\x00\x00\x08\x00\x00\x00\xfa\x02\x05\x00\x01\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00'
    '-\x01\x01\x00\x07\x00\x00\x00\xfc\x02\x01\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00-\x01\x02\x00\x04\x00'
    '\x00\x00\xf0\x01\x02\x00\x04\x00\x00\x00\xf0\x01\x01\x00\x04\x00\x00\x00\xf0\x01\x00\x00\x03\x00\x00\x00\x00\x00'
)


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

    def test_rest_post_project_update_photo_none(self):
        """
        Checks posting a project update with photo being None
        """

        self.c.login(username=self.user.username, password='password')
        response = self.c.post('/rest/v1/project_update/?format=json',
                               json.dumps({
                                   'project': self.project.pk,
                                   'user': self.user.pk,
                                   'title': 'Allowed',
                                   'photo': None,
                               }),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_rest_post_project_update_wmf_string(self):
        """
        Checks posting a project update with a WMF photo base64 encoded.
        """

        self.c.login(username=self.user.username, password='password')
        response = self.c.post('/rest/v1/project_update/?format=json',
                               {
                                   'project': self.project.pk,
                                   'user': self.user.pk,
                                   'title': 'Allowed',
                                   'photo': base64.standard_b64encode(WMF_DATA)
                               })
        self.assertEqual(response.status_code, 400)

    def test_rest_post_project_update_wmf_file(self):
        """
        Checks posting a project update with a WMF photo base64 encoded.
        """

        with tempfile.NamedTemporaryFile(suffix='.wmf') as f:
            f.write(WMF_DATA)
            f.flush()

            self.c.login(username=self.user.username, password='password')
            response = self.c.post('/rest/v1/project_update/?format=json',
                                   {
                                       'project': self.project.pk,
                                       'user': self.user.pk,
                                       'title': 'Allowed',
                                       'photo': open(f.name)
                                   })
            self.assertEqual(response.status_code, 400)
            self.assertIn('photo', json.loads(response.content))
