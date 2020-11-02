# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from akvo.rsr.models import Partnership
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from datetime import date
from akvo.utils import ensure_decimal


class IndicatorPeriodNestedDisaggregationTargetPatchTestCase(BaseTestCase):
    """Test bulk patch disaggregation_targets on indicator_period endpoint"""

    def send_request(self, period, data, username, password):
        self.c.login(username=username, password=password)
        return self.c.patch(
            '/rest/v1/indicator_period/{}/'.format(period.id),
            data=json.dumps(data),
            content_type='application/json'
        )

    def create_org_user(self, username, password, org='Acme Org'):
        user = self.create_user('test@akvo.org', 'password')
        org = self.create_organisation('Acme Org')
        self.make_org_project_editor(user, org)
        return user, org

    def test_should_be_able_to_patch_disaggregation_targets_values(self):
        _, org = self.create_org_user('test@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
                'Age': ['Children', 'Adults']
            })\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                        'target_value': 10,
                        'disaggregation_targets': {
                            'Gender': {'Male': 5, 'Female': 5},
                            'Age': {'Adults': 10}
                        }
                    }]
                }]
            }]).build()

        period = project.get_period(period_start=date(2010, 1, 1))
        gender_female_target = period.get_disaggregation_target('Gender', 'Female')
        age_adults_target = period.get_disaggregation_target('Age', 'Adults')

        data = {
            'target_value': 12,
            'disaggregation_targets': [
                {'id': gender_female_target.id, 'value': 7},
                {'id': age_adults_target.id, 'value': 12},
            ]
        }
        self.send_request(period, data, username='test@akvo.org', password='password')

        updated_period = project.get_period(period_start=date(2010, 1, 1))
        self.assertEqual(ensure_decimal(updated_period.target_value), 12)
        self.assertEqual(updated_period.get_disaggregation_target('Gender', 'Female').value, 7)
        self.assertEqual(updated_period.get_disaggregation_target('Age', 'Adults').value, 12)

    def test_should_ignore_unrelated_ids(self):
        _, org = self.create_org_user('test@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({
                'Age': ['Adults']
            })\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                        'target_value': 10,
                        'disaggregation_targets': {
                            'Age': {'Adults': 10}
                        }
                    }]
                }]
            }]).build()

        period = project.get_period(period_start=date(2010, 1, 1))
        age_adults_target = period.get_disaggregation_target('Age', 'Adults')

        invalid_target_id = age_adults_target.id + 1
        data = {
            'disaggregation_targets': [
                {'id': invalid_target_id, 'value': 1},
            ]
        }
        response = self.send_request(period, data, username='test@akvo.org', password='password')

        self.assertEqual(response.status_code, 200)
