# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.urls import reverse

from akvo.rsr.models import Report
from akvo.rsr.tests.base import BaseTestCase


def project_reports_path(project_pk):
    return '{}?format=json'.format(reverse('project_reports', args=(project_pk,)))


class ProjectReportsRestrictionTestCase(BaseTestCase):
    """Project specific reports access restriction endpoint tests"""

    def setUp(self):
        super(ProjectReportsRestrictionTestCase, self).setUp()
        # Delete any reports created in the migrations
        Report.objects.all().delete()

    def assertReportNames(self, expected, response):
        reports = json.loads(response.content)
        names = [report['name'] for report in reports]
        self.assertEqual(expected, names)

    def test_invalid_project_return_404_response(self):
        response = self.c.get(project_reports_path(1))
        self.assertEqual(404, response.status_code)

    def test_anonymous_user_should_be_forbidden_to_see_project_reports(self):
        # Given
        proj1 = self.create_project('project-1')
        org1 = self.create_organisation('org-1')
        self.create_report('report-1')
        self.make_partner(proj1, org1)

        # When
        response = self.c.get(project_reports_path(proj1.id))

        # Then
        self.assertEqual(403, response.status_code)

    def test_organisation_user_should_be_able_to_see_organisation_project_reports(self):
        # Given
        proj1 = self.create_project('project-1')
        org1 = self.create_organisation('org-1')
        org2 = self.create_organisation('org-2')
        self.create_report('report-1')
        self.create_report('report-2', org1)
        self.create_report('report-3', org2)

        self.make_partner(proj1, org1)
        user = self.create_user('foo@example.com', 'secret')
        self.make_employment(user, org1, 'Users')

        # When
        self.c.login(username='foo@example.com', password='secret')
        response = self.c.get(project_reports_path(proj1.id))

        # Then
        self.assertReportNames(['report-1', 'report-2'], response)

    def test_organisation_admin_should_have_same_access_as_organisation_user(self):
        # Given
        proj1 = self.create_project('project-1')
        org1 = self.create_organisation('org-1')
        org2 = self.create_organisation('org-2')
        self.create_report('report-1')
        self.create_report('report-2', org1)
        self.create_report('report-3', org2)

        self.make_partner(proj1, org1)
        user = self.create_user('foo@example.com', 'secret')
        self.make_employment(user, org1, 'Admins')

        # When
        self.c.login(username='foo@example.com', password='secret')
        response = self.c.get(project_reports_path(proj1.id))

        # Then
        self.assertReportNames(['report-1', 'report-2'], response)

    def test_rsr_admin_should_be_able_to_see_all_reports(self):
        # Given
        proj1 = self.create_project('project-1')
        org1 = self.create_organisation('org-1')
        org2 = self.create_organisation('org-2')
        self.create_report('report-1')
        self.create_report('report-2', org1)
        self.create_report('report-3', org2)

        user = self.create_user('foo@example.com', 'secret', is_admin=True)
        self.make_employment(user, org1, 'Users')

        # When
        self.c.login(username='foo@example.com', password='secret')
        response = self.c.get(project_reports_path(proj1.id))

        # Then
        self.assertReportNames(['report-1', 'report-2', 'report-3'], response)

    def test_only_reports_with_project_parameter_are_shown(self):
        # Given
        proj1 = self.create_project('project-1')
        org1 = self.create_organisation('org-1')
        self.create_report('report-1')
        self.create_report('report-2', is_org_report=True)
        self.create_report(
            'projects-overview',
            url='/en/reports/project_overview/{organisation}?format={format}&download=true'
        )

        self.make_partner(proj1, org1)
        user = self.create_user('foo@example.com', 'secret')
        self.make_employment(user, org1, 'Users')

        # When
        self.c.login(username='foo@example.com', password='secret')
        response = self.c.get(project_reports_path(proj1.id))

        # Then
        self.assertReportNames(['report-1'], response)

    def test_project_partner_user_should_be_able_to_see_project_reports(self):
        # Given
        proj1 = self.create_project('project-1')
        org1 = self.create_organisation('org-1')
        org2 = self.create_organisation('org-2')
        self.create_report('report-1')
        self.create_report('report-2', org1)

        self.make_partner(proj1, org1)
        self.make_partner(proj1, org2)
        user = self.create_user('foo@example.com', 'secret')
        self.make_employment(user, org2, 'Users')

        # When
        self.c.login(username='foo@example.com', password='secret')
        response = self.c.get(project_reports_path(proj1.id))

        # Then
        self.assertReportNames(['report-1', 'report-2'], response)

    def test_non_project_partner_user_should_be_forbidden_to_see_project_reports(self):
        # Given
        proj1 = self.create_project('project-1')
        org1 = self.create_organisation('org-1')
        org2 = self.create_organisation('org-2')
        self.create_report('report-1')

        self.make_partner(proj1, org1)
        user = self.create_user('foo@example.com', 'secret')
        self.make_employment(user, org2, 'Users')

        # When
        self.c.login(username='foo@example.com', password='secret')
        response = self.c.get(project_reports_path(proj1.id))

        # Then
        self.assertEqual(403, response.status_code)

    def test_project_partner_user_should_be_able_to_see_parent_project_reports(self):
        """ project-1 + org-1 + (report-1+org-1)
                |
            project-2 + org-2 + user@org-2
        """
        proj1 = self.create_project('project-1')
        proj2 = self.create_project('project-2')
        org1 = self.create_organisation('org-1')
        org2 = self.create_organisation('org-2')
        self.create_report('report-1', org1)

        self.create_project_hierarchy(root_project=proj1, organisation=org1, max_depth=2)

        self.make_parent(proj1, proj2)
        self.make_partner(proj2, org2)
        user = self.create_user('foo@example.com', 'secret')
        self.make_employment(user, org2, 'Users')

        # When
        self.c.login(username='foo@example.com', password='secret')
        response = self.c.get(project_reports_path(proj2.id))

        # Then
        self.assertReportNames(['report-1'], response)

    def test_project_partner_user_should_be_able_to_see_grandparent_project_reports(self):
        """ project-1 + org-1 + (report-1+org-1)
                |
            project-2
                |
            project-3 + org-2 + user@org-2
        """
        proj1 = self.create_project('project-1')
        proj2 = self.create_project('project-2')
        proj3 = self.create_project('project-3')
        org1 = self.create_organisation('org-1')
        org2 = self.create_organisation('org-2')
        self.create_report('report-1', org1)

        self.create_project_hierarchy(root_project=proj1, organisation=org1, max_depth=2)

        self.make_parent(proj1, proj2)
        self.make_parent(proj2, proj3)
        self.make_partner(proj3, org2)
        user = self.create_user('foo@example.com', 'secret')
        self.make_employment(user, org2, 'Users')

        # When
        self.c.login(username='foo@example.com', password='secret')
        response = self.c.get(project_reports_path(proj3.id))

        # Then
        self.assertReportNames(['report-1'], response)
