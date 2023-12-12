import io
import os
import binascii
from datetime import timedelta
from typing import cast
from django.conf import settings
from django.core import mail
from django.core.files.storage import Storage, default_storage
from django.test import override_settings
from django.utils import timezone
from django_q.models import Task
from akvo.rsr.tests.base import BaseTestCase

from akvo.rsr.views.py_reports.utils import REPORTS_STORAGE_BASE_DIR, cleanup_expired_reports, notify_dev_on_failed_task, notify_user_on_failed_report, save_report_file

default_storage = cast(Storage, default_storage)


class StorageTestCase(BaseTestCase):
    def tearDown(self):
        _, files = default_storage.listdir(REPORTS_STORAGE_BASE_DIR)
        for f in files:
            default_storage.delete(os.path.join(REPORTS_STORAGE_BASE_DIR, f))
        super().tearDown()

    def setUp(self):
        super().setUp()
        buffer = io.BytesIO(b'test')
        self.url = save_report_file(REPORTS_STORAGE_BASE_DIR, 'test.txt', buffer.getvalue())
        self.file_path = os.path.join(REPORTS_STORAGE_BASE_DIR, 'test.txt')

    def test_save_report_file(self):
        self.assertTrue(default_storage.exists(self.file_path))
        self.assertEqual(default_storage.url(self.file_path), self.url)

    def test_cleanup_expired_reports_no_files_deleted(self):
        now = timezone.now()
        t23 = now + timedelta(hours=23, minutes=58)
        cleanup_expired_reports(t23)
        self.assertTrue(default_storage.exists(self.file_path))

    def test_cleanup_expired_reports_deletes_file(self):
        now = timezone.now()
        t24 = now + timedelta(hours=24, minutes=2)
        cleanup_expired_reports(t24)
        self.assertFalse(default_storage.exists(self.file_path))


@override_settings(REPORT_ERROR_RECIPIENTS=['dev@akvo.org'])
class NotifyErrorTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        max_attempts = getattr(settings, 'Q_CLUSTER', {}).get('max_attempts', 1)
        self.create_user('test@akvo.org')
        self.failed_task = Task.objects.create(
            id=self._generate_id(),
            name='test',
            args=({'report_label': 'test report'}, 'test@akvo.org'),
            result='error',
            success=False,
            started=timezone.now(),
            stopped=timezone.now(),
            attempt_count=max_attempts
        )
        self.success_task = Task.objects.create(
            id=self._generate_id(),
            name='test',
            args=({'report_label': 'test report'}, 'test@akvo.org'),
            success=True,
            started=timezone.now(),
            stopped=timezone.now()
        )

    def _generate_id(self):
        return binascii.b2a_hex(os.urandom(16)).decode('utf-8')

    def test_notify_dev(self):
        notify_dev_on_failed_task(self.failed_task)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('dev@akvo.org', mail.outbox[0].to)

    def test_notify_user(self):
        notify_user_on_failed_report(self.failed_task)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(
            [it for mail in mail.outbox for it in mail.to],
            ['test@akvo.org', 'dev@akvo.org']
        )

    def test_ignore_success(self):
        notify_user_on_failed_report(self.success_task)
        self.assertEqual(len(mail.outbox), 0)
