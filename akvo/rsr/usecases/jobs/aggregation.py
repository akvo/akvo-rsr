from django.db.models import QuerySet
from django.db.transaction import atomic
from typing import List

from akvo.rsr.models import IndicatorPeriod
from akvo.rsr.models.aggregation_job import IndicatorUpdateAggregationJob
from akvo.rsr.models.cron_job import CronJobMixin
from akvo.rsr.usecases.jobs.cron import is_job_dead


def get_scheduled_jobs() -> QuerySet[IndicatorUpdateAggregationJob]:
    return IndicatorUpdateAggregationJob.objects.filter(
        status=CronJobMixin.Status.SCHEDULED,
    )


def get_running_jobs() -> QuerySet[IndicatorUpdateAggregationJob]:
    return IndicatorUpdateAggregationJob.objects.filter(
        status=CronJobMixin.Status.RUNNING,
    )


def get_failed_jobs() -> QuerySet[IndicatorUpdateAggregationJob]:
    return IndicatorUpdateAggregationJob.objects.filter(
        status=CronJobMixin.Status.FAILED,
    )


def get_maxxed_jobs() -> QuerySet[IndicatorUpdateAggregationJob]:
    return IndicatorUpdateAggregationJob.objects.filter(
        status=CronJobMixin.Status.MAXXED,
    )


def get_finished_jobs() -> QuerySet[IndicatorUpdateAggregationJob]:
    return IndicatorUpdateAggregationJob.objects.filter(
        status=CronJobMixin.Status.FINISHED,
    )


def schedule_aggregation_job(period: IndicatorPeriod) -> IndicatorUpdateAggregationJob:
    """
    Schedule a job for the period to be aggregated upwards if no job exists
    """
    if existing_job := get_scheduled_jobs().filter(period=period).first():
        existing_job.save()
        return existing_job

    program = period.indicator.result.project.ancestor()
    return IndicatorUpdateAggregationJob.objects.create(period=period, program=program)


def execute_aggregation_jobs():
    """
    Call the aggregation function for each aggregation job
    """
    handle_failed_jobs()

    scheduled_jobs = get_scheduled_jobs()
    for scheduled_job in scheduled_jobs:
        with atomic():
            scheduled_job.mark_running()
            try:
                run_aggregation(scheduled_job.period)
                scheduled_job.mark_finished()
            except Exception as e:
                scheduled_job.mark_failed()
                email_failed_job_owner(scheduled_job, str(e))


@atomic
def handle_failed_jobs():
    """Identify failed jobs, notify owners, and reschedule them"""
    fail_dead_jobs()
    failed_jobs = get_failed_jobs()

    for failed_job in failed_jobs:
        email_failed_job_owner(failed_job, "Job died")

        failed_job.mark_scheduled()


@atomic
def fail_dead_jobs() -> List[IndicatorUpdateAggregationJob]:
    """
    Find jobs that are supposed to be running but with a dead process and fail them
    """
    dead_jobs = []
    for running_job in get_running_jobs():
        if not is_job_dead(running_job):
            continue
        running_job.mark_failed()
        dead_jobs.append(running_job)

    return dead_jobs


def email_failed_job_owner(failed_job: IndicatorUpdateAggregationJob, reason: str):
    raise NotImplementedError()


def run_aggregation(period: IndicatorPeriod):
    # TODO: Implement
    raise NotImplementedError()
