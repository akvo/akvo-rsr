from datetime import timedelta
from django.test import TestCase

from akvo.password_policy.models import PasswordHistory, PolicyConfig
from akvo.password_policy.tests.helper import PasswordHistoryServiceTestBuilder


class PasswordHistoryPushTestCase(TestCase):
    def setUp(self):
        super().setUp()
        self.ctx = PasswordHistoryServiceTestBuilder()

    def test_push_password(self):
        service = self.ctx.build()
        service.push('password')
        self.assertEqual(1, PasswordHistory.objects.filter(user=self.ctx.user).count())

    def test_no_config(self):
        service = self.ctx.with_no_config().build()
        service.push('password')
        self.assertEqual(1, PasswordHistory.objects.filter(user=self.ctx.user).count())

    def test_cleanup_excess_history(self):
        reuse_limit = 2
        service = self.ctx.with_config(PolicyConfig(reuse=reuse_limit)).build()
        PasswordHistory.objects.create(user=self.ctx.user, password='password 1')
        PasswordHistory.objects.create(user=self.ctx.user, password='password 2')
        PasswordHistory.objects.create(user=self.ctx.user, password='password 3')

        service.push('password 4')

        self.assertEqual(reuse_limit, PasswordHistory.objects.filter(user=self.ctx.user).count())
        for history in PasswordHistory.objects.filter(user=self.ctx.user):
            self.assertNotIn(history.password, ['password 1', 'password 2'])


class PasswordHistoryContainsTestCase(TestCase):
    def setUp(self):
        super().setUp()
        self.ctx = PasswordHistoryServiceTestBuilder()

    def test_empty_history(self):
        service = self.ctx.build()
        self.assertFalse(service.contains('password'))

    def test_with_expiration_and_reuse_limit_config(self):
        service = self.ctx.with_config(PolicyConfig(expiration=1, reuse=2)).build()
        service.push('password')
        self.assertTrue(service.contains('password'))

    def test_no_reuse_limit(self):
        service = self.ctx.with_config(PolicyConfig(expiration=1)).build()
        service.push('password')
        self.assertFalse(service.contains('password'))

    def test_no_config(self):
        service = self.ctx.with_no_config().build()
        service.push('password')
        self.assertFalse(service.contains('password'))

    def test_out_password(self):
        """
        Reuse old password that have exceeded the reuse limit
        """
        service = self.ctx.with_config(PolicyConfig(reuse=2)).build()
        service.push('password 1')
        service.push('password 2')
        service.push('password 3')
        self.assertFalse(service.contains('password 1'))
