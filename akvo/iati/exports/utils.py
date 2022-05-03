from datetime import datetime

from django.utils import timezone


def make_datetime_aware(dt: datetime):
    last_modified_dt = dt
    if timezone.is_naive(dt):
        last_modified_dt = timezone.make_aware(dt, timezone.get_current_timezone())
    return last_modified_dt
