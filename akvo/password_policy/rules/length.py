from typing import Optional

from akvo.password_policy.core import ValidationResult, ValidationRule


class LengthRule(ValidationRule):
    ERROR_CODE_MIN = "LENGTH_TOO_SHORT"
    ERROR_CODE_MAX = "LENGTH_TOO_LONG"

    def __init__(self, min: int, max: Optional[int] = None):
        self.min = min
        self.max = max

    def validate(self, password: str) -> ValidationResult:
        password_length = len(password)
        if password_length < self.min:
            return ValidationResult.error(
                self.ERROR_CODE_MIN, {"expected": self.min, "actual": password_length}
            )
        if self.max and password_length > self.max:
            return ValidationResult.error(
                self.ERROR_CODE_MAX, {"expected": self.max, "actual": password_length}
            )
        return ValidationResult.valid()
