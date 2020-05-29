# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from akvo.rsr.models import Partnership
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from datetime import date


class SetPeriodsLockedTestCase(BaseTestCase):
    """Test REST endopoint for locking/unlocking periods."""

    def post_request(self, data, username, password):
        self.c.login(username=username, password=password)
        return self.c.post(
            '/rest/v1/set-periods-locked/',
            data=json.dumps(data),
            content_type='application/json'
        )

    def test_incomplete_request_data(self):
        self.create_user('test@akvo.org', 'password')
        response = self.post_request(data={}, username='test@akvo.org', password='password')
        self.assertEqual(400, response.status_code)

    def test_should_not_be_able_to_unlock_without_having_correct_permission(self):
        self.create_user('test@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                        'locked': True,
                    }]
                }]
            }])\
            .build()

        period = project.periods.first()
        response = self.post_request(
            data={'periods': [period.id], 'locked': False}, username='test@akvo.org', password='password')

        period = project.periods.first()
        self.assertTrue(period.locked)
        self.assertEqual(200, response.status_code)
        data = response.data
        self.assertEquals(len(data['results']), 0)

    def test_should_not_be_able_to_lock_without_correct_permission(self):
        self.create_user('test@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                        'locked': False,
                    }]
                }]
            }])\
            .build()

        period = project.periods.first()
        response = self.post_request(
            data={'periods': [period.id], 'locked': True}, username='test@akvo.org', password='password')

        period = project.periods.first()
        self.assertFalse(period.locked)
        self.assertEqual(200, response.status_code)
        data = response.data
        self.assertEquals(len(data['results']), 0)

    def test_should_be_able_to_unlock_periods_having_correct_permission(self):
        user = self.create_user('test@akvo.org', 'password')
        org = self.create_organisation('Acme Org')
        self.make_employment(user, org, 'M&E Managers')

        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                        'locked': True,
                    }]
                }]
            }])\
            .build()

        period = project.periods.first()
        response = self.post_request(
            data={'periods': [period.id], 'locked': False}, username='test@akvo.org', password='password')

        period = project.periods.first()
        self.assertFalse(period.locked)
        self.assertEqual(200, response.status_code)
        data = response.data
        self.assertIn(period.id, data['results'])

    def test_shoud_be_able_to_lock_periods_having_correct_permission(self):
        user = self.create_user('test@akvo.org', 'password')
        org = self.create_organisation('Acme Org')
        self.make_employment(user, org, 'M&E Managers')

        project = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                        'locked': False,
                    }]
                }]
            }])\
            .build()

        period = project.periods.first()
        response = self.post_request(
            data={'periods': [period.id], 'locked': True}, username='test@akvo.org', password='password')

        period = project.periods.first()
        self.assertTrue(period.locked)
        self.assertEqual(200, response.status_code)
        data = response.data
        self.assertIn(period.id, data['results'])

    def test_bulk_periods_with_mixed_permissions(self):
        user = self.create_user('test@akvo.org', 'password')
        org = self.create_organisation('Acme Org')
        self.make_employment(user, org, 'M&E Managers')

        project1 = ProjectFixtureBuilder()\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                        'locked': False,
                    }]
                }]
            }])\
            .build()

        project2 = ProjectFixtureBuilder()\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2010, 1, 1),
                        'period_end': date(2010, 12, 31),
                        'locked': False,
                    }]
                }]
            }])\
            .build()

        period1 = project1.periods.first()
        period2 = project2.periods.first()

        response = self.post_request(
            data={'periods': [period1.id, period2.id], 'locked': True}, username='test@akvo.org', password='password')

        period1 = project1.periods.first()
        period2 = project2.periods.first()
        self.assertTrue(period1.locked)
        self.assertFalse(period2.locked)
        self.assertEqual(200, response.status_code)
        data = response.data
        self.assertIn(period1.id, data['results'])
        self.assertNotIn(period2.id, data['results'])
        self.assertEqual(len(data['results']), 1)
