# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from datetime import datetime, timedelta

from django.core import management
from django.utils import timezone

from akvo.rsr.models import Indicator, IndicatorPeriod, IndicatorPeriodData, Project, Result
from akvo.rsr.tests.base import BaseTestCase


class CleanupUntitledAndUnpublishedProjectsTestCase(BaseTestCase):

    TWO_DAYS_AGO = timezone.now() - timedelta(days=2)
    SIX_DAYS_AGO = timezone.now() - timedelta(days=6)
    SEVEN_DAYS_AGO = timezone.now() - timedelta(days=7)
    EIGHT_DAYS_AGO = timezone.now() - timedelta(days=8)

    def run_cleanup(self, the_date=None, dry_run=False):
        args = ['-v', '0']
        if isinstance(the_date, datetime):
            args.extend(['--date', the_date.strftime('%Y-%m-%d')])
        if dry_run:
            args.append('--dry-run')
        management.call_command('cleanup_untitled_and_unpublished_projects', *args)

    def make_result(self, project):
        return Result.objects.create(title='Test', project=project)

    def make_period_update(self, project):
        result = self.make_result(project)
        indicator = Indicator.objects.create(title='Test', result=result)
        project_date = project.created_at.date()
        period = IndicatorPeriod.objects.create(period_start=project_date, period_end=project_date + timedelta(days=30), indicator=indicator)
        user = self.create_user('test@akvo.org', 'password', is_admin=True)
        return IndicatorPeriodData.objects.create(period=period, user=user, value=1)


class CleanupOptionsTestCase(CleanupUntitledAndUnpublishedProjectsTestCase):

    def test_cleanup_default_opts(self):
        remove = self.create_project(title='', published=False, created_at=self.EIGHT_DAYS_AGO)
        keep = self.create_project(title='', published=False, created_at=self.SIX_DAYS_AGO)
        self.run_cleanup()
        self.assertFalse(Project.objects.filter(id=remove.id).exists())
        self.assertTrue(Project.objects.filter(id=keep.id).exists())

    def test_cleanup_with_date_option(self):
        remove = self.create_project(title='', published=False, created_at=self.SEVEN_DAYS_AGO)
        keep = self.create_project(title='', published=False, created_at=self.TWO_DAYS_AGO)
        self.run_cleanup(self.SIX_DAYS_AGO)
        self.assertFalse(Project.objects.filter(id=remove.id).exists())
        self.assertTrue(Project.objects.filter(id=keep.id).exists())

    def test_dry_run(self):
        project = self.create_project(title='', published=False, created_at=self.EIGHT_DAYS_AGO)
        self.run_cleanup(dry_run=True)
        self.assertTrue(Project.objects.filter(id=project.id).exists())


class KeepProjectsTestCase(CleanupUntitledAndUnpublishedProjectsTestCase):

    def test_keep_unpublished_project_with_title(self):
        project = self.create_project(title='Test project', published=False, created_at=self.EIGHT_DAYS_AGO)
        self.run_cleanup()
        self.assertTrue(Project.objects.filter(id=project.id).exists())

    def test_keep_untitled_project_with_published_status(self):
        project = self.create_project(title='', published=True, created_at=self.EIGHT_DAYS_AGO)
        self.run_cleanup()
        self.assertTrue(Project.objects.filter(id=project.id).exists())


class HaveRelationshipTestCase(CleanupUntitledAndUnpublishedProjectsTestCase):
    def setUp(self):
        super().setUp()
        self.project = self.create_project(title='', published=False, created_at=self.EIGHT_DAYS_AGO)

    def test_have_period_update(self):
        self.make_period_update(self.project)
        self.run_cleanup()
        self.assertFalse(Project.objects.filter(id=self.project.id).exists())

    def test_have_result(self):
        self.make_result(self.project)
        self.run_cleanup()
        self.assertFalse(Project.objects.filter(id=self.project.id).exists())
