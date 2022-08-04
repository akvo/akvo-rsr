# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import timedelta
from django.utils.timezone import now
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import IatiActivityValidationJob, IatiOrganisationValidationJob
from akvo.rsr.usecases.iati_validation import schedule_iati_activity_validation, schedule_iati_organisation_validation


class ScheduleIatiActivityValidationTestCase(BaseTestCase):
    def setUp(self):
        self.project = self.create_project('Test project')

    def test_add_new_job(self):
        schedule_at = now() + timedelta(minutes=1)
        schedule_iati_activity_validation(self.project, schedule_at)
        self.assertEqual(1, IatiActivityValidationJob.objects.filter(project=self.project).count())
        self.assertEqual(schedule_at, IatiActivityValidationJob.objects.filter(project=self.project).first().scheduled_at)

    def test_add_before_previous_job_started(self):
        IatiActivityValidationJob.objects.create(project=self.project, scheduled_at=now() - timedelta(seconds=1))
        schedule_iati_activity_validation(self.project)
        self.assertEqual(1, IatiActivityValidationJob.objects.filter(project=self.project).count())

    def test_add_after_previous_job_started(self):
        IatiActivityValidationJob.objects.create(
            project=self.project,
            scheduled_at=now() - timedelta(seconds=2),
            started_at=now() - timedelta(seconds=1)
        )
        schedule_iati_activity_validation(self.project)
        self.assertEqual(2, IatiActivityValidationJob.objects.filter(project=self.project).count())


class ScheduleIatiOrganisationValidationTestCase(BaseTestCase):
    def setUp(self):
        self.org = self.create_organisation('Test org')

    def test_add_new_job(self):
        schedule_at = now() + timedelta(minutes=1)
        schedule_iati_organisation_validation(self.org, schedule_at)
        self.assertEqual(1, IatiOrganisationValidationJob.objects.filter(organisation=self.org).count())
        self.assertEqual(schedule_at, IatiOrganisationValidationJob.objects.filter(organisation=self.org).first().scheduled_at)

    def test_add_before_previous_job_started(self):
        IatiOrganisationValidationJob.objects.create(organisation=self.org, scheduled_at=now() - timedelta(seconds=1))
        schedule_iati_organisation_validation(self.org)
        self.assertEqual(1, IatiOrganisationValidationJob.objects.filter(organisation=self.org).count())

    def test_add_after_previous_job_started(self):
        IatiOrganisationValidationJob.objects.create(
            organisation=self.org,
            scheduled_at=now() - timedelta(seconds=2),
            started_at=now() - timedelta(seconds=1)
        )
        schedule_iati_organisation_validation(self.org)
        self.assertEqual(2, IatiOrganisationValidationJob.objects.filter(organisation=self.org).count())
