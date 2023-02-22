from typing import Callable, Optional

from django.core.exceptions import ValidationError
from django.utils.module_loading import import_string

from akvo.password_policy.builder import build_validation_rule
from akvo.password_policy.error_messages import get_error_message as msg
from akvo.password_policy.models import PolicyConfig


def noop(*_):
    return


def import_or_noop(fn_name) -> Callable:
    try:
        return import_string(fn_name)
    except (ValueError, AttributeError, ImportError):
        return noop


class PasswordPolicyValidator:
    """
    Validate that password complies with the policy configured using the PolicyConfig model.

    This is an implementation of Django's password validator for use with the
    AUTH_PASSWORD_VALIDATORS setting.

    See:
    https://docs.djangoproject.com/en/3.2/topics/auth/passwords/#writing-your-own-validator
    https://docs.djangoproject.com/en/3.2/ref/settings/#std-setting-AUTH_PASSWORD_VALIDATORS
    """

    def __init__(self, resolver: str, fallback: Optional[str] = None):
        """
        Parameters
        ----------
        resolver: str
            module path to a function that resolve user's password policy.
            signature: Callable[[User], Optional[PolicyConfig]]
        fallback: Optional[str]
            module path to a fallback funtion when the user arg is None or
            the resolver function doesn't return a PasswordPolicy object.
            The function should accept password and return None if the password is valid,
            or raise a ValidationError with an error message if the password is not valid.
            signature: Callable[[str], None]
        """
        self.resolve = import_or_noop(resolver)
        self.fallback = import_or_noop(fallback)

    def validate(self, password, user=None):
        if not user:
            return self.fallback(password)
        config = self.resolve(user)
        if not isinstance(config, PolicyConfig):
            return self.fallback(password, user)
        validator = build_validation_rule(config, user)
        result = validator.validate(password)
        if not result.is_valid():
            errors = [
                ValidationError(msg(error.code), code=error.code, params=error.context)
                for error in result.errors
            ]
            raise ValidationError(errors)

    def get_help_text(self):
        return "Your password must comply with the password policy."
