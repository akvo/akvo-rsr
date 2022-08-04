from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import List, Tuple, Optional

from django.utils.timezone import now
from akvo.rsr.models import IatiActivityValidationJob, IatiOrganisationValidationJob


@dataclass(frozen=True)
class RequestRate:
    count: int
    period: timedelta
    even_pace: bool = False


class RateLimiter:
    ''' Limit request to IATI validator API based on the subscription model

    The rate limits can be configured according to the limits specified in
    the subscription model used.

    https://developer.iatistandard.org/subscriptions
    '''

    def __init__(self, rates: List[RequestRate]):
        self.rates = rates

    def is_allowed(self) -> bool:
        for rate in self.rates:
            if not self._apply_rate(rate):
                return False
        return True

    def _apply_rate(self, rate: RequestRate) -> bool:
        if rate.count == 0 or rate.period.total_seconds() == 0:
            return True
        finished_at = now() - rate.period
        count, latest = self._get_finished_jobs_summary(finished_at)
        if count >= rate.count:
            return False
        if not rate.even_pace:
            return True
        # Spread the requests evenly in the given time period
        spacing = timedelta(seconds=rate.period.total_seconds() / rate.count)
        if latest and latest >= now() - spacing:
            return False
        return True

    def _get_finished_jobs_summary(self, finished_at: datetime) -> Tuple[int, Optional[datetime]]:
        activity_jobs = IatiActivityValidationJob.objects.filter(finished_at__gt=finished_at)
        organisation_jobs = IatiOrganisationValidationJob.objects.filter(finished_at__gt=finished_at)
        job_count = activity_jobs.count() + organisation_jobs.count()
        datetimes = [j.finished_at for j in [
            activity_jobs.order_by('-finished_at').first(),
            organisation_jobs.order_by('-finished_at').first()
        ] if j]
        latest = max(datetimes) if datetimes else None
        return (job_count, latest)
