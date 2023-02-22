from unittest import TestCase

from django.contrib.auth import get_user_model

from akvo.password_policy.rules.user_attribute import UserAttributeRule
from akvo.password_policy.tests.mixin import ValidationResultMixin

User = get_user_model()


class UserAttributeRuleTestCase(TestCase, ValidationResultMixin):
    def setUp(self):
        user = User(
            username="test",
            password="password",
            email="test@example.com",
            first_name="Test",
            last_name="User",
        )
        self.rule = UserAttributeRule(user)

    def test_invalid(self):
        result = self.rule.validate("test")
        self.assertFalse(result.is_valid())
        self.assertValidationError(
            result.errors[0], UserAttributeRule.ERROR_CODE, attribute="username"
        )

    def test_valid(self):
        result = self.rule.validate("secret")
        self.assertTrue(result.is_valid())
