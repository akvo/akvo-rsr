# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import timedelta, datetime
from unittest.mock import patch

from django.core import mail
from django.test import override_settings
from django.utils.timezone import now

from akvo.iati.iati_validator import IATIValidationResult, IATIValidatorException
from akvo.rsr.models import IatiActivityValidationJob, IatiOrganisationValidationJob
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.usecases import iati_validation as runner
from akvo.rsr.usecases.iati_validation.rate_limiter import RateLimiter, RequestRate
from akvo.rsr.usecases.iati_validation.internal_validator_runner import CheckResult
from akvo.rsr.usecases.iati_validation.iati_validation_job_runner import get_iati_activity_xml_doc, get_iati_organisation_xml_doc

DUMMY_VALIDATION_RESULT = IATIValidationResult(error_count=0, warning_count=0, data={})
DUMMY_CHECK_RESULT = CheckResult(error_count=0, warning_count=0, data=[])

FAKE_ERROR_VALIDATION_RESULT = IATIValidationResult(error_count=1, warning_count=0, data={'error': 'dummy'})
FAKE_ERROR_CHECK_RESULT = CheckResult(error_count=1, warning_count=0, data=[('error', 'dummy')])


class IATIValidatorRateLimiterTestCase(BaseTestCase):

    def setUp(self):
        short_rate = RequestRate(count=3, period=timedelta(seconds=10), even_pace=True)
        long_rate = RequestRate(count=6, period=timedelta(seconds=30))
        self.limiter = RateLimiter([short_rate, long_rate])
        self.project = self.create_project('Test project')
        self.org = self.create_organisation('Test org')

    def create_started_activity_job(self, project, started_at: datetime) -> IatiActivityValidationJob:
        return IatiActivityValidationJob.objects.create(
            project=project,
            scheduled_at=started_at - timedelta(minutes=1),
            started_at=started_at
        )

    def create_started_organisation_job(self, organisation, started_at: datetime) -> IatiOrganisationValidationJob:
        return IatiOrganisationValidationJob.objects.create(
            organisation=organisation,
            scheduled_at=started_at - timedelta(minutes=1),
            started_at=started_at
        )

    def test_pre_run(self):
        ''' no request sent yet '''
        self.assertTrue(self.limiter.is_allowed())

    def test_even_pace_throttled(self):
        ''' request sent before the "spread requests evenly" duration ended '''
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=3))
        self.assertFalse(self.limiter.is_allowed())

    def test_even_pace_requests_allowed(self):
        ''' request sent after the "spread requests evenly" duration ended '''
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=4))
        self.assertTrue(self.limiter.is_allowed())

    def test_short_rate_throttled(self):
        ''' request sent when it exceeds the short rate limit '''
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=9))
        self.create_started_activity_job(self.project, started_at=now() - timedelta(seconds=6))
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=3))
        self.assertFalse(self.limiter.is_allowed())

    def test_short_rate_allowed(self):
        ''' request sent in the next short rate period '''
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=10))
        self.create_started_activity_job(self.project, started_at=now() - timedelta(seconds=7))
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=4))
        self.assertTrue(self.limiter.is_allowed())

    def test_long_rate_throttled(self):
        ''' request sent when it exceeds the long rate limit '''
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=29))
        self.create_started_activity_job(self.project, started_at=now() - timedelta(seconds=26))
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=23))
        self.create_started_activity_job(self.project, started_at=now() - timedelta(seconds=20))
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=17))
        self.create_started_activity_job(self.project, started_at=now() - timedelta(seconds=14))
        self.assertFalse(self.limiter.is_allowed())

    def test_long_rate_allowed(self):
        ''' request sent in the next long rate period '''
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=30))
        self.create_started_activity_job(self.project, started_at=now() - timedelta(seconds=27))
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=24))
        self.create_started_activity_job(self.project, started_at=now() - timedelta(seconds=21))
        self.create_started_organisation_job(self.org, started_at=now() - timedelta(seconds=18))
        self.create_started_activity_job(self.project, started_at=now() - timedelta(seconds=15))
        self.assertTrue(self.limiter.is_allowed())


class RunIatiOrganisationValidationJobTestCase(BaseTestCase):
    def setUp(self):
        self.org = self.create_organisation('Test org')
        self.a_second_ago = now() - timedelta(seconds=1)
        self.a_minute_ago = now() - timedelta(minutes=1)
        mail.outbox = []

    @patch.object(runner.validator, 'validate')
    def test_ignore_finished_job(self, mock_validate):
        IatiOrganisationValidationJob.objects.create(
            organisation=self.org,
            scheduled_at=self.a_minute_ago,
            started_at=self.a_second_ago,
            finished_at=now()
        )
        runner.run_iati_organisation_validation_job(now())
        mock_validate.assert_not_called()

    @patch.object(runner.validator, 'validate')
    def test_ignore_running_job(self, mock_validate):
        IatiOrganisationValidationJob.objects.create(
            organisation=self.org,
            scheduled_at=self.a_minute_ago - timedelta(seconds=runner.VALIDATOR_TIMEOUT),
            started_at=now() - timedelta(seconds=runner.VALIDATOR_TIMEOUT),
            attempts=1
        )
        runner.run_iati_organisation_validation_job(now())
        mock_validate.assert_not_called()

    @patch.object(runner.validator, 'validate')
    def test_ignore_failed_job_with_max_attemps(self, mock_validate):
        IatiOrganisationValidationJob.objects.create(
            organisation=self.org,
            scheduled_at=self.a_minute_ago,
            started_at=self.a_second_ago,
            attempts=runner.VALIDATOR_MAX_ATTEMPTS
        )
        runner.run_iati_organisation_validation_job(now())
        mock_validate.assert_not_called()

    @patch.object(runner.validator, 'validate', side_effect=IATIValidatorException)
    def test_validator_exception(self, _):
        job = IatiOrganisationValidationJob.objects.create(organisation=self.org, scheduled_at=self.a_second_ago)
        runner.run_iati_organisation_validation_job(now())
        job.refresh_from_db()
        self.assertIsNotNone(job.started_at)
        self.assertEqual(1, job.attempts)
        self.assertIsNone(job.finished_at)

    @patch.object(runner.validator, 'validate', return_value=DUMMY_VALIDATION_RESULT)
    def test_call_iati_validator(self, mock_validate):
        job = IatiOrganisationValidationJob.objects.create(organisation=self.org, scheduled_at=self.a_second_ago)
        runner.run_iati_organisation_validation_job(now())
        mock_validate.assert_called_once_with(get_iati_organisation_xml_doc(self.org))
        job.refresh_from_db()
        self.assertIsNotNone(job.started_at)
        self.assertIsNotNone(job.finished_at)

    @patch.object(runner.validator, 'validate', return_value=DUMMY_VALIDATION_RESULT)
    def test_run_oldest_scheduled_at_first(self, _):
        IatiOrganisationValidationJob.objects.create(organisation=self.org, scheduled_at=self.a_second_ago)
        job = IatiOrganisationValidationJob.objects.create(organisation=self.org, scheduled_at=self.a_minute_ago)
        runner.run_iati_organisation_validation_job(now())
        job.refresh_from_db()
        self.assertIsNotNone(job.started_at)
        self.assertIsNotNone(job.finished_at)

    @patch.object(runner.validator, 'validate', return_value=DUMMY_VALIDATION_RESULT)
    def test_retry_failed_job(self, _):
        job = IatiOrganisationValidationJob.objects.create(
            organisation=self.org,
            scheduled_at=self.a_minute_ago - timedelta(seconds=runner.VALIDATOR_TIMEOUT),
            started_at=self.a_minute_ago - timedelta(seconds=runner.VALIDATOR_TIMEOUT),
            attempts=1
        )
        runner.run_iati_organisation_validation_job(now())
        job.refresh_from_db()
        self.assertIsNotNone(job.started_at)
        self.assertIsNotNone(job.finished_at)
        self.assertEqual(2, job.attempts)

    @patch.object(runner.validator, 'validate', return_value=FAKE_ERROR_VALIDATION_RESULT)
    def test_sent_notification_on_errors(self, _):
        IatiOrganisationValidationJob.objects.create(organisation=self.org, scheduled_at=self.a_second_ago)
        recipient = ['admin@akvo.org']
        with override_settings(IATI_ORGANISATION_VALIDATION_ERROR_RECIPIENTS=recipient):
            runner.run_iati_organisation_validation_job(now())
        self.assertEqual(1, len(mail.outbox))
        msg = mail.outbox[0]
        self.assertEqual(recipient, msg.to)

    @patch.object(runner.validator, 'validate', return_value=DUMMY_VALIDATION_RESULT)
    def test_not_sending_notification_on_success(self, _):
        IatiOrganisationValidationJob.objects.create(organisation=self.org, scheduled_at=self.a_second_ago)
        recipient = ['admin@akvo.org']
        with override_settings(IATI_ACTIVITY_VALIDATION_ERROR_RECIPIENTS=recipient):
            runner.run_iati_organisation_validation_job(now())
        self.assertEqual(0, len(mail.outbox))


class RunIatiActivityValidationJobTestCase(BaseTestCase):

    def setUp(self):
        self.project = self.create_project('Test project')
        self.a_second_ago = now() - timedelta(seconds=1)
        self.a_minute_ago = now() - timedelta(minutes=1)
        mail.outbox = []

    @patch.object(runner.validator, 'validate')
    def test_ignore_finished_job(self, mock_validate):
        IatiActivityValidationJob.objects.create(
            project=self.project,
            scheduled_at=self.a_minute_ago,
            started_at=self.a_second_ago,
            finished_at=now()
        )
        runner.run_iati_activity_validation_job(now())
        mock_validate.assert_not_called()

    @patch.object(runner.validator, 'validate')
    def test_ignore_running_job(self, mock_validate):
        IatiActivityValidationJob.objects.create(
            project=self.project,
            scheduled_at=self.a_minute_ago - timedelta(seconds=runner.VALIDATOR_TIMEOUT),
            started_at=now() - timedelta(seconds=runner.VALIDATOR_TIMEOUT),
            attempts=1
        )
        runner.run_iati_activity_validation_job(now())
        mock_validate.assert_not_called()

    @patch.object(runner.validator, 'validate')
    def test_ignore_failed_job_with_max_attemps(self, mock_validate):
        IatiActivityValidationJob.objects.create(
            project=self.project,
            scheduled_at=self.a_minute_ago,
            started_at=self.a_second_ago,
            attempts=runner.VALIDATOR_MAX_ATTEMPTS
        )
        runner.run_iati_activity_validation_job(now())
        mock_validate.assert_not_called()

    @patch.object(runner.validator, 'validate', side_effect=IATIValidatorException)
    def test_validator_exception(self, _):
        job = IatiActivityValidationJob.objects.create(project=self.project, scheduled_at=self.a_second_ago)
        runner.run_iati_activity_validation_job(now())
        job.refresh_from_db()
        self.assertIsNotNone(job.started_at)
        self.assertEqual(1, job.attempts)
        self.assertIsNone(job.finished_at)

    @patch.object(runner.validator, 'validate', return_value=DUMMY_VALIDATION_RESULT)
    def test_call_iati_validator(self, mock_validate):
        job = IatiActivityValidationJob.objects.create(project=self.project, scheduled_at=self.a_second_ago)
        runner.run_iati_activity_validation_job(now())
        mock_validate.assert_called_once_with(get_iati_activity_xml_doc(self.project))
        job.refresh_from_db()
        self.assertIsNotNone(job.started_at)
        self.assertIsNotNone(job.finished_at)

    @patch.object(runner.validator, 'validate', return_value=DUMMY_VALIDATION_RESULT)
    def test_run_oldest_scheduled_at_first(self, _):
        IatiActivityValidationJob.objects.create(project=self.project, scheduled_at=self.a_second_ago)
        job = IatiActivityValidationJob.objects.create(project=self.project, scheduled_at=self.a_minute_ago)
        runner.run_iati_activity_validation_job(now())
        job.refresh_from_db()
        self.assertIsNotNone(job.started_at)
        self.assertIsNotNone(job.finished_at)

    @patch.object(runner.validator, 'validate', return_value=DUMMY_VALIDATION_RESULT)
    def test_retry_failed_job(self, _):
        job = IatiActivityValidationJob.objects.create(
            project=self.project,
            scheduled_at=self.a_minute_ago - timedelta(seconds=runner.VALIDATOR_TIMEOUT),
            started_at=self.a_minute_ago - timedelta(seconds=runner.VALIDATOR_TIMEOUT),
            attempts=1
        )
        runner.run_iati_activity_validation_job(now())
        job.refresh_from_db()
        self.assertIsNotNone(job.started_at)
        self.assertIsNotNone(job.finished_at)
        self.assertEqual(2, job.attempts)

    @patch.object(runner.validator, 'validate', return_value=FAKE_ERROR_VALIDATION_RESULT)
    @patch('akvo.rsr.usecases.iati_validation.run_validation_jobs.run_internal_project_validator', return_value=DUMMY_CHECK_RESULT)
    def test_sent_notification_on_different_error_counts(self, _, __):
        IatiActivityValidationJob.objects.create(project=self.project, scheduled_at=self.a_second_ago)
        recipient = ['admin@akvo.org']
        with override_settings(IATI_ACTIVITY_VALIDATION_ERROR_RECIPIENTS=recipient):
            runner.run_iati_activity_validation_job(now())
        self.assertEqual(1, len(mail.outbox))
        msg = mail.outbox[0]
        self.assertEqual(recipient, msg.to)

    @patch.object(runner.validator, 'validate', return_value=FAKE_ERROR_VALIDATION_RESULT)
    @patch('akvo.rsr.usecases.iati_validation.run_validation_jobs.run_internal_project_validator', return_value=FAKE_ERROR_CHECK_RESULT)
    def test_not_sending_notification_on_same_error_counts(self, _, __):
        IatiActivityValidationJob.objects.create(project=self.project, scheduled_at=self.a_second_ago)
        recipient = ['admin@akvo.org']
        with override_settings(IATI_ACTIVITY_VALIDATION_ERROR_RECIPIENTS=recipient):
            runner.run_iati_activity_validation_job(now())
        self.assertEqual(0, len(mail.outbox))