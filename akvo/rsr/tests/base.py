# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import logging

from datetime import datetime
from unittest import mock
from django.conf import settings
from django.contrib.auth import user_login_failed
from django.contrib.auth.models import Group
from django.http import HttpRequest
from django.test import TestCase, Client, override_settings
from django.utils.timezone import is_naive, make_aware

from akvo.rsr.models import (
    User, Employment, Organisation, Project, Partnership, PublishingStatus,
    Report, ProjectUpdate, ProjectHierarchy, ProjectRole
)
from akvo.utils import check_auth_groups


class MemoryMonitoringTestMixin:
    """
    Mixin to disable memory monitoring and clear application state for test isolation.

    This mixin ensures that memory monitoring middleware doesn't interfere with tests
    and that application-level state is properly cleared between test runs to prevent
    memory leaks and test contamination.

    Usage:
        class MyTestCase(MemoryMonitoringTestMixin, TestCase):
            def setUp(self):
                super().setUp()
                # your test setup code
    """

    def setUp(self):
        super().setUp()
        # Clear application state to ensure test isolation
        self._clear_application_state()

    def tearDown(self):
        super().tearDown()
        # Clean up application state after each test
        self._clear_application_state()

    def _clear_application_state(self):
        """Clear application-level state that can persist between tests"""
        # Clear cache state
        from django.core.cache import cache
        cache.clear()

        # Clear deletion tracker
        try:
            from akvo.rsr.models.project import DELETION_SET
            DELETION_SET.clear_all()
        except ImportError:
            # Handle case where deletion tracker isn't available
            pass

        # Clear any TTL cache state
        try:
            from akvo.rsr.cache_management import cache_manager
            cache_manager.clear_all()
        except (ImportError, AttributeError):
            # Handle case where cache manager isn't available or doesn't have clear_all
            pass

        # Force garbage collection to prevent memory accumulation
        import gc
        gc.collect()


# Decorator to disable memory monitoring for test classes
memory_monitoring_test_settings = override_settings(
    # Disable memory monitoring during tests to prevent memory leaks
    RSR_MEMORY_MONITORING_ENABLED=False,
    RSR_LEAK_DETECTION_ENABLED=False,
    RSR_CACHE_METRICS_ENABLED=False,
    RSR_PROFILING_ENABLED=False,
    RSR_PROMETHEUS_METRICS_ENABLED=False,
    RSR_MEMORY_DETAILED_TRACKING=False,
)


@memory_monitoring_test_settings
class BaseTestCase(MemoryMonitoringTestMixin, TestCase):
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
        super().setUp()  # This calls the mixin's setUp method
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
    def _create_project_at(title, public, created_at):
        """Private internal method to create a project with mocked created_at datetime."""
        with mock.patch('django.utils.timezone.now') as mocked_now:
            mocked_now.return_value = created_at
            return Project.objects.create(title=title, is_public=public)

    @staticmethod
    def create_project(title, published=True, public=True, created_at=None):
        """Create a project with the given title."""
        if isinstance(created_at, datetime):
            project = BaseTestCase._create_project_at(
                title,
                public,
                make_aware(created_at) if is_naive(created_at) else created_at
            )
        else:
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
        project.set_parent(parent)
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
    def create_program(title, org=None) -> Project:
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
