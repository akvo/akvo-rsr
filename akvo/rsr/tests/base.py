# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import logging

from django.conf import settings
from django.contrib.auth import user_login_failed
from django.contrib.auth.models import Group
from django.http import HttpRequest
from django.test import TestCase, Client

from akvo.rsr.models import (
    User, Employment, Organisation, Project, RelatedProject, Partnership, PublishingStatus,
    Report, ProjectUpdate, ProjectHierarchy, ProjectRole
)
from akvo.utils import check_auth_groups


class BaseTestCase(TestCase):
    """Testing that permissions work correctly."""

    @classmethod
    def setUpClass(cls):
        super(TestCase, cls).setUpClass()
        user_login_failed.connect(cls.handle_user_login_failed)

    @classmethod
    def tearDownClass(cls):
        super(TestCase, cls).tearDownClass()
        user_login_failed.disconnect(cls.handle_user_login_failed)

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    @classmethod
    def handle_user_login_failed(cls, signal, sender: str, credentials: dict, request: HttpRequest):
        logging.warning("Couldn't login user from %s, with %s. Existing users: %s",
                        sender, credentials, User.objects.all())

    @staticmethod
    def create_user(email, password=None, is_active=True, is_admin=False, is_superuser=False):
        """Create a user with the given email."""

        first_name = email.split('@')[0]
        last_name = 'von {}enstein'.format(first_name)
        user = User.objects.create(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            is_active=is_active,
            is_admin=is_admin,
            is_superuser=is_superuser,
        )
        if password:
            user.set_password(password)
            user.save()
        return user

    @staticmethod
    def create_organisation(name, can_create_projects=True):
        """Create an organisation with the given name."""
        org = Organisation.objects.create(
            name=name, long_name=name, can_create_projects=can_create_projects
        )
        return org

    @staticmethod
    def create_project(title, published=True, public=True):
        """Create an project with the given title."""
        project = Project.objects.create(title=title, is_public=public)
        status = (
            PublishingStatus.STATUS_PUBLISHED if published else PublishingStatus.STATUS_UNPUBLISHED
        )
        project.publishingstatus.status = status
        project.publishingstatus.save(update_fields=['status'])
        return project

    @staticmethod
    def create_project_update(project, user, title, text):
        """Create a project update for the specified project by the given user."""
        return ProjectUpdate.objects.create(
            title=title, text=text, user=user, project=project)

    @staticmethod
    def create_report(report_name, organisation=None, is_org_report=False, url=None):
        if url is None:
            url = '/{organisation}/?format={format}' if is_org_report else '/{project}/?format={format}'
        report = Report.objects.create(
            name=report_name, title=report_name, url=url)
        if organisation is not None:
            report.organisations.add(organisation)
        return report

    @staticmethod
    def create_project_hierarchy(organisation, root_project, max_depth):
        BaseTestCase.make_partner(root_project, organisation, Partnership.IATI_REPORTING_ORGANISATION)
        return ProjectHierarchy.objects.create(root_project=root_project, max_depth=max_depth)

    @staticmethod
    def make_parent(parent: Project, project: Project):
        project.set_parent(parent, update_descendants=False)
        project.save()

    @staticmethod
    def make_partner(project, org, role=None):
        return Partnership.objects.create(project=project, organisation=org, iati_organisation_role=role)

    @staticmethod
    def make_org_admin(user, org):
        return BaseTestCase.make_employment(user, org, 'Admins')

    @staticmethod
    def make_org_project_editor(user, org):
        return BaseTestCase.make_employment(user, org, 'Project Editors')

    @staticmethod
    def make_org_me_manager(user, org):
        return BaseTestCase.make_employment(user, org, 'M&E Managers')

    @staticmethod
    def make_org_user_manager(user, org):
        return BaseTestCase.make_employment(user, org, 'User Managers')

    @staticmethod
    def make_employment(user, org, group_name):
        group = Group.objects.get(name=group_name)
        return Employment.objects.create(user=user, organisation=org, group=group, is_approved=True)

    @staticmethod
    def make_project_role(user, project, group_name):
        group = Group.objects.get(name=group_name)
        return ProjectRole.objects.create(user=user, project=project, group=group)

    @staticmethod
    def create_program(title, org=None):
        if org is None:
            org = BaseTestCase.create_organisation('Akvo')
        program = BaseTestCase.create_project(title)
        BaseTestCase.create_project_hierarchy(org, program, 2)
        return program

    @staticmethod
    def create_contributor(title, lead_project):
        contributor = BaseTestCase.create_project(title)
        BaseTestCase.make_parent(lead_project, contributor)
        contributor.import_results()

        return contributor
