from django.contrib.auth import get_user_model
from django.test import TestCase
from akvo.password_policy.rules.reuse_limit import ReuseLimitRule
from akvo.password_policy.tests.helper import PasswordHistoryServiceTestBuilder

from akvo.password_policy.tests.mixin import ValidationResultMixin

User = get_user_model()


class ReuseLimitRuleTestCase(TestCase, ValidationResultMixin):
    def setUp(self):
        super().setUp()
        self.ctx = PasswordHistoryServiceTestBuilder()
        self.history = self.ctx.build()
        self.rule = ReuseLimitRule(self.history)

    def test_invalid(self):
        self.history.push("test")
        result = self.rule.validate("test")
        self.assertValidationError(result.errors[0], ReuseLimitRule.ERROR_CODE)

    def test_valid(self):
        self.history.push("password 1")
        result = self.rule.validate("password 2")
        self.assertTrue(result.is_valid())
