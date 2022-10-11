from django.db.models import QuerySet

from akvo.rsr.models import IndicatorPeriod
from akvo.rsr.models.aggregation_job import IndicatorUpdateAggregationJob
from akvo.rsr.models.cron_job import CronJobMixin


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
