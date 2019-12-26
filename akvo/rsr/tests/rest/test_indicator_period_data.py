# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.rsr.models import (
    Partnership, Result, Indicator, IndicatorPeriod,
    IndicatorDimensionName, IndicatorDimensionValue,
    IndicatorPeriodData
)
from akvo.rsr.tests.base import BaseTestCase


class IndicatorPeriodDataTestCase(BaseTestCase):
    """Tests the indicator period data REST endpoints."""

    def setUp(self):
        """ Setup a minimal DB for the tests. """
        super(IndicatorPeriodDataTestCase, self).setUp()
        self.project = self.create_project("REST test project")
        self.reporting_org = self.create_organisation("Test REST reporting")
        self.make_partner(self.project, self.reporting_org, Partnership.IATI_REPORTING_ORGANISATION)

        # Create active user
        self.username = "username"
        self.password = "password"
        self.username2 = 'username2'
        self.password2 = 'password2'
        self.user = self.create_user(
            self.username, self.password, is_active=True, is_admin=True, is_superuser=True)
        self.employment = self.make_employment(self.user, self.reporting_org, 'Users')
        self.setup_results_framework()

    def test_create_update(self):
        """Test that posting an update works."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': self.period.id,
            'user': self.user.id
        }

        # When
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')

        # Then
        self.assertEqual(201, response.status_code)

    def test_modify_update(self):
        """Test that modifying an update works."""
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        update_url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {
            'period': self.period.id,
            'user': self.user.id
        }
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')
        period_data_id = json.loads(response.content)['id']
        value = "10.00"

        # When
        data.update({'value': value})
        response = self.c.patch(update_url.format(period_data_id),
                                data=json.dumps(data),
                                content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual(value, json.loads(response.content)['value'])

    def test_create_disaggregated_update(self):
        """Test that creating an update with disaggregation works."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        value = "10.00"
        disaggregations = [{
            'dimension_value': self.dimension_value.id,
            'value': value
        }]
        data = {
            'period': self.period.id,
            'user': self.user.id,
            'value': value,
            'disaggregations': disaggregations
        }

        # When
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')

        # Then
        self.assertEqual(201, response.status_code)
        content = json.loads(response.content)
        self.assertEqual(value, content['value'])
        self.assertEqual(1, len(content['disaggregations']))
        self.assertEqual(float(value), float(content['disaggregations'][0]['value']))

    def test_modify_disaggregated_update(self):
        """Test that modifying an update with disaggregation works."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        value = 10
        disaggregations = [{
            'dimension_value': self.dimension_value.id,
            'value': value,
            'update': None
        }]
        data = {
            'period': self.period.id,
            'user': self.user.id,
            'value': value,
            'disaggregations': disaggregations
        }

        update_url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')
        update_id = json.loads(response.content)['id']
        new_value = "12.00"

        # When
        disaggregations[0]['value'] = data['value'] = new_value
        response = self.c.patch(update_url.format(update_id),
                                data=json.dumps(data),
                                content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertEqual(new_value, content['value'])
        self.assertEqual(1, len(content['disaggregations']))
        self.assertEqual(float(new_value), float(content['disaggregations'][0]['value']))

    def test_draft_update_invisible_to_me_manager(self):
        """Test that draft update is invisible to M&E managers."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': self.period.id,
            'user': self.user.id
        }
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')
        self.user2 = self.create_user(self.username2, self.password2)
        self.make_employment(self.user2, self.reporting_org, 'M&E Managers')

        # When
        self.c.logout()
        self.c.login(username=self.username2, password=self.password2)
        response = self.c.get(url, content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertEqual(0, len(content['results']))

    def test_draft_update_invisible_to_other_project_editors(self):
        """Test that draft update is invisible to other Project Editors."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': self.period.id,
            'user': self.user.id
        }
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')
        self.user2 = self.create_user(self.username2, self.password2)
        self.make_employment(self.user2, self.reporting_org, 'Project Editors')

        # When
        self.c.logout()
        self.c.login(username=self.username2, password=self.password2)
        response = self.c.get(url, content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertEqual(0, len(content['results']))

    def test_draft_update_visible_to_admin(self):
        """Test that draft update is visible to admins."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': self.period.id,
            'user': self.user.id
        }
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')
        content = json.loads(response.content)
        self.user2 = self.create_user(self.username2, self.password2, is_admin=True)
        self.make_employment(self.user2, self.reporting_org, 'Project Editors')
        update = IndicatorPeriodData.objects.get(id=content['id'])

        # When
        self.c.logout()
        self.c.login(username=self.username2, password=self.password2)
        response = self.c.get(url, content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertEqual(1, len(content['results']))
        self.assertEqual(update.id, content['results'][0]['id'])

    def test_period_framework_hides_draft_updates_for_me_managers(self):
        """Test draft updates hidden from M&E Managers in period framework."""
        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': self.period.id,
            'user': self.user.id
        }
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')
        self.user2 = self.create_user(self.username2, self.password2)
        self.make_employment(self.user2, self.reporting_org, 'M&E Managers')

        # When
        self.c.logout()
        self.c.login(username=self.username2, password=self.password2)
        url = '/rest/v1/indicator_period_framework/?format=json'
        response = self.c.get(url, content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertEqual(0, len(content['results'][0]['data']))

    def test_period_framework_hides_draft_updates_for_project_editors(self):
        """Test draft updates hidden from other Project Editors in period framework."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': self.period.id,
            'user': self.user.id
        }
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')
        self.user2 = self.create_user(self.username2, self.password2)
        self.make_employment(self.user2, self.reporting_org, 'Project Editors')

        # When
        self.c.logout()
        self.c.login(username=self.username2, password=self.password2)
        url = '/rest/v1/indicator_period_framework/?format=json'
        response = self.c.get(url, content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertEqual(0, len(content['results'][0]['data']))

    def test_period_framework_lists_draft_updates_for_admin(self):
        """Test draft updates visible to admins in the period framework."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': self.period.id,
            'user': self.user.id
        }
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')
        content = json.loads(response.content)
        self.user2 = self.create_user(self.username2, self.password2, is_admin=True)
        self.make_employment(self.user2, self.reporting_org, 'Project Editors')
        update = IndicatorPeriodData.objects.get(id=content['id'])

        # When
        self.c.logout()
        self.c.login(username=self.username2, password=self.password2)
        url = '/rest/v1/indicator_period_framework/?format=json'
        response = self.c.get(url, content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertEqual(1, len(content['results'][0]['data']))
        self.assertEqual(update.id, content['results'][0]['data'][0]['id'])

    def test_can_lock_unlock_periods(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        self.assertTrue(self.period.locked)
        url = '/rest/v1/indicator_period_framework/{}/?format=json'.format(self.period.id)
        data = {'locked': False}

        # When
        response = self.c.patch(url,
                                data=json.dumps(data),
                                content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        data = response.data
        self.assertFalse(data['locked'])
        self.assertEqual(self.period.id, data['id'])
        self.assertEqual(self.period.indicator.id, data['indicator'])
        self.assertEqual(self.period.period_start, data['period_start'])
        self.assertEqual(self.period.period_end, data['period_end'])
        self.assertEqual(self.period.target_comment, data['target_comment'])
        self.assertEqual(self.period.target_value, data['target_value'])
        self.assertEqual(self.period.actual_comment, data['actual_comment'])
        self.assertEqual(self.period.actual_value, data['actual_value'])
        self.assertEqual(self.period.numerator, data['numerator'])
        self.assertEqual(self.period.denominator, data['denominator'])
        self.assertEqual(self.period.percent_accomplishment, data['percent_accomplishment'])
        self.assertEqual(list(self.period.disaggregation_targets.all()),
                         data['disaggregation_targets'])
        self.assertEqual(list(self.period.disaggregations.all()),
                         data['disaggregations'])
        self.assertEqual(list(self.period.data.all()),
                         data['data'])
        self.assertEqual(self.period.parent_period, data['parent_period'])

        # Lock again
        data = {'locked': True}

        # When
        response = self.c.patch(url,
                                data=json.dumps(data),
                                content_type='application/json')

        self.assertEqual(200, response.status_code)
        self.assertTrue(response.data['locked'])

    def test_percentage_indicator_allows_edit_update(self):
        # Given
        self.user2 = self.create_user(self.username2, self.password2)
        self.make_employment(self.user2, self.reporting_org, 'M&E Managers')
        self.c.login(username=self.username2, password=self.password2)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': self.period.id,
            'user': self.user.id,
            "value": 150,
            "narrative": "",
            "text": "",
            "status": "D",
            "actual_value": 0,
            "numerator": "3",
            "denominator": "2",
            "disaggregations": [],
        }
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')
        self.assertEqual(201, response.status_code)

        # When
        data['id'] = response.data['id']
        data['numerator'] = '5'
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')

        # Then
        self.assertEqual(201, response.status_code)
        self.assertEqual('5.00', response.data['numerator'])

    def setup_results_framework(self):
        self.result = Result.objects.create(
            title='Result 1',
            project=self.project
        )
        self.indicator = Indicator.objects.create(
            title='Indicator 1',
            result=self.result
        )
        self.dimension_name = IndicatorDimensionName.objects.create(
            project=self.project,
            name="Gender"
        )
        self.dimension_value = IndicatorDimensionValue.objects.create(
            name=self.dimension_name,
            value="Female"
        )

        self.period = IndicatorPeriod.objects.create(
            period_start='2016-01-01',
            period_end='2016-12-31',
            indicator=self.indicator
        )
        self.percentage_indicator = Indicator.objects.create(
            title='Indicator 2',
            result=self.result,
            measure='2',
        )
        self.percentage_period = IndicatorPeriod.objects.create(
            period_start='2016-01-01',
            period_end='2016-12-31',
            indicator=self.percentage_indicator
        )
