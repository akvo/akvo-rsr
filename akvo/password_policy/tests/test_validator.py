from unittest import TestCase
from unittest.mock import Mock

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from akvo.password_policy.models import PolicyConfig
from akvo.password_policy.validator import PasswordPolicyValidator

User = get_user_model()


def make_policy(*_):
    return PolicyConfig(min_length=4, uppercases=2)


fallback_mock = Mock()

resolver_mock = Mock(side_effect=make_policy)


class ValidatorTestMixin:
    def make_user(self):
        return User(
            username="test",
            password="password",
            email="test@example.com",
            first_name="Test",
            last_name="User",
        )


class ValidatorFallbackTestCase(ValidatorTestMixin, TestCase):
    def setUp(self):
        fallback_mock.reset_mock()
        self.validator = PasswordPolicyValidator(
            resolver="",
            fallback="akvo.password_policy.tests.test_validator.fallback_mock",
        )

    def test_no_user(self):
        self.validator.validate("test")
        fallback_mock.assert_called_once_with("test")

    def test_no_config(self):
        user = self.make_user()
        self.validator.validate("test", user)
        fallback_mock.assert_called_once_with("test", user)


class ValidateUserPolicyTestCase(ValidatorTestMixin, TestCase):
    def setUp(self):
        resolver_mock.reset_mock()
        fallback_mock.reset_mock()
        self.validator = PasswordPolicyValidator(
            resolver="akvo.password_policy.tests.test_validator.resolver_mock",
            fallback="akvo.password_policy.tests.test_validator.fallback_mock",
        )
        self.user = self.make_user()

    def test_invalid(self):
        with self.assertRaises(ValidationError):
            self.validator.validate("test", self.user)
        resolver_mock.assert_called_once_with(self.user)
        fallback_mock.assert_not_called()

    def test_valid(self):
        self.validator.validate("TesT", self.user)
        resolver_mock.assert_called_once_with(self.user)
        fallback_mock.assert_not_called()
