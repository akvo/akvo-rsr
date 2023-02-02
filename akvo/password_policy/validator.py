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
    def __init__(self, resolver: str, fallback: Optional[str] = None):
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
