from django.contrib.auth import get_user_model
from django.test import TestCase

from akvo.password_policy.builder import build_validation_rule
from akvo.password_policy.models import PolicyConfig
from akvo.password_policy.rules.character import CharacterRule
from akvo.password_policy.rules.common_password import CommonPasswordRule
from akvo.password_policy.rules.compound import CompoundRule
from akvo.password_policy.rules.length import LengthRule
from akvo.password_policy.rules.regex import IllegalRegexRule
from akvo.password_policy.rules.reuse_limit import ReuseLimitRule
from akvo.password_policy.rules.user_attribute import UserAttributeRule

User = get_user_model()


class RuleBuilderTestMixin:
    def make_user(self):
        return User(
            username="test",
            password="password",
            email="test@example.com",
            first_name="Test",
            last_name="User",
        )


class ConfigAttributeBuilderTestCase(RuleBuilderTestMixin, TestCase):
    def setUp(self):
        self.user = self.make_user()

    def test_no_rules(self):
        config = PolicyConfig.objects.create(min_length=0, letters=0)
        validator = build_validation_rule(config, self.user)
        self.assertEqual(0, len(validator.rules))

    def test_length(self):
        config = PolicyConfig.objects.create(min_length=1, letters=0)
        validator = build_validation_rule(config, self.user)
        self.assertEqual(1, len(validator.rules))
        self.assertIsInstance(validator.rules[0], LengthRule)
        self.assertEquals(1, validator.rules[0].min)

    def test_character(self):
        config = PolicyConfig.objects.create(
            min_length=0, letters=1, uppercases=1, numbers=1, symbols=1
        )
        validator = build_validation_rule(config, self.user)
        self.assertEqual(4, len(validator.rules))
        for rule in validator.rules:
            self.assertIsInstance(rule, CharacterRule)

    def test_no_common_password(self):
        config = PolicyConfig.objects.create(min_length=0, letters=0, no_common_password=True)
        validator = build_validation_rule(config, self.user)
        self.assertEqual(1, len(validator.rules))
        self.assertIsInstance(validator.rules[0], CommonPasswordRule)

    def test_reuse_limit_rule(self):
        config = PolicyConfig.objects.create(min_length=0, letters=0, reuse=1)
        validator = build_validation_rule(config, self.user)
        self.assertEqual(1, len(validator.rules))
        self.assertIsInstance(validator.rules[0], ReuseLimitRule)

    def test_user_attributes_rule(self):
        config = PolicyConfig.objects.create(min_length=0, letters=0, no_user_attributes=True)
        validator = build_validation_rule(config, self.user)
        self.assertEqual(1, len(validator.rules))
        self.assertIsInstance(validator.rules[0], UserAttributeRule)


class RegexRulesBuilderTestCase(RuleBuilderTestMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.user = self.make_user()

    def test_regex_rules(self):
        config = PolicyConfig.objects.create(min_length=0, letters=0)
        config.regex_rules.create(pattern="foo")
        config.regex_rules.create(pattern="bar")
        validator = build_validation_rule(config, self.user)
        self.assertEqual(1, len(validator.rules))
        self.assertIsInstance(validator.rules[0], CompoundRule)
        regex_validators = validator.rules[0]
        self.assertEqual(2, len(regex_validators.rules))
        for rule in regex_validators.rules:
            self.assertIsInstance(rule, IllegalRegexRule)
