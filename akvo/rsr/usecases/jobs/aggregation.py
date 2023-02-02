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

MAX_ATTEMPTS = 5


def get_scheduled_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return base_get_jobs().filter(status=CronJobMixin.Status.SCHEDULED)


def get_running_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return base_get_jobs().filter(status=CronJobMixin.Status.RUNNING)


def get_failed_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return base_get_jobs().filter(status=CronJobMixin.Status.FAILED)


def get_maxxed_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return base_get_jobs().filter(status=CronJobMixin.Status.MAXXED)


def get_finished_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return base_get_jobs().filter(status=CronJobMixin.Status.FINISHED)


def base_get_jobs() -> QuerySet[IndicatorPeriodAggregationJob]:
    return IndicatorPeriodAggregationJob.objects.select_related("period__indicator")


def schedule_aggregation_job(period: IndicatorPeriod) -> IndicatorPeriodAggregationJob:
    """
    Schedule a job for the period to be aggregated upwards if no job exists
    """
    logger.info("Scheduling indicator aggregation job for %s: %s", period, period.indicator.title)
    if existing_job := get_scheduled_jobs().filter(period=period).first():
        existing_job.save()
        return existing_job

    root_period = period.get_root_period()
    return IndicatorPeriodAggregationJob.objects.create(period=period, root_period=root_period)


def execute_aggregation_jobs():
    """
    Call the aggregation function for each aggregation job
    """
    handle_failed_jobs()
    logger.info("Started with %s jobs", get_scheduled_jobs().count())
    while (scheduled_job := get_scheduled_jobs().first()):
        logger.info(
            "Running job %s for period '%s - %s' and indicator: %s",
            scheduled_job.id,
            scheduled_job.period.period_start,
            scheduled_job.period.period_end,
            scheduled_job.period.indicator,
        )
        scheduled_job.mark_running()
        try:
            run_aggregation(scheduled_job.period)
            scheduled_job.mark_finished()
        except Exception as e:
            scheduled_job.mark_failed()
            # Only send job failure email the first time
            if scheduled_job.attempts <= 1:
                email_job_owners(
                    scheduled_job,
                    "indicator_aggregation/fail_subject.txt",
                    "indicator_aggregation/fail_message.html",
                    reason=str(e)
                )
            logger.error("Failed executing aggregation job %s: %s", scheduled_job.id, e)
        else:
            # Send out success email if job previously failed
            if scheduled_job.attempts > 1:
                email_job_owners(
                    scheduled_job,
                    "indicator_aggregation/success_subject.txt",
                    "indicator_aggregation/success_message.html",
                )


def run_aggregation(period: IndicatorPeriod):
    aggregate(period)


@atomic
def handle_failed_jobs():
    """Identify failed jobs and reschedule them up to max attempts"""
    fail_dead_jobs()
    for failed_job in get_failed_jobs():
        if failed_job.attempts < MAX_ATTEMPTS:
            failed_job.mark_scheduled()
        else:
            failed_job.mark_maxxed()


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

        if running_job.attempts <= 1:
            email_job_owners(
                running_job,
                "indicator_aggregation/fail_subject.txt",
                "indicator_aggregation/fail_message.html",
                reason="Process died",
            )
        logger.warning(
            "Aggregation job died. ID %s. Indicator '%s'",
            running_job.id,
            running_job.period.indicator.title,
        )

    return dead_jobs


def email_job_owners(
        job: IndicatorPeriodAggregationJob,
        subject_template: str, message_template: str,
        reason: str = None
):
    recipients = get_job_recipients(job)
    rsr_send_mail_to_users(
        [recipient.user for recipient in recipients],
        subject=subject_template,
        message=message_template,
        msg_context={
            "indicator": job.period.indicator,
            "root_project": job.root_project,
            "reason": reason,
            "job": job,
            "max_attempts": MAX_ATTEMPTS,
        }
    )


def get_job_recipients(job: IndicatorPeriodAggregationJob):
    return job.root_project.primary_organisation.employees.filter(
        receives_indicator_aggregation_emails=True
    ).select_related("user")
