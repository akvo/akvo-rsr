# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from request_token.models import RequestToken

from akvo.constants import JWT_MAX_USE
from akvo.rsr.models import Partnership
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder


class ProjectEnumeratorsTestCase(BaseTestCase):
    """Test the project enumerators REST endpoint."""

    def setUp(self):
        super(ProjectEnumeratorsTestCase, self).setUp()
        self.user = self.create_user("user@akvo.org", "password", is_admin=True)
        self.c.login(username=self.user.username, password="password")

    def test_project_enumerators_get(self):
        org = self.create_organisation('Acme Org')
        user = self.create_user('foo@acme.org')
        project = ProjectFixtureBuilder()\
            .with_title('Project #1')\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'periods': [
                                {
                                    'period_start': '2010-1-1',
                                    'period_end': '2010-12-31'
                                },
                                {
                                    'period_start': '2011-1-1',
                                    'period_end': '2011-12-31'
                                },
                            ],
                            'enumerators': [user],
                        },
                        {
                            'title': 'Indicator #2',
                            'periods': [
                                {
                                    'period_start': '2010-1-1',
                                    'period_end': '2010-12-31'
                                },
                                {
                                    'period_start': '2011-1-1',
                                    'period_end': '2011-12-31'
                                },
                            ],
                            'enumerators': [user],
                        }
                    ]
                },
            ])\
            .build()

        response = self.c.get(
            "/rest/v1/project/{}/enumerators/?format=json".format(project.project.id)
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data), 1)
        enumerator = data[0]
        self.assertEqual(enumerator['email'], user.email)
        self.assertEqual(set(enumerator['indicators']), {i.id for i in project.indicators})

    def test_project_enumerators_assignment(self):
        org = self.create_organisation('Acme Org')
        user = self.create_user('foo@acme.org')
        project = ProjectFixtureBuilder()\
            .with_title('Project #1')\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'periods': [
                                {
                                    'period_start': '2010-1-1',
                                    'period_end': '2010-12-31'
                                },
                                {
                                    'period_start': '2011-1-1',
                                    'period_end': '2011-12-31'
                                },
                            ],
                        },
                        {
                            'title': 'Indicator #2',
                            'periods': [
                                {
                                    'period_start': '2010-1-1',
                                    'period_end': '2010-12-31'
                                },
                                {
                                    'period_start': '2011-1-1',
                                    'period_end': '2011-12-31'
                                },
                            ],
                        }
                    ]
                },
            ])\
            .build()
        indicator1, indicator2 = project.indicators.all()

        # Verify that initially no assignments have been done
        response = self.c.get(
            "/rest/v1/project/{}/enumerators/?format=json".format(project.project.id)
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data), 0)

        # Verify that users without access, or users not in DB cannot be assigned
        bogus_email = 'bogus@example.com'
        data = [
            {'email': user.email, 'indicators': [indicator1.pk]},
            {'email': bogus_email, 'indicators': [indicator2.pk]}
        ]
        response = self.c.patch(
            "/rest/v1/project/{}/enumerators/?format=json".format(project.project.id),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        error = response.data['error']
        self.assertIn(user.email, error)
        self.assertIn(bogus_email, error)

        # Add user to the reporting organisation so that they have access to the
        # project. Also, add another user to reporting org, who is a potential
        # Enumerator.
        self.make_employment(user, org, 'Enumerators')
        user2 = self.create_user('bar@acme.org')
        self.make_employment(user2, org, 'Enumerators')

        # Assign one of the indicators to user
        data = [{'email': user.email, 'indicators': [indicator1.pk]}]
        response = self.c.patch(
            "/rest/v1/project/{}/enumerators/?format=json".format(project.project.id),
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data), 2)
        enumerator, = [e for e in data if e['email'] == user.email]
        self.assertEqual(enumerator['indicators'], [indicator1.id])
        assignable_enumerator, = [e for e in data if e['email'] == user2.email]
        self.assertEqual(assignable_enumerator['indicators'], [])

        # Assign other indicator
        data = [{'email': user.email, 'indicators': [indicator2.pk]}]

        response = self.c.patch(
            "/rest/v1/project/{}/enumerators/?format=json".format(project.project.id),
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data), 2)
        enumerator, = [e for e in data if e['email'] == user.email]
        self.assertEqual(enumerator['indicators'], [indicator2.id])
        assignable_enumerator, = [e for e in data if e['email'] == user2.email]
        self.assertEqual(assignable_enumerator['indicators'], [])

    def test_assignment_send(self):
        org = self.create_organisation('Acme Org')
        user = self.create_user('foo@acme.org')
        user2 = self.create_user('bar@acme.org')
        project = ProjectFixtureBuilder()\
            .with_title('Project #1')\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
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
                                    'locked': False,
                                },
                                {
                                    'period_start': '2011-1-1',
                                    'period_end': '2011-12-31'
                                },
                            ],
                            'enumerators': [user],
                        },
                        {
                            'title': 'Indicator #2',
                            'periods': [
                                {
                                    'period_start': '2010-1-1',
                                    'period_end': '2010-12-31',
                                    'locked': False,
                                },
                                {
                                    'period_start': '2011-1-1',
                                    'period_end': '2011-12-31'
                                },
                            ],
                            'enumerators': [user2],
                        }
                    ]
                },
            ])\
            .build()

        response = self.c.post(
            f"/rest/v1/project/{project.project.id}/enumerator-assignment-send/?format=json",
            data=json.dumps({'emails': [user.email]}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data['status'], 'success')
        email_token_map = {user['email']: user['token'] for user in data['data']}
        self.assertIn(user.email, email_token_map)
        self.assertNotIn(user2.email, email_token_map)
        token = RequestToken.objects.get(user=user)
        self.assertEqual(1, len(token.data))
        self.assertIn(str(project.project.id), token.data)
        self.assertEqual(token.max_uses, JWT_MAX_USE)

        # Verify sending second assignment email

        project2 = ProjectFixtureBuilder()\
            .with_title('Project #2')\
            .with_partner(org, Partnership.IATI_REPORTING_ORGANISATION)\
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
                                    'locked': False,
                                },
                                {
                                    'period_start': '2011-1-1',
                                    'period_end': '2011-12-31'
                                },
                            ],
                            'enumerators': [user],
                        }
                    ]
                },
            ])\
            .build()

        response = self.c.post(
            f"/rest/v1/project/{project2.project.id}/enumerator-assignment-send/?format=json",
            data=json.dumps({'emails': [user.email]}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data['status'], 'success')
        email_token_map = {user['email']: user['token'] for user in data['data']}
        self.assertIn(user.email, email_token_map)
        self.assertNotIn(user2.email, email_token_map)
        token = RequestToken.objects.get(user=user)
        self.assertEqual(2, len(token.data))
        self.assertIn(str(project.project.id), token.data)
        self.assertIn(str(project2.project.id), token.data)
        self.assertEqual(token.max_uses, JWT_MAX_USE * 2)

        response = self.c.get(
            "/rest/v1/project/{}/enumerators/?format=json".format(project.project.id)
        )
        for enumerator in response.data:
            if enumerator['email'] == user.email:
                self.assertIsNotNone(enumerator['date_sent'])
            else:
                self.assertIsNone(enumerator['date_sent'])
