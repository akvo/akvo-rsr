# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from datetime import datetime, timedelta
from unittest import mock
from django.core import management
from django.utils import timezone
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import Project, IatiImport, IatiImportJob, IatiActivityImport, Result, Indicator, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.tests.iati_import.xml_files import IATI_V2_STRING


class DeleteUntitledAndUnpublishedProjectsCommand(BaseTestCase):

    TWO_DAYS_AGO = timezone.now() - timedelta(days=2)
    SEVEN_DAYS_AGO = timezone.now() - timedelta(days=7)

    def delete_before_two_days_ago(self):
        management.call_command('delete_untitled_and_unpublished_projects', self.TWO_DAYS_AGO.strftime('%Y-%m-%d'), '--delete', '--quiet')

    def make_project(self, title='', published=True, created_at=None):
        if type(created_at) != datetime:
            return self.create_project(title, published)

        with mock.patch('django.utils.timezone.now') as mocked_now:
            mocked_now.return_value = created_at
            return self.create_project(title, published)

    def make_iati_activity_import(self, project):
        user = self.create_user('test@akvo.org', 'password', is_admin=True)
        iati_import = IatiImport.objects.create(label='Test', user=user)
        iati_xml_file = NamedTemporaryFile(delete=True)
        iati_xml_file.write(IATI_V2_STRING)
        iati_xml_file.flush()
        iati_import_job = IatiImportJob.objects.create(iati_import=iati_import, iati_xml_file=File(iati_xml_file))
        return IatiActivityImport.objects.create(iati_import_job=iati_import_job, project=project, activity_xml='')

    def make_result(self, project):
        return Result.objects.create(title='Test', project=project)

    def make_period_update(self, project):
        result = self.make_result(project)
        indicator = Indicator.objects.create(title='Test', result=result)
        project_date = project.created_at.date()
        period = IndicatorPeriod.objects.create(period_start=project_date, period_end=project_date + timedelta(days=30), indicator=indicator)
        user = self.create_user('test@akvo.org', 'password', is_admin=True)
        return IndicatorPeriodData.objects.create(period=period, user=user, value=1)


class CreatedBeforeOrAfterGivenDateTestCase(DeleteUntitledAndUnpublishedProjectsCommand):

    def test_keep_after(self):
        project = self.make_project()
        self.delete_before_two_days_ago()
        self.assertTrue(Project.objects.filter(id=project.id).exists())

    def test_remove_before(self):
        project = self.make_project(created_at=self.SEVEN_DAYS_AGO)
        self.delete_before_two_days_ago()
        self.assertFalse(Project.objects.filter(id=project.id).exists())

    def test_remove_unpublished(self):
        project = self.make_project(title='Test project', published=False, created_at=self.SEVEN_DAYS_AGO)
        self.delete_before_two_days_ago()
        self.assertFalse(Project.objects.filter(id=project.id).exists())


class HaveRelationshipTestCase(DeleteUntitledAndUnpublishedProjectsCommand):

    def setUp(self):
        super().setUp()
        self.project = self.make_project(created_at=self.SEVEN_DAYS_AGO)

    def test_have_iati_activity_import(self):
        self.make_iati_activity_import(self.project)
        self.delete_before_two_days_ago()
        self.assertFalse(Project.objects.filter(id=self.project.id).exists())

    def test_have_result(self):
        self.make_result(self.project)
        self.delete_before_two_days_ago()
        self.assertFalse(Project.objects.filter(id=self.project.id).exists())

    def test_have_period_update(self):
        self.make_period_update(self.project)
        self.delete_before_two_days_ago()
        self.assertFalse(Project.objects.filter(id=self.project.id).exists())
