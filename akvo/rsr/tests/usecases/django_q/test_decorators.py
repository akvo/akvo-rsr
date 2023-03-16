import datetime

from django.core.cache import cache
from django_q.models import Task

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.usecases.django_q.decorators import (
    UNIQUE_KEY_FORMAT, get_unique_cache_heartbeat, unique_task,
)


class UniqueTaskTestcase(BaseTestCase):

    def setUp(self):
        super().setUp()

        def must_be_unique():
            return "I was unique once"

        self.unique_task_name = "must_be_unique"
        self.unique_cache_key = UNIQUE_KEY_FORMAT.format(task_name=self.unique_task_name)
        self.unique_method = unique_task(self.unique_task_name)(must_be_unique)

        cache.delete(self.unique_cache_key)

    def test_no_running_task(self):
        self.assertEqual(self.unique_method(), "I was unique once")
        self.assertFalse(self.unique_cache_key in cache)

    def test_old_running_task(self):
        cache.set(UNIQUE_KEY_FORMAT.format(task_name=self.unique_task_name), 0)
        Task.objects.create(
            id="an id",
            name=self.unique_task_name,
            func="must_be_unique",
            started=datetime.datetime.now(),
            stopped=datetime.datetime.now(),
        )
        self.assertEqual(self.unique_method(), "I was unique once")
        self.assertFalse(self.unique_cache_key in cache)

    def test_running_task(self):
        cache_heartbeat = get_unique_cache_heartbeat(self.unique_cache_key)
        cache_heartbeat.set_cache_value()

        self.assertIsNone(self.unique_method())
        self.assertTrue(self.unique_cache_key in cache)
