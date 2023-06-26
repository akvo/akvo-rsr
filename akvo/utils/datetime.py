from datetime import datetime
from django.utils import timezone


def datetime_remove_time(datetime_: datetime) -> datetime:
    """Removes the time components from a datetime effectively making it a date"""
    return datetime_.replace(hour=0, minute=0, second=0)


def make_tz_aware(dt: datetime):
    return timezone.make_aware(dt) if timezone.is_naive(dt) else dt
