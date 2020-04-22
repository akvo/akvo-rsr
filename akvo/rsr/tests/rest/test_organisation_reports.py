# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.urls import reverse
from akvo.rsr.models import Report
from akvo.rsr.tests.base import BaseTestCase


def org_reports_path():
    return reverse('organisation_reports')


class OrganisationReportsTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        # Delete any reports created in the migrations
        Report.objects.all().delete()

    def test_anonymous_user_can_see_org_reports_not_associated_to_any_organisations(self):
        self.create_report('report-1', is_org_report=True)
        self.create_report('report-2', self.create_organisation('Org-1'), is_org_report=True)

        response = self.c.get(org_reports_path())

        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual([r['name'] for r in reports], ['report-1'])

    def test_does_not_return_project_reports(self):
        self.create_report('report-1', is_org_report=True)
        self.create_report('report-2', is_org_report=False)

        response = self.c.get(org_reports_path())

        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual([r['name'] for r in reports], ['report-1'])

    def test_approved_employee_can_see_org_reports_associated_to_employer_organisation(self):
        org1 = self.create_organisation('Org-1')
        self.create_report('report-1', is_org_report=True)
        self.create_report('report-2', org1, is_org_report=True)
        self.create_report('report-3', self.create_organisation('Org-2'), is_org_report=True)
        username = 'test@akvo.org'
        user = self.create_user(username, 'password')
        self.make_employment(user, org1, 'Users')
        self.c.login(username=username, password='password')

        response = self.c.get(org_reports_path())

        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual([r['name'] for r in reports], ['report-1', 'report-2'])

    def test_show_all_org_reports_to_rsr_admins(self):
        self.create_report('report-1', is_org_report=True)
        self.create_report('report-2', self.create_organisation('Org-1'), is_org_report=True)
        username = 'test@akvo.org'
        self.create_user(username, 'password', is_admin=True)
        self.c.login(username=username, password='password')

        response = self.c.get(org_reports_path())

        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual([r['name'] for r in reports], ['report-1', 'report-2'])
