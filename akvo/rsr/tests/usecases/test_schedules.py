from datetime import date
from django.core import mail
from django.test import override_settings
from django_q.models import Schedule

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.usecases.django_q.schedules import (
    ScheduleSerializer, calc_sync, get_setting_schedules,
    sync_with_settings,
)
from akvo.rsr.usecases.period_update_aggregation import aggregate
from akvo.rsr.usecases import audit_project_aggregation as auditor


@override_settings(AKVO_JOBS={})
class EmptyScheduleSettingsTestCase(BaseTestCase):
    """
    Test cases where syncing would delete all schedules in the DB if there were any
    """

    def test_get_setting_schedules(self):
        schedules = get_setting_schedules()
        self.assertEqual(len(schedules), 0)

    def test_calc_sync_with_objects(self):
        Schedule.objects.create(name="test1", cron="* * * * *")
        Schedule.objects.create(name="test2", cron="* * * * *")
        Schedule.objects.create(name="test3", cron="* * * * *")

        action = calc_sync(get_setting_schedules())

        self.assertEqual(len(action.to_add), 0)
        self.assertEqual(len(action.to_modify), 0)
        self.assertEqual(len(action.to_delete), 3)

    def test_sync_with_objects(self):
        Schedule.objects.create(name="test1", cron="* * * * *")
        Schedule.objects.create(name="test2", cron="* * * * *")
        Schedule.objects.create(name="test3", cron="* * * * *")

        sync_with_settings()

        self.assertEqual(Schedule.objects.count(), 0)


@override_settings(AKVO_JOBS={
    "addition": dict(func="noop", cron="*/5 * * * *"),
    "addition2": dict(func="noop", cron="*/10 * * * *"),
    "addition3": dict(func="noop", cron="*/15 * * * *"),
})
class AddScheduleSettingsTestCase(BaseTestCase):
    """
    Test cases where syncing would add schedules to the DB
    """

    def test_get_setting_schedules(self):
        schedules = get_setting_schedules()
        self.assertEqual(len(schedules), 3)

        self.assertDictEqual({
            schedule.name: ScheduleSerializer(instance=schedule).data
            for schedule in schedules
        }, {
            "addition": dict(name="addition", func="noop", cron="*/5 * * * *"),
            "addition2": dict(name="addition2", func="noop", cron="*/10 * * * *"),
            "addition3": dict(name="addition3", func="noop", cron="*/15 * * * *"),
        })

    def test_calc_sync_with_empty_db(self):
        action = calc_sync(get_setting_schedules())

        self.assertEqual(len(action.to_add), 3)
        self.assertEqual(len(action.to_modify), 0)
        self.assertEqual(len(action.to_delete), 0)

    def test_sync_with_empty_db(self):
        sync_with_settings()

        self.assertEqual(Schedule.objects.filter(schedule_type=Schedule.CRON).count(), 3)


@override_settings(AKVO_JOBS={
    "addition": dict(func="noop", cron="*/5 * * * *"),
    "addition2": dict(func="noop", cron="*/10 * * * *"),
    "addition3": dict(func="noop", cron="*/15 * * * *"),
})
class ModifyDBSchedulesTestCase(BaseTestCase):
    """
    Test cases where syncing would modify existing schedules in the DB
    """

    def setUp(self):
        super().setUp()
        Schedule.objects.create(name="addition", cron="* * * * *")
        Schedule.objects.create(name="addition2", cron="* * * * *")
        Schedule.objects.create(name="addition3", cron="* * * * *")

    def test_calc_sync(self):
        action = calc_sync(get_setting_schedules())

        self.assertEqual(len(action.to_add), 0)
        self.assertEqual(len(action.to_modify), 3)
        self.assertEqual(len(action.to_delete), 0)

    def test_sync(self):
        sync_with_settings()

        db_schedules = list(Schedule.objects.all())

        self.assertEqual(len(db_schedules), 3)
        self.assertDictEqual({
            schedule.name: ScheduleSerializer(instance=schedule).data
            for schedule in db_schedules
        }, {
            "addition": dict(name="addition", func="noop", cron="*/5 * * * *"),
            "addition2": dict(name="addition2", func="noop", cron="*/10 * * * *"),
            "addition3": dict(name="addition3", func="noop", cron="*/15 * * * *"),
        })
