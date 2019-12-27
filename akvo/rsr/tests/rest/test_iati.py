# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Partnership
from akvo.rsr.tests.base import BaseTestCase


class IatiTestCase(BaseTestCase):

    def setUp(self):
        super(IatiTestCase, self).setUp()
        email = password = 'foo@example.com'
        self.user = self.create_user(email, password, is_superuser=True)
        self.c.login(username=email, password=password)
        self.project = self.create_project('Test Project')
        self.org = self.create_organisation('Org')
        self.make_partner(self.project, self.org, Partnership.IATI_REPORTING_ORGANISATION)

    def test_iati_export(self):
        url = '/rest/v1/iati_export/?format=json'
        data = {
            "reporting_organisation": self.org.id,
            "user": self.user.id,
            "version": "2",
            "projects": [self.project.id]
        }

        response = self.c.post(url, data)

        self.assertEqual(response.status_code, 201)
        for key in data:
            self.assertEqual(data[key], response.data[key])
