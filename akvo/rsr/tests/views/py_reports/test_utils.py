from datetime import timedelta
import io
import os
from typing import cast
from django.core.files.storage import Storage, default_storage
from django.test import TestCase
from django.utils import timezone

from akvo.rsr.views.py_reports.utils import REPORTS_STORAGE_BASE_DIR, cleanup_expired_reports, save_report_file

default_storage = cast(Storage, default_storage)


class PyReportUtilsTestCase(TestCase):
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
