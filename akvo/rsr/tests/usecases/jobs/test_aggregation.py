import datetime

from akvo.rsr.models import Indicator, IndicatorPeriod, Result, User
from akvo.rsr.models.aggregation_job import IndicatorUpdateAggregationJob
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

        self.project = self.create_project('Test project')

        # Create results framework
        self.result = Result.objects.create(
            project=self.project, title='Result #1', type='1'
        )
        self.indicator = Indicator.objects.create(
            result=self.result, title='Indicator #1'
        )
        self.period = IndicatorPeriod.objects.create(
            indicator=self.indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="100"
        )
        self.job = IndicatorUpdateAggregationJob.objects.create(period=self.period, program=self.project)


class JobStatusTestCase(AggregationJobBaseTests):

    def test_status_change(self):
        """
        Ensure that setting a status and querying for it works
        """
        statuses = [status.name for status in IndicatorUpdateAggregationJob.Status]

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
        new_job = usecases.schedule_aggregation_job(self.period)

        scheduled_jobs = usecases.get_scheduled_jobs()
        self.assertEqual(scheduled_jobs.count(), 1)
        self.assertEqual(scheduled_jobs.first(), new_job)

    def test_existing_period_job(self):
        """If a job is already scheduled, it should only be updated"""
        job = usecases.schedule_aggregation_job(self.period)

        scheduled_jobs = usecases.get_scheduled_jobs()
        self.assertEqual(scheduled_jobs.count(), 1)
        self.assertEqual(scheduled_jobs.first(), job)
        self.assertEqual(self.job, job)
        self.assertNotEqual(self.job.updated_at, job.updated_at)


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
