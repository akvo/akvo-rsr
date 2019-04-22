# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.test import TestCase, Client
from django.conf import settings
from django.urls import reverse
from django.contrib.auth.models import Group

from akvo.rsr.models import (
    Employment, Organisation, Partnership, Project, RelatedProject, Report, User
)
from akvo.utils import check_auth_groups


def create_report(report_name, project=None, organisation=None,
                  url='/{project}/?format={format}'):
    report = Report.objects.create(
        name=report_name, title=report_name, url=url)
    if project is not None:
        report.projects.add(project)
    if organisation is not None:
        report.organisations.add(organisation)
    return report


def create_user(organisation, group_name='Users', is_admin=False):
    username = 'user@{}'.format(organisation.name)
    password = 'password@{}'.format(organisation.name)
    user = User.objects.create_user(username, username, password)
    user.is_admin = is_admin
    user.is_active = True
    user.save()
    group = Group.objects.get(name=group_name)
    Employment.objects.create(user=user, organisation=organisation,
                              group=group, is_approved=True)
    return username, password


def get_or_create_organisation(name):
    organisation, _ = Organisation.objects.get_or_create(name=name, long_name=name)
    return organisation


def get_or_create_project(title):
    project, _ = Project.objects.get_or_create(title=title)
    return project


def make_partner(project, organisation):
    Partnership.objects.create(project=project, organisation=organisation)


def make_parent(parent, project):
    RelatedProject.objects.create(
        project=parent,
        related_project=project,
        relation=RelatedProject.PROJECT_RELATION_CHILD
    )


def make_child(child, project):
    RelatedProject.objects.create(
        project=child,
        related_project=project,
        relation=RelatedProject.PROJECT_RELATION_PARENT
    )


def project_reports_path(project_pk):
    return '{}?format=json'.format(reverse('project_reports', args=(project_pk,)))


class BaseProjectReportTestCase(TestCase):

    def setUp(self):
        self.client = Client(HTTP_HOST=settings.RSR_DOMAIN)
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        # Delete any reports created in the migrations
        Report.objects.all().delete()

    def assertReportNames(self, expected, reports):
        names = [report['name'] for report in reports]
        self.assertEqual(expected, names)


class ReportBackwardCompatibilityTestCase(BaseProjectReportTestCase):
    """Project reports retrieval endpoint backward compatibility tests"""

    def test_anonymous_user_should_only_see_non_organisation_reports(self):
        # Given
        proj1 = get_or_create_project('project-1')
        org1 = get_or_create_organisation('org-1')
        create_report('report-1')
        create_report('report-2', organisation=org1)

        # When
        response = self.client.get(project_reports_path(proj1.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)

    def test_organisation_user_should_be_able_to_see_organisation_reports(self):
        # Given
        proj1 = get_or_create_project('project-1')
        org1 = get_or_create_organisation('org-1')
        org2 = get_or_create_organisation('org-2')
        create_report('report-1')
        create_report('report-2', organisation=org1)
        create_report('report-3', organisation=org2)

        username, password = create_user(org1)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj1.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1', 'report-2'], reports)

    def test_organisation_admin_should_have_same_access_as_organisation_user(self):
        # Given
        proj1 = get_or_create_project('project-1')
        org1 = get_or_create_organisation('org-1')
        org2 = get_or_create_organisation('org-2')
        create_report('report-1')
        create_report('report-2', organisation=org1)
        create_report('report-3', organisation=org2)

        username, password = create_user(org1, group_name='Admins')

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj1.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1', 'report-2'], reports)

    def test_rsr_admin_should_be_able_to_see_all_reports(self):
        # Given
        proj1 = get_or_create_project('project-1')
        org1 = get_or_create_organisation('org-1')
        org2 = get_or_create_organisation('org-2')
        create_report('report-1')
        create_report('report-2', organisation=org1)
        create_report('report-3', organisation=org2)

        username, password = create_user(org1, is_admin=True)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj1.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1', 'report-2', 'report-3'], reports)


class ProjectReportRestrictionTestCase(BaseProjectReportTestCase):
    """Project specific reports access restriction endpoint tests"""

    def test_invalid_project_return_404_response(self):
        response = self.client.get(project_reports_path(1))
        self.assertEqual(404, response.status_code)

    def test_only_report_with_project_parameter_are_shown(self):
        proj1 = get_or_create_project('project-1')
        create_report('report-1', url='/{project}/?format={format}')
        create_report('report-2', url='/{organisation}/?format={format}')

        response = self.client.get(project_reports_path(proj1.id))

        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)

    def test_anonymous_user_should_only_see_non_project_specific_reports(self):
        proj1 = get_or_create_project('project-1')
        create_report('report-1')
        create_report('report-2', proj1)

        response = self.client.get(project_reports_path(proj1.id))

        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)

    def test_project_partner_user_should_be_able_to_see_project_report(self):
        # Given
        proj1 = get_or_create_project('project-1')
        org1 = get_or_create_organisation('org-1')
        create_report('report-1')
        create_report('report-2', proj1)

        make_partner(proj1, org1)
        username, password = create_user(org1)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj1.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1', 'report-2'], reports)

    def test_non_project_partner_user_should_not_be_able_to_see_project_report(self):
        # Given
        proj1 = get_or_create_project('project-1')
        org1 = get_or_create_organisation('org-1')
        org2 = get_or_create_organisation('org-2')
        create_report('report-1')
        create_report('report-2', proj1)

        make_partner(proj1, org1)
        username, password = create_user(org2)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj1.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)

    def test_project_partner_user_should_be_able_to_see_parent_project_report(self):
        """ project-1 + report-1
                |
            project-2 + user@org-1
        """
        proj1 = get_or_create_project('project-1')
        proj2 = get_or_create_project('project-2')
        org1 = get_or_create_organisation('org-1')
        create_report('report-1', proj1)

        make_parent(proj1, proj2)
        make_partner(proj2, org1)
        username, password = create_user(org1)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj2.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)

    def test_project_partner_user_should_be_able_to_see_grandparent_project_report(self):
        """ project-1 + report-1
                |
            project-2
                |
            project-3 + user@org-1
        """
        proj1 = get_or_create_project('project-1')
        proj2 = get_or_create_project('project-2')
        proj3 = get_or_create_project('project-3')
        org1 = get_or_create_organisation('org-1')
        create_report('report-1', proj1)

        make_parent(proj1, proj2)
        make_parent(proj2, proj3)
        make_partner(proj3, org1)
        username, password = create_user(org1)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj3.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)

    def test_project_partner_user_should_be_able_to_see_second_level_project_report(self):
        """ project-1
                |
            project-2 + report-1
                |
            project-3 + user@org-1
        """
        proj1 = get_or_create_project('project-1')
        proj2 = get_or_create_project('project-2')
        proj3 = get_or_create_project('project-3')
        org1 = get_or_create_organisation('org-1')
        create_report('report-1', proj2)

        make_parent(proj1, proj2)
        make_parent(proj2, proj3)
        make_partner(proj3, org1)
        username, password = create_user(org1)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj3.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)

    def test_parent_project_report_of_a_project_with_multiple_parent(self):
        """ project-2   project-1 + report-1
                 \        /
                  project-3 + user@org-1
        """
        proj1 = get_or_create_project('project-1')
        proj2 = get_or_create_project('project-2')
        proj3 = get_or_create_project('project-3')
        org1 = get_or_create_organisation('org-1')
        create_report('report-1', proj1)

        make_parent(proj1, proj3)
        make_child(proj3, proj2)
        make_partner(proj3, org1)
        username, password = create_user(org1)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj3.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)

    def test_project_report_restricted_to_some_organisation_positive_case(self):
        proj1 = get_or_create_project('project-1')
        org1 = get_or_create_organisation('org-1')
        create_report('report-1', project=proj1, organisation=org1)

        make_partner(proj1, org1)
        username, password = create_user(org1)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj1.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)

    def test_project_report_restricted_to_some_organisation_negative_case(self):
        # Given
        proj1 = get_or_create_project('project-1')
        org1 = get_or_create_organisation('org-1')
        org2 = get_or_create_organisation('org-2')
        create_report('report-1', project=proj1, organisation=org1)

        make_partner(proj1, org1)
        make_partner(proj1, org2)
        username, password = create_user(org2)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj1.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames([], reports)

    def test_rsr_admin_should_be_able_to_see_all_project_reports(self):
        # Given
        proj1 = get_or_create_project('project-1')
        org1 = get_or_create_organisation('org-1')
        org2 = get_or_create_organisation('org-2')
        create_report('report-1', project=proj1, organisation=org1)

        make_partner(proj1, org1)
        username, password = create_user(org2, is_admin=True)

        # When
        self.client.login(username=username, password=password)
        response = self.client.get(project_reports_path(proj1.id))

        # Then
        reports = json.loads(response.content)
        self.assertReportNames(['report-1'], reports)
