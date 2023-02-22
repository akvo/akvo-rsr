from unittest import TestCase

from akvo.password_policy.rules.length import LengthRule
from akvo.password_policy.tests.mixin import ValidationResultMixin


class LengthRuleTestCase(TestCase, ValidationResultMixin):
    def setUp(self):
        self.rule = LengthRule(min=3, max=5)

    def test_min(self):
        result = self.rule.validate("ab")
        self.assertFalse(result.is_valid())
        self.assertValidationError(
            result.errors[0], LengthRule.ERROR_CODE_MIN, expected=3, actual=2
        )

    def test_max(self):
        result = self.rule.validate("abcdef")
        self.assertFalse(result.is_valid())
        self.assertValidationError(
            result.errors[0], LengthRule.ERROR_CODE_MAX, expected=5, actual=6
        )

    def test_valid(self):
        result = self.rule.validate("abcde")
        self.assertTrue(result.is_valid())
