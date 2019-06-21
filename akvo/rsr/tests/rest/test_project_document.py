# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import ProjectDocument, ProjectDocumentCategory


class ProjectDocumentTestCase(BaseTestCase):

    def setUp(self):
        super(ProjectDocumentTestCase, self).setUp()
        self.project = self.create_project('Project')
        self.email = 'foo@bar.com'
        user = self.create_user(self.email, self.email)
        org = self.create_organisation('Bar.com')
        self.make_employment(user, org, 'Admins')
        self.make_partner(self.project, org)
        self.c.login(username=self.email, password=self.email)

    def test_get_project_document_with_categories(self):
        # Given
        document = ProjectDocument.objects.create(project=self.project)
        category = ProjectDocumentCategory.objects.create(document=document, category='A01')

        url = '/rest/v1/project_document/{}/?format=json'.format(document.id)

        # When
        response = self.c.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        categories = response.data['categories']
        self.assertEqual(len(categories), 1)
        self.assertEqual(categories[0], category.category)

    def test_post_project_document_with_categories(self):
        # Given
        categories = ['A01']
        data = {
            'project': self.project.id,
            'categories': categories
        }
        url = '/rest/v1/project_document/?format=json'

        # When
        response = self.c.post(url, data=data)

        # Then
        self.assertEqual(response.status_code, 201)
        response_categories = response.data['categories']
        self.assertEqual(sorted(response_categories), sorted(categories))

    def test_update_project_document_with_categories(self):
        # Given
        categories = ['A01']
        data = {
            'project': self.project.id,
            'categories': categories
        }
        url = '/rest/v1/project_document/?format=json'
        response = self.c.post(url, data=data)

        url = '/rest/v1/project_document/{}/?format=json'.format(response.data['id'])
        updated_data = {'categories': ['A01', 'A02', 'A03']}

        # When
        response = self.c.patch(url,
                                data=json.dumps(updated_data),
                                content_type='application/json')

        # Then
        self.assertEqual(response.status_code, 200)
        response_categories = response.data['categories']
        self.assertEqual(sorted(response_categories), sorted(updated_data['categories']))
