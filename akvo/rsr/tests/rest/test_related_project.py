# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import RelatedProject


class RelatedProjectTestCase(BaseTestCase):

    def setUp(self):
        super(RelatedProjectTestCase, self).setUp()
        self.project = self.create_project('Project')
        self.email = 'foo@bar.com'
        user = self.create_user(self.email, self.email)
        org = self.create_organisation('Bar.com')
        self.make_employment(user, org, 'Admins')
        self.make_partner(self.project, org)
        self.c.login(username=self.email, password=self.email)

    def test_get_related_project(self):
        # Given
        project = self.create_project('Project 2')
        RelatedProject.objects.create(project=self.project, related_project=project)

        url = '/rest/v1/related_project/?format=json&project={}'.format(self.project.id)

        # When
        response = self.c.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['project'], self.project.id)
        self.assertEqual(response.data['results'][0]['related_project'], project.id)
        self.assertEqual(response.data['results'][0]['related_iati_id'], '')

    def test_get_related_iati_id(self):
        # Given
        iati_id = 'DUMMY_IATI_ID'
        RelatedProject.objects.create(project=self.project, related_iati_id=iati_id)

        url = '/rest/v1/related_project/?format=json&project={}'.format(self.project.id)

        # When
        response = self.c.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['project'], self.project.id)
        self.assertIsNone(response.data['results'][0]['related_project'])
        self.assertEqual(response.data['results'][0]['related_iati_id'], iati_id)

    def test_post_related_project(self):
        # Given
        project = self.create_project('Project 2')
        data = {
            'project': self.project.id,
            'related_project': project.id
        }
        url = '/rest/v1/related_project/?format=json'

        # When
        response = self.c.post(url, data=data)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['project'], self.project.id)
        self.assertEqual(response.data['related_project'], project.id)
        self.assertEqual(response.data['related_iati_id'], '')

    def test_post_related_iati_id(self):
        # Given
        iati_id = 'DUMMY_IATI_ID'
        data = {
            'project': self.project.id,
            'related_iati_id': iati_id,
        }
        url = '/rest/v1/related_project/?format=json'

        # When
        response = self.c.post(url, data=data)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['project'], self.project.id)
        self.assertIsNone(response.data['related_project'])
        self.assertEqual(response.data['related_iati_id'], iati_id)
