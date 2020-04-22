# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.urls import reverse

from akvo.rsr.models import Report
from akvo.rsr.tests.base import BaseTestCase


def program_reports_path(program_pk):
    return reverse('program_reports', args=(program_pk,))


class ProgramReportsTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        # Delete any reports created in the migrations
        Report.objects.all().delete()

    def test_not_exists_program_return_404(self):
        response = self.c.get(program_reports_path(1))
        self.assertEqual(404, response.status_code)

    def test_project_not_program_return_404(self):
        project = self.create_project('project-1')
        response = self.c.get(program_reports_path(project.id))
        self.assertEqual(404, response.status_code)

    def test_anonymous_user_should_be_forbidden_to_see_program_reports(self):
        program = self.create_project('project-1')
        org = self.create_organisation('org-1')
        self.create_project_hierarchy(org, program, 1)

        response = self.c.get(program_reports_path(program.id))

        self.assertEqual(403, response.status_code)

    def create_program_report(self, report_name, organisation=None):
        url = '/{organisation}/?format={format}&program=true'
        return self.create_report(report_name, organisation, url=url)

    def test_approved_employee_can_see_program_reports_associated_to_employer_organisation(self):
        program = self.create_project('project-1')
        org = self.create_organisation('org-1')
        self.create_project_hierarchy(org, program, 1)
        self.create_program_report('report-1', org)
        self.create_program_report('report-2', self.create_organisation('org-2'))
        username = 'test@akvo.org'
        user = self.create_user(username, 'password')
        self.make_employment(user, org, 'Users')
        self.c.login(username=username, password='password')

        response = self.c.get(program_reports_path(program.id))

        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual([r['name'] for r in reports], ['report-1'])

    def test_rsr_admin_should_be_able_to_see_all_program_reports(self):
        program = self.create_project('project-1')
        org = self.create_organisation('org-1')
        self.create_project_hierarchy(org, program, 1)
        self.create_program_report('report-1', org)
        username = 'test@akvo.org'
        self.create_user(username, 'password', is_admin=True)
        self.c.login(username=username, password='password')

        response = self.c.get(program_reports_path(program.id))

        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual([r['name'] for r in reports], ['report-1'])

    def test_should_only_returns_program_reports(self):
        program = self.create_project('project-1')
        org = self.create_organisation('org-1')
        self.create_project_hierarchy(org, program, 1)
        self.create_report('report-1', org)
        self.create_program_report('report-2', org)
        self.create_report('report-3', org, is_org_report=True)
        username = 'test@akvo.org'
        user = self.create_user(username, 'password')
        self.make_employment(user, org, 'Users')
        self.c.login(username=username, password='password')

        response = self.c.get(program_reports_path(program.id))

        self.assertEqual(response.status_code, 200)
        reports = response.data['results']
        self.assertEqual([r['name'] for r in reports], ['report-2'])
