# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.tests.base import BaseTestCase


class ProjectCustomFieldTestCase(BaseTestCase):

    def setUp(self):
        super(ProjectCustomFieldTestCase, self).setUp()
        self.org = self.create_organisation('Org')
        self.project = self.create_project('Project')
        self.email = self.password = 'foo@example.com'
        self.user = self.create_user(self.email, self.password, is_superuser=True)
        self.c.login(username=self.email, password=self.password)

    def test_should_create_project_custom_field(self):
        # Given
        url = '/rest/v1/project_custom_field/?format=json'
        data = {
            'project': self.project.id, 'section': 2, 'order': 1, 'type': u'text',
            'name': 'wow factor'}

        # When
        response = self.c.post(url, data)

        # Then
        self.assertEqual(response.status_code, 201)
        for key in data:
            self.assertEqual(data[key], response.data[key], '{} has diefferent values'.format(key))
