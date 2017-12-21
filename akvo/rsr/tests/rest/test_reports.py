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

from akvo.rsr.models import Employment, Organisation, Report, User
from akvo.utils import check_auth_groups


class ReportsTestCase(TestCase):
    """Tests the reports REST endpoints."""

    def setUp(self):
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

    def test_only_non_organisation_reports_shown(self):
        """Show only reports not associated with an organisation to anonymous user."""

        # Given
        self.create_report('report-1')
        self.create_report('report-2', 'org-1')
        self.create_report('report-3', 'org-2')

        # When
        response = self.c.get('/rest/v1/reports/?format=json')

        # Then
        self.assertEqual(response.status_code, 200)
        reports = json.loads(response.content)['results']
        self.assertEqual(len(reports), 1)

    def test_only_approved_employers_reports_shown(self):
        """Show only reports of organisation where user has approved employment."""

        # Given
        self.create_report('report-1')
        self.create_report('report-2', 'org-1')
        self.create_report('report-3', 'org-2')
        username, password = self.create_user(org_name='org-1')
        self.c.login(username=username, password=password)

        # When
        response = self.c.get('/rest/v1/reports/?format=json')

        # Then
        self.assertEqual(response.status_code, 200)
        reports = json.loads(response.content)['results']
        self.assertEqual(len(reports), 2)

    def test_only_approved_employers_reports_shown_to_org_admins(self):
        """Show only reports of approved employers, even to org admins."""

        # Given
        self.create_report('report-1')
        self.create_report('report-2', 'org-1')
        self.create_report('report-3', 'org-2')
        username, password = self.create_user(org_name='org-1', group_name='Admins')
        self.c.login(username=username, password=password)

        # When
        response = self.c.get('/rest/v1/reports/?format=json')

        # Then
        self.assertEqual(response.status_code, 200)
        reports = json.loads(response.content)['results']
        self.assertEqual(len(reports), 2)

    def test_show_all_reports_to_rsr_admins(self):
        """Show all reports to RSR admin users."""

        # Given
        self.create_report('report-1')
        self.create_report('report-2', 'org-1')
        self.create_report('report-3', 'org-2')
        username, password = self.create_user(org_name='org-1', is_admin=True)
        self.c.login(username=username, password=password)

        # When
        response = self.c.get('/rest/v1/reports/?format=json')

        # Then
        self.assertEqual(response.status_code, 200)
        reports = json.loads(response.content)['results']
        self.assertEqual(len(reports), 3)

    @staticmethod
    def create_report(report_name, org_name=None):
        report = Report.objects.create(name=report_name, title=report_name)
        if org_name is not None:
            org, _ = Organisation.objects.get_or_create(name=org_name, long_name=org_name)
            report.organisations.add(org)
        return report

    @staticmethod
    def create_user(org_name, group_name='Users', is_admin=False):
        org, _ = Organisation.objects.get_or_create(name=org_name, long_name=org_name)
        username = 'user@{}'.format(org_name)
        password = 'password@{}'.format(org_name)
        user = User.objects.create_user(username, username, password)
        user.is_admin = is_admin
        user.is_active = True
        user.save()
        group = Group.objects.get(name=group_name)
        Employment.objects.create(user=user,
                                  organisation=org,
                                  group=group,
                                  is_approved=True)
        return username, password
