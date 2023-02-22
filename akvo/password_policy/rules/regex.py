import re

from akvo.password_policy.core import ValidationResult, ValidationRule


class IllegalRegexRule(ValidationRule):
    ERROR_CODE = "ILLEGAL_PATTERN_MATCH"

    def __init__(self, pattern: str):
        self.pattern = re.compile(pattern)

    def validate(self, password: str) -> ValidationResult:
        matches = self.pattern.findall(password)
        result = ValidationResult()
        if not matches:
            return result
        for match in matches:
            result = result.merge(
                ValidationResult.error(self.ERROR_CODE, {"match": match})
            )
        return result
