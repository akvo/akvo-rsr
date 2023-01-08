from typing import List

from akvo.password_policy.core import ValidationResult, ValidationRule


class CompoundRule(ValidationRule):
    def __init__(self, rules: List[ValidationRule]):
        self.rules = rules

    def validate(self, password: str) -> ValidationResult:
        result = ValidationResult.valid()
        for rule in self.rules:
            result = result.merge(rule.validate(password))
        return result
