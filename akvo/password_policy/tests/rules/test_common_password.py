from unittest import TestCase

from akvo.password_policy.rules.common_password import CommonPasswordRule
from akvo.password_policy.tests.mixin import ValidationResultMixin


class CommonPasswordRuleTestCase(TestCase, ValidationResultMixin):
    def setUp(self):
        self.rule = CommonPasswordRule()

    def test_violation(self):
        result = self.rule.validate("test123")
        self.assertFalse(result.is_valid())
        self.assertValidationError(result.errors[0], CommonPasswordRule.ERROR_CODE)

    def test_valid(self):
        result = self.rule.validate("igd38#G/3~*k3jg")
        self.assertTrue(result.is_valid())
