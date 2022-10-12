import datetime

from akvo.rsr.models import Indicator, IndicatorPeriod, Result, User
from akvo.rsr.models.aggregation_job import IndicatorUpdateAggregationJob
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.usecases.jobs.aggregation import get_failed_jobs, get_finished_jobs, get_running_jobs, get_scheduled_jobs
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


class ScheduledJobTestCase(AggregationJobBaseTests):

    def test_get_scheduled(self):
        self.assertEqual(self.job, get_scheduled_jobs().first())

    def test_not_scheduled(self):
        self.job.mark_running()
        self.assertIsNone(get_scheduled_jobs().first())

        self.job.mark_finished()
        self.assertIsNone(get_scheduled_jobs().first())

        self.job.mark_failed()
        self.assertIsNone(get_scheduled_jobs().first())


class RunningJobTestCase(AggregationJobBaseTests):

    def test_is_running(self):
        self.job.mark_running()

        self.assertEqual(self.job, get_running_jobs().first())
        self.assertIsNotNone(self.job.pid)

    def test_not_running(self):
        self.job.mark_scheduled()
        self.assertIsNone(get_running_jobs().first())

        self.job.mark_finished()
        self.assertIsNone(get_running_jobs().first())

        self.job.mark_failed()
        self.assertIsNone(get_running_jobs().first())

    def test_is_alive(self):
        self.job.mark_running()

        self.assertFalse(is_job_dead(self.job))

    def test_is_dead(self):
        self.job.mark_running()
        self.job.pid = 1_000_000
        self.job.save()

        self.assertTrue(is_job_dead(self.job))


class FailedJobTestCase(AggregationJobBaseTests):

    def test_is_failed(self):
        self.job.mark_failed()

        self.assertEqual(self.job, get_failed_jobs().first())
        self.assertIsNone(self.job.pid)
        self.assertEqual(self.job.attempts, 1)

    def test_not_failed(self):
        self.job.mark_scheduled()
        self.assertIsNone(get_failed_jobs().first())

        self.job.mark_running()
        self.assertIsNone(get_failed_jobs().first())

        self.job.mark_finished()
        self.assertIsNone(get_failed_jobs().first())


class FinishedJobTestCase(AggregationJobBaseTests):

    def test_is_finished(self):
        self.job.mark_finished()

        self.assertEqual(self.job, get_finished_jobs().first())
        self.assertIsNone(self.job.pid)
        self.assertEqual(self.job.attempts, 1)

    def test_not_finished(self):
        self.job.mark_scheduled()
        self.assertIsNone(get_finished_jobs().first())

        self.job.mark_running()
        self.assertIsNone(get_finished_jobs().first())

        self.job.mark_failed()
        self.assertIsNone(get_finished_jobs().first())
