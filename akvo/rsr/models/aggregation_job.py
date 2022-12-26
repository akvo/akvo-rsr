from django.db import models

from akvo.rsr.models.cron_job import CronJobMixin


class IndicatorPeriodAggregationJob(CronJobMixin):
    project_relation = "period__indicator__result__project__"

    period = models.ForeignKey(
        "IndicatorPeriod",
        on_delete=models.CASCADE,
        related_name="aggregation_jobs"
    )
    root_period = models.ForeignKey(
        "IndicatorPeriod",
        on_delete=models.CASCADE,
        related_name="child_aggregation_jobs"
    )

    @property
    def project(self):
        return self.period.project

    @property
    def root_project(self):
        return self.root_period.project
