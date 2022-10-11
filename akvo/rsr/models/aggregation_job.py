from django.db import models

from akvo.rsr.models.cron_job import CronJobMixin


class PeriodUpdateAggregationJob(CronJobMixin):
    period_update = models.ForeignKey("IndicatorPeriod", on_delete=models.CASCADE)
