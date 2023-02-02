from django.contrib.auth.password_validation import CommonPasswordValidator
from django.core.exceptions import ValidationError

from akvo.password_policy.core import ValidationResult, ValidationRule


class CommonPasswordRule(ValidationRule):
    ERROR_CODE = "COMMON_PASSWORD_VIOLATION"

    def validate(self, password: str) -> ValidationResult:
        try:
            CommonPasswordValidator().validate(password)
        except ValidationError:
            return ValidationResult.error(self.ERROR_CODE)
        return ValidationResult.valid()
