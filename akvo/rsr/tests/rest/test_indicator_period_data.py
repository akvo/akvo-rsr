# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client

from akvo.rsr.models import (
    Project, Organisation, Partnership, User,
    Employment, Result, Indicator, IndicatorPeriod,
    IndicatorDimension
)

from akvo.utils import check_auth_groups


class IndicatorPeriodDataTestCase(TestCase):
    """Tests the indicator period data REST endpoints."""

    def setUp(self):
        """ Setup a minimal DB for the tests. """

        self.project = Project.objects.create(
            title="REST test project",
        )

        # Create groups
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        # Create organisation
        self.reporting_org = Organisation.objects.create(
            id=1337,
            name="Test REST reporting",
            long_name="Test REST reporting org",
            new_organisation_type=22
        )

        # Create partnership
        self.partnership = Partnership.objects.create(
            project=self.project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        # Create active user
        self.username = "username"
        self.password = "password"
        self.user = User.objects.create_user(
            username=self.username,
            email="user.rest@test.akvo.org",
            password=self.password,
        )
        self.user.is_active = True
        self.user.is_admin = True
        self.user.is_superuser = True
        self.user.save()

        # Create employment
        self.employment = Employment.objects.create(
            user=self.user,
            organisation=self.reporting_org,
            is_approved=True,
        )

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.setup_results_framework()

    def tearDown(self):
        Project.objects.all().delete()
        User.objects.all().delete()
        Organisation.objects.all().delete()
        Group.objects.all().delete()

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
        response.content

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
        value = 10

        # When
        data.update({'value': value})
        response = self.c.patch(update_url.format(period_data_id),
                                data=json.dumps(data),
                                content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        self.assertEqual(str(value), json.loads(response.content)['value'])

    def test_create_disaggregated_update(self):
        """Test that creating an update with disaggregation works."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        value = 10
        disaggregations = [{
            'dimension': self.dimension.id,
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
        self.assertEqual(str(value), content['value'])
        self.assertEqual(1, len(content['disaggregations']))
        self.assertEqual(float(value), float(content['disaggregations'][0]['value']))

    def test_modify_disaggregated_update(self):
        """Test that modifying an update with disaggregation works."""

        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/indicator_period_data_framework/?format=json'
        value = 10
        disaggregations = [{
            'dimension': self.dimension.id,
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
        new_value = 12

        # When
        disaggregations[0]['value'] = data['value'] = new_value
        response = self.c.patch(update_url.format(update_id),
                                data=json.dumps(data),
                                content_type='application/json')

        # Then
        self.assertEqual(200, response.status_code)
        content = json.loads(response.content)
        self.assertEqual(str(new_value), content['value'])
        self.assertEqual(1, len(content['disaggregations']))
        self.assertEqual(float(new_value), float(content['disaggregations'][0]['value']))

    def setup_results_framework(self):
        self.result = Result.objects.create(
            title='Result 1',
            project=self.project
        )
        self.indicator = Indicator.objects.create(
            title='Indicator 1',
            result=self.result
        )
        self.dimension = IndicatorDimension.objects.create(
            indicator=self.indicator,
            name='Gender',
            value='Female',
        )
        self.period = IndicatorPeriod.objects.create(
            period_start='2016-01-01',
            period_end='2016-12-31',
            indicator=self.indicator
        )
