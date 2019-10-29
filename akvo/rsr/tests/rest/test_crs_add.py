# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import CrsAdd
from akvo.rsr.tests.base import BaseTestCase


class CrsAddViewSetTestCase(BaseTestCase):

    def setUp(self):
        super(CrsAddViewSetTestCase, self).setUp()
        email = password = 'foo@example.com'
        self.user = self.create_user(email, password, is_superuser=True)
        self.c.login(username=email, password=password)

    def test_get(self):
        # Given
        project = self.create_project('Test Project')
        crs_add = CrsAdd.objects.create(project=project, loan_terms_rate1=5)
        url = '/rest/v1/crs_add/{}?format=json'.format(crs_add.pk)

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['project'], project.pk)
        self.assertEqual(float(response.data['loan_terms_rate1']), crs_add.loan_terms_rate1)

    def test_post(self):
        # Given
        project = self.create_project('Test Project')
        url = '/rest/v1/crs_add/?format=json'
        data = {'project': project.id}

        # When
        response = self.c.post(url, data=data)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['project'], project.pk)
