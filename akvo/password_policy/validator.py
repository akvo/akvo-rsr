from typing import Callable, Optional

from django.core.exceptions import ValidationError
from django.utils.module_loading import import_string

from akvo.password_policy.builder import build_validation_rule
from akvo.password_policy.error_messages import get_error_message as msg
from akvo.password_policy.models import PolicyConfig
from akvo.password_policy.services import PasswordHistoryService


def noop(*_):
    return


def import_or_noop(fn_name) -> Callable:
    try:
        return import_string(fn_name)
    except (ValueError, AttributeError, ImportError):
        return noop


class PasswordPolicyValidator:
    """
    This is an implementation of Django's password validator.

    For use with the AUTH_PASSWORD_VALIDATORS setting.

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
            The function should return None if the password is valid, or raise a
            ValidationError with an error message if the password is not valid.
            signature: Callable[[str], Optional[User]]
        """
        self.resolve = import_or_noop(resolver)
        self.fallback = import_or_noop(fallback)

    def validate(self, password, user=None):
        """
        Validate that password complies with the policy configured using the PolicyConfig model.
        """
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

    def password_changed(self, password, user=None):
        """
        Log password changes for use in handling password reuse limits and expiration.
        """
        if not user:
            return
        config = self.resolve(user)
        if not config:
            return
        history = PasswordHistoryService(user, config)
        history.push(password)

    def get_help_text(self):
        return "Your password must comply with the password policy."
