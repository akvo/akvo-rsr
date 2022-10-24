from __future__ import annotations

import logging
from typing import List, TYPE_CHECKING

from django.db.models import QuerySet
from django.db.transaction import atomic

from akvo.utils import rsr_send_mail_to_users

if TYPE_CHECKING:
    from akvo.rsr.models import IndicatorPeriod

from akvo.rsr.models.aggregation_job import IndicatorPeriodAggregationJob
from akvo.rsr.models.cron_job import CronJobMixin
from akvo.rsr.usecases.period_update_aggregation import aggregate
from akvo.rsr.usecases.jobs.cron import is_job_dead

logger = logging.getLogger(__name__)


def get_scheduled_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return IndicatorPeriodAggregationJob.objects.filter(
        status=CronJobMixin.Status.SCHEDULED,
    )


def get_running_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return IndicatorPeriodAggregationJob.objects.filter(
        status=CronJobMixin.Status.RUNNING,
    )


def get_failed_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return IndicatorPeriodAggregationJob.objects.filter(
        status=CronJobMixin.Status.FAILED,
    )


def get_maxxed_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return IndicatorPeriodAggregationJob.objects.filter(
        status=CronJobMixin.Status.MAXXED,
    )


def get_finished_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return IndicatorPeriodAggregationJob.objects.filter(
        status=CronJobMixin.Status.FINISHED,
    )


def schedule_aggregation_job(period: IndicatorPeriod) -> IndicatorPeriodAggregationJob:
    """
    Schedule a job for the period to be aggregated upwards if no job exists
    """
    if existing_job := get_scheduled_jobs().filter(period=period).first():
        existing_job.save()
        return existing_job

    program = period.indicator.result.project.ancestor()
    return IndicatorPeriodAggregationJob.objects.create(period=period, program=program)


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
            except:
                scheduled_job.mark_failed()
                # Only email them the first time
                if scheduled_job.attempts <= 1:
                    email_failed_job_owners(scheduled_job)
                logger.error("Failed executing aggregation job %s", scheduled_job.id)


@atomic
def handle_failed_jobs():
    """Identify failed jobs, notify owners, and reschedule them"""
    fail_dead_jobs()
    failed_jobs = get_failed_jobs()

    for failed_job in failed_jobs:
        email_failed_job_owners(failed_job)
        failed_job.mark_scheduled()


@atomic
def fail_dead_jobs() -> List[IndicatorPeriodAggregationJob]:
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


def email_failed_job_owners(failed_job: IndicatorPeriodAggregationJob):
    recipients = failed_job.program.primary_organisation.employees.filter(
        receives_indicator_aggregation_emails=True
    ).select_related("user")
    rsr_send_mail_to_users(
        [recipient.user for recipient in recipients],
        subject="indicator_aggregation/fail_subject.txt",
        message="indicator_aggregation/fail_message.html",
        msg_context={
            "indicator": failed_job.period.indicator,
            "program": failed_job.program,
        }
    )


def run_aggregation(period: IndicatorPeriod):
    aggregate(period)
