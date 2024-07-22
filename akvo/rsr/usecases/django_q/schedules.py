import logging
from dataclasses import dataclass
from typing import Dict, List, Set

from django.conf import settings
from django.db.models import QuerySet
from django.db.transaction import atomic
from django_q.models import Schedule
from rest_framework.serializers import ModelSerializer

logger = logging.getLogger(__name__)


@dataclass
class SyncAction:
    """
    The operations to be done on the DB in order to sync the django-q schedules from the settings
    with the existing django-q schedules in the DB
    """
    to_add: List[Schedule]
    to_modify: List[Schedule]
    to_delete: List[Schedule]

    def __str__(self):
        return "SyncAction(to_add=%(to_add)s, to_modify=%(to_modify)s, to_delete=%(to_delete)s)" % dict(
            to_add=len(self.to_add),
            to_modify=len(self.to_modify),
            to_delete=len(self.to_delete),
        )


class ScheduleSerializer(ModelSerializer):
    class Meta:
        model = Schedule
        fields = [
            "name",
            "func",
            "args",
            "kwargs",
            "cron",
        ]


def sync_with_settings():
    """
    Synchronizes the django-q schedules in the DB with those defined in the app settings
    """
    schedules = get_setting_schedules()
    logger.info(f"Got {len(schedules)} schedules from settings")
    sync_action = calc_sync(schedules, list(Schedule.objects.all()))
    logger.info(f"Sync actions: {sync_action}")
    db_schedules = apply_sync(sync_action)
    logger.info(f"Schedules in DB {db_schedules.count()}")


def get_setting_schedules() -> List[Schedule]:
    """
    Converts the schedules configuration in the app settings to django-q schedule objects
    """
    data = []
    for key, schedule_conf in settings.AKVO_JOBS.items():
        args = schedule_conf.get("args")
        if args is None:
            args = tuple()
        # Being explicit here as django-q does this implicitly before calling the func
        elif not isinstance(args, tuple):
            args = (args, )
        conf = {
            **schedule_conf,
            "name": key,
            # stored as strings in DB
            "args": str(args),
            "kwargs": str(schedule_conf.get("kwargs") or {}),
        }
        data.append(conf)
    serializer = ScheduleSerializer(data=data, many=True)
    serializer.is_valid(raise_exception=True)
    return [Schedule(schedule_type=Schedule.CRON, **item) for item in serializer.validated_data]


def calc_sync(setting_schedules: List[Schedule], db_schedules: List[Schedule] = None) -> SyncAction:
    """
    Calculates the operations that have to be taken in order to sync the schedules in the settings
     with the schedules in the db
    """
    if db_schedules is None:
        db_schedules = list(Schedule.objects.all())

    in_map: Dict[str, Schedule] = {schedule.name: schedule for schedule in setting_schedules}
    db_map: Dict[str, Schedule] = {schedule.name: schedule for schedule in db_schedules}

    in_set: Set[str] = set(in_map.keys())
    db_set: Set[str] = set(db_map.keys())

    def getter(_dict):
        return lambda item: _dict.get(item)

    to_add = list(map(getter(in_map), in_set - db_set))
    to_delete = list(map(getter(db_map), db_set - in_set))

    # Update the db loaded objects with the fields from the settings
    to_modify = []
    for name in in_set.intersection(db_set):
        db_schedule = db_map[name]
        settings_schedule = in_map[name]

        for field in ScheduleSerializer.Meta.fields:
            setattr(db_schedule, field, getattr(settings_schedule, field))

        to_modify.append(db_schedule)

    return SyncAction(
        to_add=to_add,
        to_modify=to_modify,
        to_delete=to_delete,
    )


@atomic
def apply_sync(action: SyncAction) -> QuerySet[Schedule]:
    """
    Applies the operations required to sync the schedules in the settings with the schedules in the DB
    """
    Schedule.objects.bulk_create(action.to_add)
    Schedule.objects.filter(id__in=[schedule.id for schedule in action.to_delete]).delete()
    Schedule.objects.bulk_update(action.to_modify, fields=ScheduleSerializer.Meta.fields)

    return Schedule.objects.all()
