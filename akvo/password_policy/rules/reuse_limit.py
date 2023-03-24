from akvo.password_policy.core import ValidationResult, ValidationRule
from akvo.password_policy.services import PasswordHistoryService


class ReuseLimitRule(ValidationRule):
    ERROR_CODE = "REUSE_LIMIT_VIOLATION"

    def __init__(self, history: PasswordHistoryService):
        self.history = history

    def validate(self, password: str) -> ValidationResult:
        if self.history.contains(password):
            return ValidationResult.error(self.ERROR_CODE, {"limit": self.history.reuse_limit})
        return ValidationResult()
