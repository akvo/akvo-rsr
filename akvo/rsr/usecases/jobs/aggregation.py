from django.db.models import QuerySet

from akvo.rsr.models.aggregation_job import PeriodUpdateAggregationJob
from akvo.rsr.models.cron_job import CronJobMixin


def get_scheduled_jobs() -> QuerySet[PeriodUpdateAggregationJob]:
    return PeriodUpdateAggregationJob.objects.filter(
        status=CronJobMixin.Status.SCHEDULED,
    )


def get_running_jobs() -> QuerySet[PeriodUpdateAggregationJob]:
    return PeriodUpdateAggregationJob.objects.filter(
        status=CronJobMixin.Status.RUNNING,
    )


def get_failed_jobs() -> QuerySet[PeriodUpdateAggregationJob]:
    return PeriodUpdateAggregationJob.objects.filter(
        status=CronJobMixin.Status.FAILED,
    )


def get_finished_jobs() -> QuerySet[PeriodUpdateAggregationJob]:
    return PeriodUpdateAggregationJob.objects.filter(
        status=CronJobMixin.Status.FINISHED,
    )
