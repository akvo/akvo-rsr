from datetime import timedelta
from django.test import TestCase

from akvo.password_policy.models import PasswordHistory, PolicyConfig
from akvo.password_policy.tests.helper import PasswordHistoryServiceTestBuilder


class PasswordHistoryTestCase(TestCase):
    def setUp(self):
        super().setUp()
        self.ctx = PasswordHistoryServiceTestBuilder()

    def test_create_history(self):
        service = self.ctx.build()
        service.push('password')
        self.assertEqual(1, PasswordHistory.objects.filter(user=self.ctx.user).count())

    def test_no_expiration(self):
        service = self.ctx.with_config(PolicyConfig(reuse=1)).build()
        service.push('password')
        self.assertEqual(1, PasswordHistory.objects.filter(user=self.ctx.user).count())

    def test_no_reuse_limit(self):
        service = self.ctx.with_config(PolicyConfig(expiration=1)).build()
        service.push('password')
        self.assertEqual(1, PasswordHistory.objects.filter(user=self.ctx.user).count())

    def test_no_expiration_and_reuse_limit(self):
        service = self.ctx.with_config(PolicyConfig()).build()
        service.push('password')
        self.assertEqual(0, PasswordHistory.objects.filter(user=self.ctx.user).count())

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
