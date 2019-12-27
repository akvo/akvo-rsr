# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.tests.base import BaseTestCase


class ReportsTestCase(BaseTestCase):
    """Tests the reports REST endpoints."""

    def setUp(self):
        super(ReportsTestCase, self).setUp()
        self.org1 = self.create_organisation('org-1')
        self.org2 = self.create_organisation('org-2')
        self.username = 'user@foo'
        self.password = 'password'
        self.user = self.create_user(self.username, self.password)

    def test_only_non_organisation_reports_shown(self):
        """Show only reports not associated with an organisation to anonymous user."""

        # Given
        self.create_report('report-1')
        self.create_report('report-2', self.org1)
        self.create_report('report-3', self.org2)

        # When
        response = self.c.get('/rest/v1/reports/?format=json')

        # Then
        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual(len(reports), 1)

    def test_only_approved_employers_reports_shown(self):
        """Show only reports of organisation where user has approved employment."""

        # Given
        self.create_report('report-1')
        self.create_report('report-2', self.org1)
        self.create_report('report-3', self.org2)
        self.make_employment(self.user, self.org1, 'Users')
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.get('/rest/v1/reports/?format=json')

        # Then
        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual(len(reports), 2)

    def test_only_approved_employers_reports_shown_to_org_admins(self):
        """Show only reports of approved employers, even to org admins."""

        # Given
        self.create_report('report-1')
        self.create_report('report-2', self.org1)
        self.create_report('report-3', self.org2)
        self.make_employment(self.user, self.org1, 'Admins')
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.get('/rest/v1/reports/?format=json')

        # Then
        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual(len(reports), 2)

    def test_show_all_reports_to_rsr_admins(self):
        """Show all reports to RSR admin users."""

        # Given
        self.create_report('report-1')
        self.create_report('report-2', self.org1)
        self.create_report('report-3', self.org2)
        self.user.is_admin = True
        self.user.save(update_fields=['is_admin'])
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.get('/rest/v1/reports/?format=json')

        # Then
        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual(len(reports), 3)
