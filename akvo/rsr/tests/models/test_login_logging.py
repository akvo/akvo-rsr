# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import timedelta

from django.forms import ValidationError
from django.conf import settings
from django.test import Client

from akvo.rsr.models import LoginLog
from akvo.rsr.models.login_log import MAX_FAILED_LOGINS
from akvo.rsr.tests.base import BaseTestCase


class LoginLoggingTestCase(BaseTestCase):
    """Tests for the login logging model"""

    def setUp(self):
        self.email = 'frank@example.com'
        self.password = 'password'
        self.user = self.create_user(self.email, self.password)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_successful_login_creates_log_entry(self):
        # When
        self.c.login(username=self.email, password=self.password)

        # Then
        logs = LoginLog.objects.filter(email=self.email)
        self.assertTrue(logs.exists())
        self.assertTrue(logs.first().success)

    def test_failed_login_creates_log_entry(self):
        # When
        with self.assertRaises(ValidationError):
            self.c.login(username=self.email, password='')

        # Then
        logs = LoginLog.objects.filter(email=self.email)
        self.assertTrue(logs.exists())
        self.assertFalse(logs.first().success)

    def test_password_deactivates_after_max_attempts(self):
        # Given
        for _ in range(MAX_FAILED_LOGINS - 1):
            with self.assertRaises(ValidationError):
                self.c.login(username=self.email, password='')

        # When
        with self.assertRaises(ValidationError) as assertion:
            self.c.login(username=self.email, password='')

        # Then
        self.assertIn('Login has been disabled', assertion.exception.message)

    def test_logins_post_password_deactivation_ignored(self):
        # When
        for _ in range(MAX_FAILED_LOGINS + 10):
            with self.assertRaises(ValidationError):
                self.c.login(username=self.email, password='')

        with self.assertRaises(ValidationError) as assertion:
            self.c.login(username=self.email, password=self.password)

        # Then
        self.assertIn('Login has been disabled', assertion.exception.message)
        logs = LoginLog.objects.filter(email=self.email)
        self.assertEqual(MAX_FAILED_LOGINS, logs.count())

    def test_login_works_after_deactivation_time(self):
        # Given
        for _ in range(MAX_FAILED_LOGINS + 10):
            with self.assertRaises(ValidationError):
                self.c.login(username=self.email, password='')
        # HACK: Set the creation time of these login attempts to older than login_disable_time
        time_delta = settings.LOGIN_DISABLE_TIME * 2
        creation_time = LoginLog.objects.first().created_at - timedelta(seconds=time_delta)
        LoginLog.objects.update(created_at=creation_time)

        # When
        self.c.login(username=self.email, password=self.password)

        # Then
        log_entry = LoginLog.objects.filter(email=self.email).first()
        self.assertTrue(log_entry.success)

    def test_successful_login_resets_password_attempts(self):
        # Given
        # For legacy accounts email != username
        self.user.username = 'frank'
        self.user.save()
        for _ in range(MAX_FAILED_LOGINS - 1):
            with self.assertRaises(ValidationError):
                self.c.login(username=self.user.username, password='')
        self.c.login(username=self.user.username, password=self.password)

        # When
        with self.assertRaises(ValidationError):
            self.c.login(username=self.user.username, password='')
        fail_log_entry = LoginLog.objects.filter(email=self.email).first()
        self.c.login(username=self.user.username, password=self.password)

        # Then
        log_entry = LoginLog.objects.filter(email=self.email).first()
        self.assertFalse(fail_log_entry.success)
        self.assertTrue(log_entry.success)
