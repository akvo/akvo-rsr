from unittest import TestCase

from akvo.password_policy.rules.character import CharacterRule
from akvo.password_policy.tests.mixin import ValidationResultMixin


class LettersCharacterTestCase(TestCase, ValidationResultMixin):
    def setUp(self):
        self.rule = CharacterRule.letters(3)

    def test_error(self):
        result = self.rule.validate("1a!b$")
        self.assertFalse(result.is_valid())
        self.assertValidationError(
            result.errors[0], CharacterRule.ERROR_CODE_LETTERS, expected=3, actual=2
        )

    def test_valid(self):
        result = self.rule.validate("1a b!C$")
        self.assertTrue(result.is_valid())


class UppercaseCharacterTestCase(TestCase, ValidationResultMixin):
    def setUp(self):
        self.rule = CharacterRule.uppercases(3)

    def test_error(self):
        result = self.rule.validate("aBcDe")
        self.assertFalse(result.is_valid())
        self.assertValidationError(
            result.errors[0], CharacterRule.ERROR_CODE_UPPERCASES, expected=3, actual=2
        )

    def test_valid(self):
        result = self.rule.validate("aBcDEf")
        self.assertTrue(result.is_valid())


class NumbersCharacterTestCase(TestCase, ValidationResultMixin):
    def setUp(self):
        self.rule = CharacterRule.numbers(3)

    def test_error(self):
        result = self.rule.validate("abc12")
        self.assertFalse(result.is_valid())
        self.assertValidationError(
            result.errors[0], CharacterRule.ERROR_CODE_NUMBERS, expected=3, actual=2
        )

    def test_valid(self):
        result = self.rule.validate("ab123")
        self.assertTrue(result.is_valid())


class SymbolCharacterTestCase(TestCase, ValidationResultMixin):
    def setUp(self):
        self.rule = CharacterRule.symbols(3)

    def test_error(self):
        result = self.rule.validate("a!1\u00a1b")
        self.assertFalse(result.is_valid())
        self.assertValidationError(
            result.errors[0], CharacterRule.ERROR_CODE_SYMBOLS, expected=3, actual=2
        )

    def test_valid(self):
        result = self.rule.validate("i\u00b1-1?")
        self.assertTrue(result.is_valid())
