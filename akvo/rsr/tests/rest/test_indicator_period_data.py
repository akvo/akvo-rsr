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
    IndicatorDimension, IndicatorPeriodData
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

    def _create_new_user(self, group, is_admin=False, is_superuser=False):
        self.username2 = "username2"
        self.password2 = "password2"
        self.user2 = User.objects.create_user(
            username=self.username2,
            password=self.password2,
            email='{}@test.akvo.org'.format(self.username2),
        )
        self.user2.is_active = True
        self.user2.is_admin = is_admin
        self.user2.is_superuser = is_superuser
        self.user2.save()
        group = Group.objects.get(name='M&E Managers')
        employment = Employment.objects.create(
            user=self.user2,
            organisation=self.reporting_org,
            group=group,
            is_approved=True,
        )
        return employment

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
        self._create_new_user(group='M&E Managers')

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
        self._create_new_user(group='Project Editors')

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
        self._create_new_user(group='Project Editors', is_admin=True)
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
        self._create_new_user(group='M&E Managers')

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
        self._create_new_user(group='Project Editors')

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
        self._create_new_user(group='Project Editors', is_admin=True)
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
