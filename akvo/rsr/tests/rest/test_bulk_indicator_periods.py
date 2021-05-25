# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.models import Partnership


class BulkAddIndicatorPeriodsTestCase(BaseTestCase):

    def post_request(self, project, data, username, password):
        self.c.login(username=username, password=password)
        return self.c.post(
            '/rest/v1/bulk-add-periods/{}/'.format(project.id),
            data=json.dumps(data),
            content_type='application/json'
        )

    def test_incomplete_request_data(self):
        self.create_user('test@akvo.org', 'password')
        project = self.create_project('Test project')
        response = self.post_request(
            project, data={}, username='test@akvo.org', password='password')
        self.assertEqual(400, response.status_code)

    def test_should_not_be_able_to_add_periods_without_having_correct_permission(self):
        self.create_user('test@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .with_results([{
                'title': 'Result #1',
                'indicators': [
                    {'title': 'Indicator #1', 'periods': []},
                    {'title': 'Indicator #2', 'periods': []},
                ]
            }])\
            .build()

        data = {'periods': [{'period_start': '2020-01-01', 'period_end': '2020-01-31'}]}
        response = self.post_request(project.object, data=data, username='test@akvo.org', password='password')

        self.assertEqual(403, response.status_code)
        self.assertEqual(0, project.periods.count())

    def test_should_be_able_to_add_periods_having_correct_permission(self):
        user = self.create_user('test@akvo.org', 'password')
        org = self.create_organisation('Acme Org')
        self.make_employment(user, org, 'M&E Managers')
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1.1',
                            'periods': []
                        },
                        {
                            'title': 'Indicator #1.2',
                            'periods': [
                                {'period_start': '2020-01-01', 'period_end': '2020-01-31'}
                            ]
                        },
                    ]
                },
                {
                    'title': 'Result #2',
                    'indicators': [
                        {'title': 'Indicator #2.1', 'periods': []},
                    ]
                }
            ])\
            .build()

        data = {
            'periods': [
                {'period_start': '2020-01-01', 'period_end': '2020-01-31'},
                {'period_start': '2020-02-01', 'period_end': '2020-02-29'},
            ]
        }
        response = self.post_request(project.object, data=data, username='test@akvo.org', password='password')

        self.assertEqual(200, response.status_code)
        self.assertEqual(6, project.periods.count())


class BulkRemoveIndicatorPeriodsTestCase(BaseTestCase):

    def post_request(self, project, data, username, password):
        self.c.login(username=username, password=password)
        return self.c.post(
            '/rest/v1/bulk-remove-periods/{}/'.format(project.id),
            data=json.dumps(data),
            content_type='application/json'
        )

    def test_incomplete_request_data(self):
        self.create_user('test@akvo.org', 'password')
        project = self.create_project('Test project')
        response = self.post_request(
            project, data={}, username='test@akvo.org', password='password')
        self.assertEqual(400, response.status_code)

    def test_should_not_be_able_to_add_periods_without_having_correct_permission(self):
        self.create_user('test@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .with_results([{
                'title': 'Result #1',
                'indicators': [
                    {'title': 'Indicator #1', 'periods': [{'period_start': '2020-01-01', 'period_end': '2020-01-31'}]},
                    {'title': 'Indicator #2', 'periods': [{'period_start': '2020-01-01', 'period_end': '2020-01-31'}]},
                ]
            }])\
            .build()

        data = {'periods': [{'period_start': '2020-01-01', 'period_end': '2020-01-31'}]}
        response = self.post_request(project.object, data=data, username='test@akvo.org', password='password')

        self.assertEqual(403, response.status_code)
        self.assertEqual(2, project.periods.count())

    def test_should_be_able_to_add_periods_having_correct_permission(self):
        user = self.create_user('test@akvo.org', 'password')
        org = self.create_organisation('Acme Org')
        self.make_employment(user, org, 'M&E Managers')
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1.1',
                            'periods': [
                                {'period_start': '2020-02-01', 'period_end': '2020-02-29'},
                                {'period_start': '2020-03-01', 'period_end': '2020-03-31'},
                            ]
                        },
                        {
                            'title': 'Indicator #1.2',
                            'periods': [
                                {'period_start': '2020-01-01', 'period_end': '2020-01-31'},
                                {'period_start': '2020-02-01', 'period_end': '2020-02-29'},
                                {'period_start': '2020-03-01', 'period_end': '2020-03-31'},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Result #2',
                    'indicators': [
                        {
                            'title': 'Indicator #2.1',
                            'periods': [
                                {'period_start': '2020-02-01', 'period_end': '2020-02-29'},
                                {'period_start': '2020-03-01', 'period_end': '2020-03-31'},
                            ]
                        },
                    ]
                }
            ])\
            .build()

        data = {
            'periods': [
                {'period_start': '2020-03-01', 'period_end': '2020-03-31'},
                {'period_start': '2020-02-01', 'period_end': '2020-02-29'},
            ]
        }
        response = self.post_request(project.object, data=data, username='test@akvo.org', password='password')

        self.assertEqual(204, response.status_code)
        self.assertEqual(1, project.periods.count())

    def test_should_skip_periods_with_updates(self):
        user = self.create_user('test@akvo.org', 'password')
        org = self.create_organisation('Acme Org')
        self.make_employment(user, org, 'M&E Managers')
        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1.1',
                            'periods': [
                                {'period_start': '2020-01-01', 'period_end': '2020-01-31'},
                                {'period_start': '2020-02-01', 'period_end': '2020-02-29'},
                            ]
                        },
                        {
                            'title': 'Indicator #1.2',
                            'periods': [
                                {'period_start': '2020-01-01', 'period_end': '2020-01-31'},
                                {'period_start': '2020-02-01', 'period_end': '2020-02-29'},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Result #2',
                    'indicators': [
                        {
                            'title': 'Indicator #2.1',
                            'periods': [
                                {'period_start': '2020-01-01', 'period_end': '2020-01-31'},
                                {'period_start': '2020-02-01', 'period_end': '2020-02-29'},
                            ]
                        },
                    ]
                }
            ])\
            .build()

        period = project.get_period(period_start='2020-01-01', indicator__title='Indicator #1.2')
        period.add_update(user, value=1)

        data = {
            'periods': [
                {'period_start': '2020-02-01', 'period_end': '2020-02-29'},
                {'period_start': '2020-01-01', 'period_end': '2020-01-31'},
            ]
        }
        response = self.post_request(project.object, data=data, username='test@akvo.org', password='password')

        self.assertEqual(204, response.status_code)
        self.assertEqual(1, project.periods.count())
