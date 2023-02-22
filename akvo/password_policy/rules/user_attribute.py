from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.password_validation import UserAttributeSimilarityValidator
from django.core.exceptions import ValidationError

from akvo.password_policy.core import ValidationResult, ValidationRule


class UserAttributeRule(ValidationRule):
    ERROR_CODE = "SIMILAR_TO_USER_ATTRIBUTE"

    def __init__(
        self,
        user: AbstractBaseUser,
        attributes=UserAttributeSimilarityValidator.DEFAULT_USER_ATTRIBUTES,
    ):
        self.user = user
        self.attributes = attributes

    def validate(self, password: str) -> ValidationResult:
        try:
            UserAttributeSimilarityValidator(self.attributes).validate(
                password, self.user
            )
        except ValidationError as e:
            context = {"attribute": e.params.get("verbose_name", "attribute")}
            return ValidationResult.error(self.ERROR_CODE, context)
        return ValidationResult()
