import datetime

from unittest.mock import patch, MagicMock

from django.core import mail

from akvo.rsr.models import Indicator, IndicatorPeriod, Result, User
from akvo.rsr.models.aggregation_job import IndicatorPeriodAggregationJob
from akvo.rsr.models.cron_job import CronJobMixin
from akvo.rsr.permissions import GROUP_NAME_ME_MANAGERS
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.usecases.jobs import aggregation as usecases
from akvo.rsr.usecases.jobs.cron import is_job_dead


class AggregationJobBaseTests(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_superuser(
            username="Super user",
            email="superuser.results@test.akvo.org",
            password="password"
        )

        self.project, self.org = self._make_project("Main")

        # Create results framework
        self.result, self.indicator, self.period = self._make_results_framework(self.project)

        self.job = IndicatorPeriodAggregationJob.objects.create(period=self.period, root_period=self.period)

    def _make_project(self, name, public=True):
        project = self.create_project(f"{name} project", public=public)
        org = self.create_organisation(f"{name} org")
        project.set_reporting_org(org)

        return project, org

    def _make_results_framework(self, project):
        result = Result.objects.create(
            project=project, title='Result #1', type='1'
        )
        indicator = Indicator.objects.create(
            result=result, title='Indicator #1'
        )
        period = IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="100"
        )
        return result, indicator, period


class JobStatusTestCase(AggregationJobBaseTests):

    def test_status_change(self):
        """
        Ensure that setting a status and querying for it works
        """
        statuses = [status.name for status in IndicatorPeriodAggregationJob.Status]

        for status in statuses:
            with self.subTest(status):
                _status = status.lower()

                # Mark the status
                getattr(self.job, f"mark_{_status}")()

                # Check the retrieval
                jobs = getattr(usecases, f"get_{_status}_jobs")()
                self.assertEqual(self.job, jobs.first(), f"{_status} not found in its query")

                # Check other it's not in the other statuses
                status_set = set(statuses)
                status_set.remove(status)

                for other_status in status_set:
                    _other_status = other_status.lower()
                    jobs = getattr(usecases, f"get_{_other_status}_jobs")()
                    self.assertIsNone(jobs.first(), f"{_status} found in {_other_status} query")


class RunningJobTestCase(AggregationJobBaseTests):
    def setUp(self):
        super().setUp()
        self.job.mark_running()

    def test_pid_set(self):
        self.assertIsNotNone(self.job.pid)

    def test_is_alive(self):
        self.assertFalse(is_job_dead(self.job))

    def test_is_dead(self):
        self.job.pid = 1_000_000
        self.job.save()

        self.assertTrue(is_job_dead(self.job))


class FailedJobTestCase(AggregationJobBaseTests):

    def test_pid_and_attempts_attrs(self):
        self.job.mark_failed()

        self.assertIsNone(self.job.pid)
        self.assertEqual(self.job.attempts, 1)


class FinishedJobTestCase(AggregationJobBaseTests):

    def test_pid_and_attempts_attrs(self):
        self.job.mark_finished()

        self.assertIsNone(self.job.pid)
        self.assertEqual(self.job.attempts, 1)


class AggregationJobScheduling(AggregationJobBaseTests):

    def test_no_existing_job(self):
        """Without an existing job, a new one should be created"""
        self.job.delete()
        new_jobs = usecases.schedule_aggregation_jobs(self.period)

        scheduled_jobs = usecases.get_scheduled_jobs()
        self.assertEqual(scheduled_jobs.count(), 1)
        self.assertEqual(scheduled_jobs.first(), new_jobs[0])

    def test_existing_period_job(self):
        """If a job is already scheduled, it should only be updated"""
        jobs = usecases.schedule_aggregation_jobs(self.period)

        scheduled_jobs = usecases.get_scheduled_jobs()
        self.assertEqual(scheduled_jobs.count(), 1)
        self.assertEqual(scheduled_jobs.first(), jobs[0])
        self.assertEqual(self.job, jobs[0])
        self.assertNotEqual(self.job.updated_at, jobs[0].updated_at)


class JobSchedullingOnCumulativeIndicator(AggregationJobBaseTests):
    def setUp(self):
        super().setUp()
        self.indicator.cumulative = True
        self.indicator.save()

        self.period2 = IndicatorPeriod.objects.create(
            indicator=self.indicator,
            period_start=datetime.date.today() + datetime.timedelta(days=2),
            period_end=datetime.date.today() + datetime.timedelta(days=3),
            target_value=120
        )

    def test_no_existing_job(self):
        """Should create jobs for the given period and subsequent periods"""
        self.job.delete()
        usecases.schedule_aggregation_jobs(self.period)

        scheduled_jobs = usecases.get_scheduled_jobs()
        self.assertEqual(scheduled_jobs.count(), 2)
        self.assertEqual([j.period for j in scheduled_jobs], [self.period, self.period2])

    def test_existing_period_job(self):
        """Should only create jobs for periods that don't have it yet"""
        usecases.schedule_aggregation_jobs(self.period)

        scheduled_jobs = usecases.get_scheduled_jobs()
        self.assertEqual(scheduled_jobs.count(), 2)
        self.assertEqual([j.period for j in scheduled_jobs], [self.period, self.period2])
        existing_job = next(j for j in scheduled_jobs if j == self.job)
        self.assertNotEqual(self.job.updated_at, existing_job.updated_at)


class FailDeadJobTest(AggregationJobBaseTests):

    def test_with_dead_job(self):
        # Mock a failed job
        self.job.mark_running()
        self.job.pid = 1_000_000
        self.job.save()

        dead_jobs = usecases.fail_dead_jobs()

        self.assertListEqual(dead_jobs, [self.job])

    def test_with_live_job(self):
        self.job.mark_running()

        dead_jobs = usecases.fail_dead_jobs()

        self.assertListEqual(dead_jobs, [])


class AggregationJobRunnerTestCase(AggregationJobBaseTests):

    def setUp(self):
        super().setUp()

        # Employ to receive failed job email
        employment = self.make_employment(self.user, self.org, GROUP_NAME_ME_MANAGERS)
        employment.receives_indicator_aggregation_emails = True
        employment.save()

        # Employ user who won't receive the failed job email
        self.make_employment(self.create_user("another_user@doing.test"), self.org, GROUP_NAME_ME_MANAGERS)

        # Employment creation sends out emails that we don't care about
        mail.outbox = []

    def test_finished_jobs(self):
        usecases.execute_aggregation_jobs()
        self.assertEqual(0, usecases.get_scheduled_jobs().count())
        self.assertEqual(1, usecases.get_finished_jobs().count())

        # Make sure no success email was sent out
        self.assertEqual(len(mail.outbox), 0)

    def test_failed_jobs(self):
        with patch('akvo.rsr.usecases.jobs.aggregation.run_aggregation',
                   new=MagicMock(side_effect=Exception('Fail job'))):
            usecases.execute_aggregation_jobs()
        self.assertEqual(0, usecases.get_scheduled_jobs().count())
        self.assertEqual(0, usecases.get_finished_jobs().count())
        self.assertEqual(1, usecases.get_failed_jobs().count())

        # Ensure the failed job email was sent out
        self.assertEqual(len(mail.outbox), 1)
        msg = mail.outbox[0]
        self.assertEqual(msg.to, [self.user.email])
        self.assertEqual(msg.subject, "An indicator aggregation job failed")

    def test_success_after_failure(self):
        """A job that succeeds after previously failing should send out a success email"""
        with patch('akvo.rsr.usecases.jobs.aggregation.run_aggregation',
                   new=MagicMock(side_effect=Exception('Fail job'))):
            usecases.execute_aggregation_jobs()

        # Rerun successfully
        usecases.execute_aggregation_jobs()

        # Ensure the success job email was sent out
        self.assertEqual(len(mail.outbox), 2)
        msg = mail.outbox[1]
        self.assertEqual(msg.to, [self.user.email])
        self.assertEqual(msg.subject, "Previously failed indicator aggregation job has succeeded")


class HandleFailedJobTestCase(AggregationJobBaseTests):
    def setUp(self):
        super().setUp()
        self.job.status = IndicatorPeriodAggregationJob.Status.FAILED
        self.job.attempts = usecases.MAX_ATTEMPTS - 1
        self.job.save()

    def test_mark_scheduled(self):
        usecases.handle_failed_jobs()
        self.job.refresh_from_db()
        self.assertEqual(4, self.job.attempts)
        self.assertEqual(CronJobMixin.Status.SCHEDULED, self.job.status)

    def test_mark_maxxed(self):
        self.job.attempts = usecases.MAX_ATTEMPTS
        self.job.save()
        usecases.handle_failed_jobs()
        self.job.refresh_from_db()
        self.assertEqual(5, self.job.attempts)
        self.assertEqual(CronJobMixin.Status.MAXXED, self.job.status)
