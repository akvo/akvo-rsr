# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from akvo.rsr.models import DefaultPeriod
from akvo.rsr.tests.base import BaseTestCase


class DefaultPeriodTestCase(BaseTestCase):
    """Test the default period REST endpoint."""

    def setUp(self):
        super(DefaultPeriodTestCase, self).setUp()
        user = self.create_user("user@akvo.org", "password", is_admin=True)
        self.c.login(username=user.username, password="password")

    def test_project_default_period_post(self):
        project = self.create_project("Test project")
        DefaultPeriod.objects.create(
            project=project, period_start="2018-01-01", period_end="2018-12-31")
        response = self.c.post("/rest/v1/project/{}/default_periods/?format=json".format(project.pk),
                               data=json.dumps({"periods": [{'period_start': "2018-01-01",
                                                             'period_end': "2018-12-31"},
                                                            {'period_start': "2019-01-01",
                                                             'period_end': "2019-12-31"}],
                                                "project": project.id}),
                               content_type="application/json")

        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertNotIn({'period_start': '2017-01-01', 'period_end': '2017-12-31'}, data['periods'])
        self.assertIn({'period_start': '2018-01-01', 'period_end': '2018-12-31'}, data['periods'])
        self.assertIn({'period_start': '2019-01-01', 'period_end': '2019-12-31'}, data['periods'])
        self.assertEqual(data['project'], str(project.pk))

    def test_default_period_post(self):
        project = self.create_project("Test project")
        response = self.c.post("/rest/v1/default_period/?format=json",
                               data=json.dumps({"period_start": "2018-01-01",
                                                "period_end": "2018-12-31",
                                                "project": project.id}),
                               content_type="application/json")

        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertEqual(data['period_start'], '2018-01-01')
        self.assertEqual(data['period_end'], '2018-12-31')
        self.assertEqual(data['project'], project.pk)
        self.assertEqual(data['parent'], None)

    def test_default_period_get(self):
        project = self.create_project("Test project")
        DefaultPeriod.objects.create(
            project=project, period_start='2018-01-01', period_end='2018-12-31')

        response = self.c.get("/rest/v1/default_period/?format=json&project={}".format(project.pk))

        self.assertEqual(response.status_code, 200)
        data = response.data['results'][0]
        self.assertEqual(data['period_start'], '2018-01-01')
        self.assertEqual(data['period_end'], '2018-12-31')
        self.assertEqual(data['project'], project.pk)
        self.assertEqual(data['parent'], None)
