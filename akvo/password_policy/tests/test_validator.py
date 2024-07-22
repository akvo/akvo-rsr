from unittest.mock import Mock

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from akvo.password_policy.models import PolicyConfig, PasswordHistory
from akvo.password_policy.validator import PasswordPolicyValidator

User = get_user_model()

fallback_mock = Mock()

resolver_mock = Mock()


class ValidatorTestMixin:
    def make_user(self):
        return User.objects.create(
            username='test',
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
        resolver_mock.side_effect = lambda _: PolicyConfig.objects.create(
            min_length=4, uppercases=2
        )
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


class PasswordChangedTestCase(ValidatorTestMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.reuse_limit = 2
        resolver_mock.reset_mock()
        resolver_mock.side_effect = lambda *_: PolicyConfig.objects.create(reuse=self.reuse_limit)
        self.validator = PasswordPolicyValidator("akvo.password_policy.tests.test_validator.resolver_mock")
        self.user = self.make_user()
        self.user.save()

    def test_initial_state(self):
        self.assertEqual(0, PasswordHistory.objects.count())

    def test_log_new_password(self):
        self.validator.password_changed('test', self.user)
        self.assertEqual(1, PasswordHistory.objects.filter(user=self.user).count())

    def test_no_config(self):
        resolver_mock.side_effect = lambda *_: None
        self.validator.password_changed('test', self.user)
        self.assertEqual(1, PasswordHistory.objects.filter(user=self.user).count())
