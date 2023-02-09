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

    def send_patch(self, period, data, username, password):
        self.assertTrue(self.c.login(username=username, password=password))
        return self.c.patch(
            '/rest/v1/indicator_period/{}/'.format(period.id),
            data=json.dumps(data),
            content_type='application/json'
        )

    def create_org_user(self, username='test@akvo.org', password='password', org='Acme Org'):
        user = self.create_user(username, password)
        org = self.create_organisation(org)
        self.make_org_project_editor(user, org)
        return org, user

    def test_can_post_indicator_periods(self):
        username, password = 'test@akvo.org', 'password'
        org, _ = self.create_org_user(username, password)
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
                    'periods': []
                }]
            }]).build()

        indicator = project.indicators[0]
        data = {
            'period_start': '2010-1-1',
            'period_end': '2010-12-31',
            'target_value': 10,
            'indicator': indicator.id,
            'disaggregation_targets': [],
        }

        self.c.login(username=username, password=password)
        response = self.c.post(
            '/rest/v1/indicator_period/', data=json.dumps(data), content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        for key, value in data.items():
            self.assertEqual(data[key], value)

    def test_can_create_disaggregation_targets(self):
        org, _ = self.create_org_user('test@akvo.org', 'password')
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
                    }]
                }]
            }]).build()

        period = project.get_period(period_start=date(2010, 1, 1))
        male = project.get_disaggregation('Gender', 'Male')
        female = project.get_disaggregation('Gender', 'Female')
        data = {
            'target_value': 12,
            'disaggregation_targets': [
                {'value': 8, 'dimension_value': male.id},
                {'value': 10, 'dimension_value': female.id},
            ]
        }
        response = self.send_patch(period, data, username='test@akvo.org', password='password')

        self.assertEqual(response.status_code, 200)
        updated_period = project.get_period(period_start=date(2010, 1, 1))
        self.assertEqual(ensure_decimal(updated_period.target_value), 12)
        self.assertEqual(updated_period.get_disaggregation_target('Gender', 'Male').value, 8)
        self.assertEqual(updated_period.get_disaggregation_target('Gender', 'Female').value, 10)

    def test_should_be_able_to_patch_disaggregation_targets_values(self):
        org, _ = self.create_org_user('test@akvo.org', 'password')
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
                {'dimension_value': gender_female_target.dimension_value.id, 'value': 7},
                {'dimension_value': age_adults_target.dimension_value.id, 'value': 12},
            ]
        }
        response = self.send_patch(period, data, username='test@akvo.org', password='password')

        self.assertEqual(response.status_code, 200)
        updated_period = project.get_period(period_start=date(2010, 1, 1))
        self.assertEqual(ensure_decimal(updated_period.target_value), 12)
        self.assertEqual(updated_period.get_disaggregation_target('Gender', 'Female').value, 7)
        self.assertEqual(updated_period.get_disaggregation_target('Age', 'Adults').value, 12)

    def test_should_ignore_unrelated_dimension_values(self):
        org, _ = self.create_org_user('test@akvo.org', 'password')
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

        invalid_target_id = age_adults_target.dimension_value.id + 1
        data = {
            'disaggregation_targets': [
                {'dimension_value': invalid_target_id, 'value': 1},
            ]
        }
        response = self.send_patch(period, data, username='test@akvo.org', password='password')

        self.assertEqual(response.status_code, 400)


class IndicatorPeriodByIdsTestCase(BaseTestCase):

    def _setup_admin(self):
        admin = self.create_user("user@akvo.org", "password", is_admin=True)
        self.c.login(username=admin.username, password="password")
        return admin

    def _setup_program(self):
        org = self.create_organisation('Acme Org')
        return ProjectFixtureBuilder()\
            .with_title('Program #1')\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_disaggregations({'Gender': ['Male', 'Female']})\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'periods': [
                                {
                                    'period_start': '2010-1-1',
                                    'period_end': '2010-12-31',
                                    'target_value': 5,
                                    'disaggregation_targets': {
                                        'Gender': {'Male': 2, 'Female': 3},
                                    }
                                },
                            ],
                        },
                    ]
                },
            ])\
            .with_contributors([
                {'title': 'Project #1'},
                {'title': 'Project #2'},
                {'title': 'Project #3'},
            ])\
            .build()

    def setUp(self):
        super().setUp()
        self.admin = self._setup_admin()
        self.program = self._setup_program()
        self.project1 = self.program.get_contributor(title='Project #1')
        self.project2 = self.program.get_contributor(title='Project #2')
        self.project3 = self.program.get_contributor(title='Project #3')

    def test_get_periods(self):
        root_period = self.program.get_period(period_start='2010-1-1')
        contributor_1_period = self.project1.get_period(period_start='2010-1-1')
        contributor_2_period = self.project2.get_period(period_start='2010-1-1')
        contributor_3_period = self.project3.get_period(period_start='2010-1-1')
        contributor_1_period.add_update(self.admin, value=2, disaggregations={
            'Gender': {
                'Male': {'value': 1},
                'Female': {'value': 1},
            }
        })
        contributor_2_period.add_update(self.admin, value=3, disaggregations={
            'Gender': {
                'Male': {'value': 1},
                'Female': {'value': 2},
            }
        })

        period_ids = {root_period.id, contributor_1_period.id, contributor_2_period.id, contributor_3_period.id}
        response = self.c.get(
            f"/rest/v1/program/{self.program.id}/indicator_period_by_ids/?ids={','.join(str(id) for id in period_ids)}",
            content_type='application/json'
        )

        data = response.data
        self.assertEqual(period_ids, {p['id'] for p in data})
