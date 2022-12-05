# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from datetime import date
from akvo.rsr.models import (
    Partnership, Result, Indicator, IndicatorPeriod, IndicatorDimensionName,
    OrganisationIndicatorLabel, IndicatorReference, IndicatorPeriodData,
    IndicatorDimensionValue)
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder


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
            periods = [x for x in indicator_periods if x['indicator'] == indicator_id]
            self.assertEqual(len(periods), n_periods)

    def test_get_project_related_objects(self):
        # Given
        pk = self.project.id
        self.c.login(username=self.user.username, password="password")
        result = Result.objects.create(project=self.project)

        indicator = Indicator.objects.create(result=result)
        url = '/rest/v1/indicator/?format=json&result__project={}'.format(pk)
        response = self.c.get(url)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], indicator.pk)

        reference = IndicatorReference.objects.create(indicator=indicator)
        url = '/rest/v1/indicator_reference/?format=json&indicator__result__project={}'.format(pk)
        response = self.c.get(url)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], reference.pk)

        period = IndicatorPeriod.objects.create(indicator=indicator)
        url = '/rest/v1/indicator_period/?format=json&indicator__result__project={}'.format(pk)
        response = self.c.get(url)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], period.pk)

        data = IndicatorPeriodData.objects.create(period=period, user=self.user)
        url = (
            '/rest/v1/indicator_period_data_framework/?format=json&'
            'period__indicator__result__project={}'.format(pk))
        response = self.c.get(url)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], data.pk)

    def test_indicator_framework(self):
        # Given
        result = Result.objects.create(project=self.project)
        indicator = Indicator.objects.create(result=result)
        IndicatorPeriod.objects.create(indicator=indicator)
        dimension = IndicatorDimensionName.objects.create(project=self.project, name='Age')
        indicator.dimension_names.add(dimension)
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
        dimension_names = response.data['results'][0]['dimension_names']
        self.assertEqual(len(dimension_names), 1)
        self.assertEqual(dimension_names[0]['id'], dimension.id)

    def test_indicator_framework_post(self):
        # Given
        result = Result.objects.create(project=self.project)
        data = {"type": 1, "measure": "1", "periods": [], "dimension_names": [], "result": result.id}
        self.c.login(username=self.user.username, password="password")
        url = '/rest/v1/indicator_framework/?format=json'
        content_type = 'application/json'

        # When
        response = self.c.post(url, data=json.dumps(data), content_type=content_type)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['result'], result.id)
        self.assertEqual(response.data['measure'], '1')
        self.assertEqual(response.data['type'], 1)

    def test_indicator_framework_dimension_names_get(self):
        # Given
        result = Result.objects.create(project=self.project)
        indicator = Indicator.objects.create(result=result)
        IndicatorPeriod.objects.create(indicator=indicator)
        dimension = IndicatorDimensionName.objects.create(project=self.project, name='Age')
        indicator.dimension_names.add(dimension)
        self.c.login(username=self.user.username, password="password")
        url = '/rest/v1/indicator/{}/?format=json'.format(indicator.id)

        # When
        response = self.c.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertIn(dimension.id, response.data['dimension_names'])

    def test_indicator_framework_dimension_names_patch(self):
        # Given
        result = Result.objects.create(project=self.project)
        indicator = Indicator.objects.create(result=result)
        IndicatorPeriod.objects.create(indicator=indicator)
        dimension_age = IndicatorDimensionName.objects.create(project=self.project, name='Age')
        dimension_gender = IndicatorDimensionName.objects.create(project=self.project, name='Gender')
        indicator.dimension_names.add(dimension_age)
        self.c.login(username=self.user.username, password="password")
        url = '/rest/v1/indicator/{}/?format=json'.format(indicator.id)
        content_type = 'application/json'
        response = self.c.get(url)
        self.assertIn(dimension_age.id, response.data['dimension_names'])
        data = {'dimension_names': [dimension_gender.id]}

        # When
        response = self.c.patch(url, data=json.dumps(data), content_type=content_type)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['dimension_names'], response.data['dimension_names'])

    def test_indicator_framework_dimension_names_empty_patch(self):
        # Given
        result = Result.objects.create(project=self.project)
        indicator = Indicator.objects.create(result=result)
        IndicatorPeriod.objects.create(indicator=indicator)
        dimension = IndicatorDimensionName.objects.create(project=self.project, name='Age')
        indicator.dimension_names.add(dimension)
        self.c.login(username=self.user.username, password="password")
        url = '/rest/v1/indicator/{}/?format=json'.format(indicator.id)
        content_type = 'application/json'
        response = self.c.get(url)
        self.assertIn(dimension.id, response.data['dimension_names'])
        data = {'dimension_names': []}

        # When
        response = self.c.patch(url, data=json.dumps(data), content_type=content_type)

        # Then
        self.assertEqual(data['dimension_names'], response.data['dimension_names'])

    def test_indicator_labels_patch(self):
        # Given
        org_label = OrganisationIndicatorLabel.objects.create(
            organisation=self.reporting_org, label='Label')
        result = Result.objects.create(project=self.project)
        indicator = Indicator.objects.create(result=result)
        self.c.login(username=self.user.username, password="password")
        url = '/rest/v1/indicator_framework/{}/?format=json'.format(indicator.id)
        content_type = 'application/json'
        response = self.c.get(url)
        data = {'labels': [org_label.id]}

        # When
        response = self.c.patch(url, data=json.dumps(data), content_type=content_type)

        # Then
        self.assertEqual(data['labels'], response.data['labels'])

        # ### Verify Get
        # When
        response = self.c.get(url)

        # Then
        self.assertEqual(data['labels'], response.data['labels'])

        # ### Verify GET on results_framework_lite
        # Given
        rf_url = '/rest/v1/results_framework_lite/{}/?format=json'.format(result.id)

        # When
        response = self.c.get(rf_url)

        # Then
        self.assertEqual(data['labels'], response.data['indicators'][0]['labels'])

        # ### Removing labels
        data = {'labels': []}

        # When
        response = self.c.patch(url, data=json.dumps(data), content_type=content_type)

        # Then
        self.assertEqual(data['labels'], response.data['labels'])

    def test_indicator_target_create(self):
        # Given
        result = Result.objects.create(project=self.project)
        indicator = Indicator.objects.create(result=result)
        gender = IndicatorDimensionName.objects.create(project=self.project, name='Gender')
        male = IndicatorDimensionValue.objects.create(name=gender, value='Male')
        female = IndicatorDimensionValue.objects.create(name=gender, value='Female')
        url = '/rest/v1/indicator_framework/{}/?format=json'.format(indicator.id)
        data = {
            'target_value': 24,
            'disaggregation_targets': [
                {'dimension_value': male.id, 'value': 10},
                {'dimension_value': female.id, 'value': 14},
            ]
        }

        self.c.login(username=self.user.username, password="password")
        response = self.c.patch(url, data=json.dumps(data), content_type='application/json')

        response = self.c.get(url)
        self.assertEqual(response.data['target_value'], data['target_value'])
        disaggregation_targets = response.data['disaggregation_targets']
        self.assertEqual(len(disaggregation_targets), len(data['disaggregation_targets']))
        for actual_target in disaggregation_targets:
            for expected_target in data['disaggregation_targets']:
                if actual_target['dimension_value'] == expected_target['dimension_value']:
                    self.assertEqual(expected_target['value'], actual_target['value'])

    def test_indicator_target_decimal_with_comma(self):
        # Given
        result = Result.objects.create(project=self.project)
        indicator = Indicator.objects.create(result=result)
        gender = IndicatorDimensionName.objects.create(project=self.project, name='Gender')
        male = IndicatorDimensionValue.objects.create(name=gender, value='Male')
        url = '/rest/v1/indicator_framework/{}/?format=json'.format(indicator.id)
        data = {
            'target_value': '24,5',
            'disaggregation_targets': [
                {'dimension_value': male.id, 'value': '10,5'},
            ]
        }

        self.c.login(username=self.user.username, password="password")
        response = self.c.patch(url, data=json.dumps(data), content_type='application/json')

        response = self.c.get(url)
        self.assertEqual(response.data['target_value'], 24.5)
        disaggregation_target = response.data['disaggregation_targets'][0]['value']
        self.assertEqual(disaggregation_target, 10.5)

    def test_indicator_target_update(self):
        # Given
        result = Result.objects.create(project=self.project)
        indicator = Indicator.objects.create(result=result)
        gender = IndicatorDimensionName.objects.create(project=self.project, name='Gender')
        male = IndicatorDimensionValue.objects.create(name=gender, value='Male')
        female = IndicatorDimensionValue.objects.create(name=gender, value='Female')
        url = '/rest/v1/indicator_framework/{}/?format=json'.format(indicator.id)
        data = {
            'target_value': 24,
            'disaggregation_targets': [
                {'dimension_value': male.id, 'value': 10},
                {'dimension_value': female.id, 'value': 14},
            ]
        }

        self.c.login(username=self.user.username, password="password")
        response = self.c.patch(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = self.c.get(url)
        disaggregation_targets = response.data['disaggregation_targets']
        self.assertEqual(len(disaggregation_targets), len(data['disaggregation_targets']))
        for actual_target in disaggregation_targets:
            for expected_target in data['disaggregation_targets']:
                if actual_target['dimension_value'] == expected_target['dimension_value']:
                    self.assertEqual(expected_target['value'], actual_target['value'])

    def get_indicator_periods(self, project_id):
        periods = []
        next_url = '/rest/v1/indicator_period/?format=json&indicator__result__project={}&limit=50'.format(project_id)
        while next_url:
            response = self.c.get(next_url)
            data = json.loads(response.content)
            periods += data['results']
            next_url = data['next']
        return periods


class IndicatorCumulativeSwithingTestCase(BaseTestCase):
    INDICATOR_1 = "Indicator #1"
    INDICATOR_2 = "Indicator #2"
    CONTRIBUTOR_1 = "Contributor #1"

    def setUp(self):
        super().setUp()
        user = self.create_user("test1@akvo.org", "password", is_admin=True)
        self.project = (
            ProjectFixtureBuilder()
            .with_results(
                [
                    {
                        "title": "Result #1",
                        "indicators": [
                            {
                                "title": self.INDICATOR_1,
                                "periods": [{"period_start": date(2020, 1, 1), "period_end": date(2020, 12, 31)}]
                            },
                            {
                                "title": self.INDICATOR_2,
                                "periods": [{"period_start": date(2020, 1, 1), "period_end": date(2020, 12, 31)}]
                            },
                        ]
                    }
                ]
            )
            .with_contributors([{"title": self.CONTRIBUTOR_1}])
            .build()
        )
        self.indicator1 = self.project.indicators.get(title=self.INDICATOR_1)
        self.indicator2 = self.project.indicators.get(title=self.INDICATOR_2)
        contributor = self.project.get_contributor(title=self.CONTRIBUTOR_1)
        contributor.get_period(indicator__title=self.INDICATOR_1).add_update(user=user)
        self.c.login(username=user.email, password='password')

    def test_contribution_count(self):
        """Check if indicator has any updates"""
        result = self.c.get(
            f'/rest/v1/project/{self.project.object.id}/indicator/{self.indicator1.id}/contribution_count?format=json',
            content_type='application/json'
        )
        self.assertEqual({"count": 1}, result.data)

    def test_patch_cumulative_switch(self):
        """Switch to cumulative reporting on indicator with no updates should be allowed"""
        url = f'/rest/v1/indicator_framework/{self.indicator2.id}/?format=json'
        data = {'cumulative': True}
        response = self.c.patch(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(200, response.status_code)
        self.indicator2.refresh_from_db()
        self.assertTrue(self.indicator2.cumulative)

    def test_patch_blocked_cumulative_switch(self):
        """Switch to cumulative reporting on indicator that already have updates should not be allowed"""
        url = f'/rest/v1/indicator_framework/{self.indicator1.id}/?format=json'
        data = {'cumulative': True}
        response = self.c.patch(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(400, response.status_code)
        self.assertTrue("cumulative" in response.data)
