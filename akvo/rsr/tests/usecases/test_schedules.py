from datetime import date
from typing import Dict

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


class GetSettingsSchedulesTest(BaseTestCase):
    """
    Specifically test get_setting_schedules
    """

    def _get_with(self, akvo_jobs: dict) -> Dict[str, Schedule]:
        with self.settings(AKVO_JOBS=akvo_jobs):
            return {schedule.name: schedule for schedule in get_setting_schedules()}

    def _test_schedule_arg_param(self, schedule_name, arg_value, expected_args=None, arg_type="args"):
        """
        Ensure passing "arg" or "kwargs", when constructing a Schedule, is converted to the right type and value

        :param schedule_name: resulting Schedule.name
        :param arg_value:
        :param expected_args: Optional override of the expected args (by default a stringified version of arg_value)
        :param arg_type: Either "args" or "kwargs (Schedule.args, Schedule.kwargs)
        """
        if expected_args is None:
            expected_args = str(arg_value)

        schedules = self._get_with({
            schedule_name: {
                "func": "print",
                "cron": "* * * * *",
                arg_type: arg_value,
            }
        })
        schedule = schedules[schedule_name]
        self.assertEqual(getattr(schedule, arg_type), expected_args, f"Schedule.{arg_type} != {expected_args}")

    def test_no_args(self):
        """args=tuple with primitives"""
        self._test_schedule_arg_param("primitives", None, expected_args="()")

    def test_tuple_args_primitives(self):
        """args=tuple with primitives"""
        self._test_schedule_arg_param("primitives", ("a", "b", "c", 1, 2, 3))

    def test_tuple_args_lists(self):
        """args=tuple with lists"""
        self._test_schedule_arg_param("lists", (["a"], ["b"], ["c"]))

    def test_tuple_args_dicts(self):
        """args=tuple with dicts"""
        self._test_schedule_arg_param("dicts", ({"a": 1}, {"b": 2}, {"c": 3}))

    def test_tuple_args_mixed(self):
        """args=tuple with mixed types"""
        self._test_schedule_arg_param("mixed", ("a", ["b"], {"c": 3}))

    def test_single_arg_primitive(self):
        """args=primitive type"""
        args = "hello"
        self._test_schedule_arg_param("primitive", args, expected_args=str((args,)))

    def test_single_arg_list(self):
        """args=list type"""
        args = ["a", "b", "c"]
        self._test_schedule_arg_param("list", args, expected_args=str((args,)))

    def test_single_arg_dict(self):
        """args=dict type"""
        args = dict(a=1, b=2, c=3)
        self._test_schedule_arg_param("dict", args, expected_args=str((args,)))

    def test_kwargs(self):
        """kwargs are passed"""
        self._test_schedule_arg_param("kwargs", dict(a=1, b=2, c=3), arg_type="kwargs")

    def test_no_kwargs(self):
        """args=tuple with primitives"""
        self._test_schedule_arg_param("no_kwargs", None, expected_args="{}", arg_type="kwargs")
