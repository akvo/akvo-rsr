import re

from akvo.password_policy.core import ValidationResult, ValidationRule


class CharacterRule(ValidationRule):
    ERROR_CODE_LETTERS = "INSUFFICIENT_LETTER_CHARACTER"
    ERROR_CODE_UPPERCASES = "INSUFFICIENT_UPPERCASE_CHARACTER"
    ERROR_CODE_NUMBERS = "INSUFFICIENT_NUMBER_CHARACTER"
    ERROR_CODE_SYMBOLS = "INSUFFICIENT_SYMBOL_CHARACTER"

    @classmethod
    def letters(cls, min_length: int = 1):
        return cls(cls.ERROR_CODE_LETTERS, r"[a-zA-Z]", min_length)

    @classmethod
    def uppercases(cls, min_length: int = 1):
        return cls(cls.ERROR_CODE_UPPERCASES, r"[A-Z]", min_length)

    @classmethod
    def numbers(cls, min_length: int = 1):
        return cls(cls.ERROR_CODE_NUMBERS, r"[0-9]", min_length)

    @classmethod
    def symbols(cls, min_length: int = 1):
        return cls(cls.ERROR_CODE_SYMBOLS, r"\W", min_length)

    def __init__(self, error_code: str, pattern: str, min_length: int = 1):
        self.error_code = error_code
        self.pattern = pattern
        self.min_length = min_length

    def validate(self, password: str) -> ValidationResult:
        matches = re.findall(self.pattern, password)
        match_length = len(matches)
        if match_length < self.min_length:
            return ValidationResult.error(
                self.error_code, {"expected": self.min_length, "actual": match_length}
            )
        return ValidationResult.valid()
