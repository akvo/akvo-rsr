from unittest import TestCase

from akvo.password_policy.rules.character import CharacterRule
from akvo.password_policy.rules.compound import CompoundRule
from akvo.password_policy.rules.length import LengthRule


class CompoundRuleTestCase(TestCase):
    def setUp(self):
        self.validator = CompoundRule([LengthRule(5), CharacterRule.uppercases(3)])

    def test_one_error(self):
        result = self.validator.validate("aBCD")
        self.assertFalse(result.is_valid())
        self.assertEqual(1, len(result.errors))
        error = result.errors[0]
        self.assertEqual(LengthRule.ERROR_CODE_MIN, error.code)

    def test_multiple_errors(self):
        result = self.validator.validate("abCd")
        self.assertFalse(result.is_valid())
        self.assertEqual(2, len(result.errors))
        self.assertEqual(
            [LengthRule.ERROR_CODE_MIN, CharacterRule.ERROR_CODE_UPPERCASES],
            [e.code for e in result.errors],
        )

    def test_valid(self):
        result = self.validator.validate("aBCDe")
        self.assertTrue(result.is_valid())
