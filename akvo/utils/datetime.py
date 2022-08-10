from datetime import datetime


def datetime_remove_time(datetime_: datetime) -> datetime:
    """Removes the time components from a datetime effectively making it a date"""
    return datetime_.replace(hour=0, minute=0, second=0)
