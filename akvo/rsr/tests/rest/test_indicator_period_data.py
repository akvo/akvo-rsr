# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json
from os.path import abspath, dirname, join
from datetime import date
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
from django.contrib.contenttypes.models import ContentType

from akvo.rsr.models import (
    Partnership, Result, Indicator, IndicatorPeriod,
    IndicatorDimensionName, IndicatorDimensionValue,
    IndicatorPeriodData, IndicatorPeriodDataFile, IndicatorPeriodDataPhoto,
    IndicatorPeriodDataComment,
)
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder

HERE = dirname(abspath(__file__))


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
            'period_actual_value': '4',
            'value': 1.00,
            'status': 'D',
        }

        # When
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')

        # Then
        self.assertEqual(201, response.status_code)
        for key in data:
            self.assertEqual(data[key], response.data[key])
        self.assertEqual(self.user.id, response.data['user'])

    def test_create_update2(self):
        """Test that posting an update works."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data/?format=json'
        data = {
            'period': self.period.id,
            'period_actual_value': '4',
            'value': 1.00,
            'status': 'D',
        }

        # When
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')

        # Then
        self.assertEqual(201, response.status_code)
        for key in data:
            self.assertEqual(data[key], response.data[key])
        self.assertEqual(self.user.id, response.data['user'])

    def test_create_comment(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        update = IndicatorPeriodData.objects.create(period=self.period, user=self.user)
        url = '/rest/v1/indicator_period_data_comment/?format=json'
        data = {
            'data': update.id,
            'comment': 'My awesome comment'
        }

        # When
        response = self.c.post(url,
                               data=json.dumps(data),
                               content_type='application/json')

        # Then
        self.assertEqual(201, response.status_code)
        for key in data:
            self.assertEqual(data[key], response.data[key])
        self.assertEqual(self.user.id, response.data['user'])

    def test_modify_update(self):
        """Test that modifying an update works."""
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        update_url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {
            'period': self.period.id,
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
        self.assertEqual(float(value), json.loads(response.content)['value'])

        # GET
        response = self.c.get(update_url.format(period_data_id),
                              content_type='application/json')
        self.assertEqual(float(value), response.data['value'])

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
        self.assertEqual(float(value), content['value'])
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
        self.assertEqual(float(new_value), content['value'])
        self.assertEqual(1, len(content['disaggregations']))
        self.assertEqual(float(new_value), float(content['disaggregations'][0]['value']))

    def test_draft_update_invisible_to_me_manager(self):
        """Test that draft update is invisible to M&E managers."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': self.period.id,
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
        self.assertEqual(5.00, response.data['numerator'])

    def test_upload_file(self):
        update = IndicatorPeriodData.objects.create(value='5', user=self.user, period=self.period)
        url = '/rest/v1/indicator_period_data/{}/upload_file/?format=json'.format(update.id)
        image_path = join(dirname(HERE), 'iati_export', 'test_image.jpg')
        data = {'file': open(image_path, 'r+b'),
                'type': 'photo'}

        self.c.login(username=self.username, password=self.password)
        response = self.c.post(url, data)

        self.assertEqual(200, response.status_code)
        update.refresh_from_db()
        with open(image_path, 'r+b') as f:
            self.assertEqual(f.read(), update.photo.read())

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


def create_org_user(username='test@akvo.org', password='password', org='Acme'):
    user = BaseTestCase.create_user(username, password)
    org = BaseTestCase.create_organisation(org)
    BaseTestCase.make_org_project_editor(user, org)
    return org, user


class IndicatorPeriodDataDisaggregationsValidationTestCase(BaseTestCase):
    def test_unit_type_indicator_new_update_invalid_case(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]

            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': period.id,
            'value': 10,
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'value': 4},
                {'dimension_value': project.get_disaggregation('Gender', 'Female').id, 'value': 7},
            ]
        }
        response = self.c.post(url, data=json.dumps(data), content_type='application/json')

        # Then
        self.assertEqual(400, response.status_code)

    def test_unit_type_indicator_edit_update_invalid_case(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]

            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, value=10, disaggregations={
            'Gender': {
                'Male': {'value': 3},
                'Female': {'value': 7},
            }
        })

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'value': 4},
            ]
        }
        response = self.c.patch(url.format(update.id),
                                data=json.dumps(data),
                                content_type='application/json')

        # Then
        self.assertEqual(400, response.status_code)

    def test_percentage_type_indicator_new_update_invalid_denominator_case(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'type': QUANTITATIVE,
                    'measure': PERCENTAGE_MEASURE,
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]

            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': period.id,
            'denominator': 10,
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'denominator': 11},
            ]
        }
        response = self.c.post(url, data=json.dumps(data), content_type='application/json')

        # Then
        self.assertEqual(400, response.status_code)

    def test_percentage_type_indicator_edit_update_invalid_denominator_case(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'type': QUANTITATIVE,
                    'measure': PERCENTAGE_MEASURE,
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]

            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, denominator=10, disaggregations={
            'Gender': {
                'Male': {'denominator': 10},
            }
        })

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'denominator': 11},
            ]
        }
        response = self.c.patch(url.format(update.id),
                                data=json.dumps(data),
                                content_type='application/json')

        # Then
        self.assertEqual(400, response.status_code)

    def test_percentage_type_indicator_new_update_invalid_numerator_case(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'type': QUANTITATIVE,
                    'measure': PERCENTAGE_MEASURE,
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]

            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': period.id,
            'numerator': 10,
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'numerator': 11},
            ]
        }
        response = self.c.post(url, data=json.dumps(data), content_type='application/json')

        # Then
        self.assertEqual(400, response.status_code)

    def test_percentage_type_indicator_edit_update_invalid_numerator_case(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'type': QUANTITATIVE,
                    'measure': PERCENTAGE_MEASURE,
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]

            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, denominator=10, disaggregations={
            'Gender': {
                'Male': {'numerator': 10},
            }
        })

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'numerator': 11},
            ]
        }
        response = self.c.patch(url.format(update.id),
                                data=json.dumps(data),
                                content_type='application/json')

        # Then
        self.assertEqual(400, response.status_code)


class IndicatorPeriodDataWithCommentsTestCase(BaseTestCase):

    def test_post_update_with_comment(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, _ = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': period.id,
            'comments': [{'comment': 'Test comment'}],
        }
        response = self.c.post(url, json.dumps(data), content_type='application/json')

        # Then
        self.assertEqual(201, response.status_code)
        self.assertEqual(1, IndicatorPeriodDataComment.objects.count())

    def test_patch_update_with_new_comment(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user)

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {
            'comments': [{'comment': 'Test comment'}]
        }
        response = self.c.patch(url.format(update.id), data=json.dumps(data), content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, IndicatorPeriodDataComment.objects.count())

    def test_patch_update_overwrites_comment(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user)
        comment = update.comments.create(user=user, comment='Initial comment')

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {
            'comments': [{'id': comment.id, 'comment': 'Adjusted comment'}]
        }
        response = self.c.patch(url.format(update.id), data=json.dumps(data), content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, IndicatorPeriodDataComment.objects.count())
        self.assertEqual('Adjusted comment', IndicatorPeriodDataComment.objects.first().comment)

    def test_patch_update_with_empty_comment(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user)
        comment = update.comments.create(user=user, comment='Initial comment')

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {
            'comments': [{'id': comment.id, 'comment': ''}]
        }
        response = self.c.patch(url.format(update.id), data=json.dumps(data), content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual(0, IndicatorPeriodDataComment.objects.count())


class IndicatorPeriodDataAttachmentsTestCase(BaseTestCase):

    def test_create_update_with_multiple_photo_and_file(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        image_path = join(dirname(HERE), 'iati_export', 'test_image.jpg')
        with open(image_path, 'r+b') as f:
            image_file = f.read()

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': period.id,
            'files': [SimpleUploadedFile('test-1.txt', 'test content'.encode('utf-8')), SimpleUploadedFile('test-2.txt', 'test content'.encode('utf-8'))],
            'photos': [SimpleUploadedFile('test_image.jpg', image_file)],
        }
        response = self.c.post(url, data)

        # Then
        self.assertEqual(201, response.status_code)
        self.assertEqual(2, IndicatorPeriodDataFile.objects.count())
        self.assertEqual(1, IndicatorPeriodDataPhoto.objects.count())
        self.assertEqual(2, len(response.data['file_set']))
        self.assertEqual(1, len(response.data['photo_set']))

    def test_add_new_files_to_an_update(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, value=1)

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data/{}/files/?format=json'.format(update.id)
        data = {
            'files': [
                SimpleUploadedFile('test-1.txt', 'test content'.encode('utf-8')),
                SimpleUploadedFile('test-2.txt', 'test content'.encode('utf-8'))
            ],
        }
        response = self.c.post(url, data)

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual(2, IndicatorPeriodDataFile.objects.count())

    def test_add_new_file_only_for_user_with_correct_permission(self):
        # Given
        org, creator = create_org_user()
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(creator, value=1)

        username, password = 'test-uploader@akvo.org', 'password'
        create_org_user(username, password, 'Foo')

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data/{}/files/?format=json'.format(update.id)
        data = {
            'files': [SimpleUploadedFile('test.txt', 'test content'.encode('utf-8'))]
        }
        response = self.c.post(url, data)

        # Then
        self.assertEqual(403, response.status_code)

    def test_add_new_photos_to_an_update(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, value=1)
        image_path = join(dirname(HERE), 'iati_export', 'test_image.jpg')
        with open(image_path, 'r+b') as f:
            image_file = f.read()

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data/{}/photos/?format=json'.format(update.id)
        data = {
            'photos': [
                SimpleUploadedFile('test_image1.jpg', image_file),
                SimpleUploadedFile('test_image2.jpg', image_file)
            ],
        }
        response = self.c.post(url, data)

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual(2, IndicatorPeriodDataPhoto.objects.count())

    def test_add_new_photo_only_for_update_creator(self):
        # Given
        org, creator = create_org_user()
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(creator, value=1)
        image_path = join(dirname(HERE), 'iati_export', 'test_image.jpg')
        with open(image_path, 'r+b') as f:
            image_file = f.read()

        username, password = 'test-uploader@akvo.org', 'password'
        uploader = self.create_user(username, password)
        self.make_org_project_editor(uploader, org)

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data/{}/photos/?format=json'.format(update.id)
        data = {
            'photos': [SimpleUploadedFile('test_image.jpg', image_file)]
        }
        response = self.c.post(url, data)

        # Then
        self.assertEqual(403, response.status_code)

    def test_remove_a_file_from_an_update(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, value=1)
        file = IndicatorPeriodDataFile.objects.create(
            update=update,
            file=SimpleUploadedFile('test.txt', 'test content'.encode('utf-8'))
        )

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data/{}/files/{}/?format=json'.format(update.id, file.id)
        response = self.c.delete(url)

        # Then
        self.assertEqual(204, response.status_code)
        self.assertEqual(0, IndicatorPeriodDataFile.objects.count())

    def test_remove_a_photo_from_an_update(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, value=1)
        image_path = join(dirname(HERE), 'iati_export', 'test_image.jpg')
        with open(image_path, 'r+b') as f:
            image_file = f.read()
        photo = IndicatorPeriodDataPhoto.objects.create(
            update=update,
            photo=SimpleUploadedFile('test_image.jpg', image_file)
        )

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data/{}/photos/{}/?format=json'.format(update.id, photo.id)
        response = self.c.delete(url)

        # Then
        self.assertEqual(204, response.status_code)
        self.assertEqual(0, IndicatorPeriodDataPhoto.objects.count())


class IndicatorPeriodDataAuditTrailTestCase(BaseTestCase):

    def image_file(self):
        image_path = join(dirname(HERE), 'iati_export', 'test_image.jpg')
        with open(image_path, 'r+b') as f:
            return f.read()

    def find_audit_trails(self, user, object_id):
        return LogEntry.objects.filter(
            user=user.id,
            content_type=ContentType.objects.get_for_model(IndicatorPeriodData),
            object_id=object_id,
            change_message__contains='audit_trail'
        )

    def test_create_quantitative_unit_update(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': period.id,
            'value': 10,
            'text': 'test text',
            'status': 'P',
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'value': 4},
                {'dimension_value': project.get_disaggregation('Gender', 'Female').id, 'value': 6},
            ],
            'comments': [{'comment': 'test comment'}],
        }
        response = self.c.post(url, data=json.dumps(data), content_type='application/json')
        # Then
        entry = self.find_audit_trails(user, response.data['id']).first()
        actual = json.loads(entry.change_message)['data']
        expected = {
            'value': 10.0,
            'text': 'test text',
            'status': 'P',
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'value': 4},
                {'dimension_value': project.get_disaggregation('Gender', 'Female').id, 'value': 6},
            ],
            'comments': [{'comment': 'test comment'}]
        }
        self.assertEqual(expected, actual)
        self.assertEqual(user.id, entry.user.id)
        self.assertEqual(ADDITION, entry.action_flag)

    def test_create_quantitative_percentage_update(self):
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'type': QUANTITATIVE,
                    'measure': PERCENTAGE_MEASURE,
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]

            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': period.id,
            'numerator': 10,
            'denominator': 20,
            'text': 'test text',
            'status': 'P',
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'numerator': 4, 'denominator': 10},
                {'dimension_value': project.get_disaggregation('Gender', 'Female').id, 'numerator': 6, 'denominator': 10},
            ],
            'comments': [{'comment': 'test comment'}],
        }
        response = self.c.post(url, data=json.dumps(data), content_type='application/json')
        # Then
        entry = self.find_audit_trails(user, response.data['id']).first()
        actual = json.loads(entry.change_message)['data']
        expected = {
            'numerator': 10,
            'denominator': 20,
            'text': 'test text',
            'status': 'P',
            'disaggregations': [
                {'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'numerator': 4, 'denominator': 10},
                {'dimension_value': project.get_disaggregation('Gender', 'Female').id, 'numerator': 6, 'denominator': 10},
            ],
            'comments': [{'comment': 'test comment'}]
        }
        self.assertEqual(expected, actual)
        self.assertEqual(user.id, entry.user.id)
        self.assertEqual(ADDITION, entry.action_flag)

    def test_create_qualitative_update(self):
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'type': QUALITATIVE,
                    'scores': ['Yes', 'No'],
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]

            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': period.id,
            'narrative': 'test narrative',
            'score_indices': [1],
            'status': 'P',
            'comments': [{'comment': 'test comment'}],
        }
        response = self.c.post(url, data=json.dumps(data), content_type='application/json')
        # Then
        entry = self.find_audit_trails(user, response.data['id']).first()
        actual = json.loads(entry.change_message)['data']
        expected = {
            'narrative': 'test narrative',
            'score_indices': [1],
            'status': 'P',
            'comments': [{'comment': 'test comment'}]
        }
        self.assertEqual(expected, actual)
        self.assertEqual(user.id, entry.user.id)
        self.assertEqual(ADDITION, entry.action_flag)

    def test_modify_update(self):
        # Given
        org, user = create_org_user('test-user@akvo.org', 'password')
        updater = self.create_user('test-updater@akvo.org', 'password', is_admin=True)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(
            user,
            value=4,
            status='D',
            disaggregations={
                'Gender': {'Male': {'value': 4}}
            },
            comments=['a comment']
        )
        first_disaggregation_id = update.disaggregations.first().id
        first_comment_id = update.comments.first().id
        # When
        self.c.login(username=updater.email, password='password')
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {
            "id": update.id,
            "period": period.id,
            "status": "P",
            "value": 10,
            "disaggregations": [
                {
                    "id": first_disaggregation_id,
                    "dimension_value": project.get_disaggregation('Gender', 'Male').id,
                    "value": 4,
                    "numerator": None,
                    "denominator": None
                },
                {
                    "dimension_value": project.get_disaggregation('Gender', 'Female').id,
                    "value": 6,
                    "numerator": None,
                    "denominator": None
                }
            ],
            'comments': [{'id': first_comment_id, 'comment': 'changed'}, {'comment': 'new comment'}],
            "review_note": "",
            "text": "",
            "numerator": None,
            "denominator": None,
            "narrative": "",
            "score_indices": [],
        }
        self.c.patch(url.format(update.id), data=json.dumps(data), content_type='application/json')
        # Then
        entry = self.find_audit_trails(updater, update.id).first()
        actual = json.loads(entry.change_message)['data']
        expected = {
            'value': 10.0,
            'status': 'P',
            'disaggregations': [
                {'id': first_disaggregation_id, 'dimension_value': project.get_disaggregation('Gender', 'Male').id, 'value': 4},
                {'dimension_value': project.get_disaggregation('Gender', 'Female').id, 'value': 6},
            ],
            'comments': [{'id': first_comment_id, 'comment': 'changed'}, {'comment': 'new comment'}]
        }
        self.assertEqual(expected, actual)
        self.assertEqual(updater.id, entry.user.id)
        self.assertEqual(CHANGE, entry.action_flag)
        update.refresh_from_db()
        self.assertEqual(update.user, updater)

    def test_reject_update_should_not_change_update_user(self):
        # Given
        org, user = create_org_user('test-user@akvo.org', 'password')
        admin = self.create_user('test-admin@akvo.org', 'password', is_admin=True)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(
            user,
            value=4,
            status='P',
            comments=['a comment']
        )
        # When
        self.c.login(username=admin.email, password='password')
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {'status': 'R', 'review_note': 'test'}
        self.c.patch(url.format(update.id), data=json.dumps(data), content_type='application/json')
        # Then
        update.refresh_from_db()
        self.assertEqual(update.user, user)

    def test_approve_update_should_not_change_update_user(self):
        # Given
        org, user = create_org_user('test-user@akvo.org', 'password')
        admin = self.create_user('test-admin@akvo.org', 'password', is_admin=True)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(
            user,
            value=4,
            status='P',
            comments=['a comment']
        )
        # When
        self.c.login(username=admin.email, password='password')
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        data = {'status': 'A'}
        self.c.patch(url.format(update.id), data=json.dumps(data), content_type='application/json')
        # Then
        update.refresh_from_db()
        self.assertEqual(update.user, user)

    def test_remove_update(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(
            user,
            value=10,
            status='D',
            disaggregations={
                'Gender': {'Male': {'value': 4}, 'Female': {'value': 6}}
            },
            comments=['a comment']
        )
        update_id = update.id
        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        self.c.delete(url.format(update_id))
        # Then
        entry = self.find_audit_trails(user, update_id).first()
        self.assertEqual(user.id, entry.user.id)
        self.assertEqual(DELETION, entry.action_flag)

    def test_upload_file(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, value=1)

        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data/{}/files/?format=json'.format(update.id)
        data = {
            'files': [
                SimpleUploadedFile('test-1.txt', 'test content'.encode('utf-8')),
                SimpleUploadedFile('test_image.jpg', self.image_file())
            ],
        }
        self.c.post(url, data)
        # Then
        entry = self.find_audit_trails(user, update.id).first()
        actual = json.loads(entry.change_message)['data']
        expected = {
            'files': ['Uploaded file "test-1.txt"', 'Uploaded file "test_image.jpg"']
        }
        self.assertEqual(expected, actual)
        self.assertEqual(user.id, entry.user.id)
        self.assertEqual(CHANGE, entry.action_flag)

    def test_remove_file(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, value=1)
        file = IndicatorPeriodDataFile.objects.create(
            update=update,
            file=SimpleUploadedFile('test.txt', 'test content'.encode('utf-8'))
        )
        # When
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data/{}/files/{}/?format=json'.format(update.id, file.id)
        self.c.delete(url)
        # Then
        entry = self.find_audit_trails(user, update.id).first()
        actual = json.loads(entry.change_message)['data']
        self.assertRegex(actual['files'][0], r'^Removed file "test.*\.txt"$')
        self.assertEqual(user.id, entry.user.id)
        self.assertEqual(CHANGE, entry.action_flag)

    def test_bulk_change_update_status(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        update = period.add_update(user, value=10, status='P')
        # When
        self.c.login(username=username, password=password)
        data = {'updates': [update.id], 'status': 'A'}
        self.c.post(
            '/rest/v1/set-updates-status/{}/'.format(project.object.id),
            data=json.dumps(data),
            content_type='application/json'
        )
        # Then
        entry = self.find_audit_trails(user, update.id).first()
        actual = json.loads(entry.change_message)['data']
        self.assertEqual({'status': 'A'}, actual)
        self.assertEqual(user.id, entry.user.id)
        self.assertEqual(CHANGE, entry.action_flag)

    def test_query_audit_trail(self):
        # Given
        username, password = 'test@akvo.org', 'password'
        org, user = create_org_user(username, password)
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result  #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                    }]
                }]
            }]).build()
        period = project.get_period(period_start=date(2010, 1, 1))
        self.c.login(username=username, password=password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        data = {
            'period': period.id,
            'value': 10,
            'status': 'P',
        }
        response = self.c.post(url, data=json.dumps(data), content_type='application/json')
        update_id = response.data['id']
        log_entry = self.find_audit_trails(user, update_id).first()
        # When
        update_url = '/rest/v1/indicator_period_data_framework/{}/?format=json'
        detail_response = self.c.get(update_url.format(update_id), content_type='application/json')
        # Then
        expected = [
            {
                'user': {'id': user.id, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name},
                'action_time': log_entry.action_time,
                'action_flag': 'ADDITION',
                'data': {'value': 10, 'status': 'P'}
            }
        ]
        self.assertEqual(expected, detail_response.data['audit_trail'])
