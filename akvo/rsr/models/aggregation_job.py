from django.db import models

from akvo.rsr.models.cron_job import CronJobMixin


class IndicatorPeriodAggregationJob(CronJobMixin):
    period = models.ForeignKey("IndicatorPeriod", on_delete=models.CASCADE)
    program = models.ForeignKey("Project", on_delete=models.CASCADE)
