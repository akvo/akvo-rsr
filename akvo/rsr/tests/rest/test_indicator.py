# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.rsr.models import Partnership, Result, Indicator, IndicatorPeriod
from akvo.rsr.tests.base import BaseTestCase


class RestIndicatorTestCase(BaseTestCase):
    """Tests the indicator REST endpoints."""

    def setUp(self):
        """ Setup a minimal DB for the tests. """

        super(RestIndicatorTestCase, self).setUp()

        self.project = self.create_project("REST test project")
        self.reporting_org = self.create_organisation("Test REST reporting")
        self.make_partner(self.project, self.reporting_org, Partnership.IATI_REPORTING_ORGANISATION)

        self.user = self.create_user(
            "user.rest@test.akvo.org", "password", is_admin=True, is_superuser=True)
        self.employment = self.make_employment(self.user, self.reporting_org, 'Users')

    def test_rest_indicator_pagination(self):
        """Test that paginating the indicator results works."""

        # Given
        n_results = 5
        n_indicators = 5
        n_periods = 6
        total = n_results * n_indicators * n_periods
        for _ in range(n_results):
            result = Result.objects.create(project=self.project)
            for _ in range(n_indicators):
                indicator = Indicator.objects.create(result=result)
                for _ in range(n_periods):
                    IndicatorPeriod.objects.create(indicator=indicator)

        self.c.login(username=self.user.username, password="password")

        indicator_periods = self.get_indicator_periods(self.project.id)
        self.assertEqual(len(indicator_periods), total)
        for indicator_id in Indicator.objects.values_list('id', flat=True):
            periods = filter(lambda x: x['indicator'] == indicator_id, indicator_periods)
            self.assertEqual(len(periods), n_periods)

    def test_indicator_framework(self):
        # Given
        result = Result.objects.create(project=self.project)
        indicator = Indicator.objects.create(result=result)
        IndicatorPeriod.objects.create(indicator=indicator)
        child_project = self.create_project('Child Project')
        self.make_parent(self.project, child_project)
        child_project.import_results()
        self.c.login(username=self.user.username, password="password")
        url = '/rest/v1/indicator_framework/?format=json'

        # When
        response = self.c.get(url)

        # Then
        self.assertEqual(response.data['count'], 2)
        indicators = set(
            [indicator.id] + list(indicator.child_indicators.values_list('id', flat=True))
        )
        self.assertEqual(indicators, {indicator['id'] for indicator in response.data['results']})

    def get_indicator_periods(self, project_id):
        periods = []
        next_url = '/rest/v1/indicator_period/?format=json&indicator__result__project={}&limit=50'.format(project_id)
        while next_url:
            response = self.c.get(next_url)
            data = json.loads(response.content)
            periods += data['results']
            next_url = data['next']
        return periods
