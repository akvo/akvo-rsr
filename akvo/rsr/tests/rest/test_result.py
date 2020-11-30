# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.codelists.models import ResultType, Version
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.models import Partnership


class RestResultTestCase(BaseTestCase):
    """Test the result REST endpoints."""

    def setUp(self):
        super(RestResultTestCase, self).setUp()
        iati_version, _ = Version.objects.get_or_create(code='2.02')
        ResultType.objects.get_or_create(code="1", name="Output", version=iati_version)

    def test_result_post(self):
        user = self.create_user("user@akvo.org", "password", is_admin=True)
        project = self.create_project("Test project")
        self.c.login(username=user.username, password="password")

        response = self.c.post("/rest/v1/results_framework/?format=json",
                               data=json.dumps({"type": 1, "project": project.id}),
                               content_type="application/json")

        self.assertEqual(response.status_code, 201)

    def test_project_results_framework_for_enumerator(self):
        org = self.create_organisation('Acme Org')
        email, password = 'foo@acme.org', 'password'
        user = self.create_user(email, password)
        project = ProjectFixtureBuilder()\
            .with_title('Project #1')\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'periods': [
                                {
                                    'period_start': '2010-1-1',
                                    'period_end': '2010-12-31'
                                },
                                {
                                    'period_start': '2011-1-1',
                                    'period_end': '2011-12-31'
                                },
                            ],
                            'enumerators': [user],
                        },
                        {
                            'title': 'Indicator #2',
                            'periods': [
                                {
                                    'period_start': '2010-1-1',
                                    'period_end': '2010-12-31'
                                },
                                {
                                    'period_start': '2011-1-1',
                                    'period_end': '2011-12-31'
                                },
                            ],
                        }
                    ]
                },
            ])\
            .build()

        self.c.login(username=email, password=password)
        response = self.c.get(
            "/rest/v1/project/{}/results_framework/?format=json".format(project.project.id)
        )

        self.assertEqual(response.status_code, 200)
        results = response.data['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(len(results[0]['indicators']), 1)
        indicator = results[0]['indicators'][0]
        self.assertEqual(indicator['title'], 'Indicator #1')

        # Assert M&E manager sees all the results
        self.make_employment(user, org, 'M&E Managers')
        self.c.login(username=email, password=password)
        response = self.c.get(
            "/rest/v1/project/{}/results_framework/?format=json".format(project.project.id)
        )

        self.assertEqual(response.status_code, 200)
        results = response.data['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(len(results[0]['indicators']), 2)
        indicator = results[0]['indicators'][0]
        self.assertEqual({indicator['title'] for indicator in results[0]['indicators']},
                         {'Indicator #1', 'Indicator #2'})
