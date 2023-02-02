from unittest import TestCase

from akvo.password_policy.rules.regex import RegexRule
from akvo.password_policy.tests.mixin import ValidationResultMixin


class RegexRuleTestCase(TestCase, ValidationResultMixin):
    def setUp(self):
        self.rule = RegexRule("(?i)test|example")

    def test_illegal_pattern(self):
        result = self.rule.validate("TestingTheExaMples")
        self.assertFalse(result.is_valid())
        self.assertValidationError(result.errors[0], RegexRule.ERROR_CODE, match="Test")
        self.assertValidationError(
            result.errors[1], RegexRule.ERROR_CODE, match="ExaMple"
        )

    def test_valid(self):
        result = self.rule.validate("tesaxample")
        self.assertTrue(result.is_valid())
