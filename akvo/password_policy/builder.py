from typing import Callable, List, Optional

from django.contrib.auth.models import AbstractBaseUser

from akvo.password_policy.core import ValidationRule
from akvo.password_policy.models import PolicyConfig
from akvo.password_policy.rules.character import CharacterRule
from akvo.password_policy.rules.common_password import CommonPasswordRule
from akvo.password_policy.rules.compound import CompoundRule
from akvo.password_policy.rules.length import LengthRule
from akvo.password_policy.rules.regex import IllegalRegexRule
from akvo.password_policy.rules.reuse_limit import ReuseLimitRule
from akvo.password_policy.rules.user_attribute import UserAttributeRule
from akvo.password_policy.services import PasswordHistoryService

RuleBuilder = Callable[[PolicyConfig, AbstractBaseUser], Optional[ValidationRule]]


def build_min_length_rule(config: PolicyConfig, *_) -> Optional[ValidationRule]:
    if not config.min_length:
        return None
    return LengthRule(min=config.min_length)


def build_letters_rule(config: PolicyConfig, *_) -> Optional[ValidationRule]:
    if not config.letters:
        return None
    return CharacterRule.letters(min_length=config.letters)


def build_uppercase_rule(config: PolicyConfig, *_) -> Optional[ValidationRule]:
    if not config.uppercases:
        return None
    return CharacterRule.uppercases(min_length=config.uppercases)


def build_numbers_rule(config: PolicyConfig, *_) -> Optional[ValidationRule]:
    if not config.numbers:
        return None
    return CharacterRule.numbers(min_length=config.numbers)


def build_symbols_rule(config: PolicyConfig, *_) -> Optional[ValidationRule]:
    if not config.symbols:
        return None
    return CharacterRule.symbols(min_length=config.symbols)


def build_no_common_password_rule(config: PolicyConfig, *_) -> Optional[ValidationRule]:
    if not config.no_common_password:
        return None
    return CommonPasswordRule()


def build_reuse_limit_rule(
    config: PolicyConfig, user: AbstractBaseUser
) -> Optional[ValidationRule]:
    if not config.reuse:
        return None
    return ReuseLimitRule(PasswordHistoryService(user, config))


def build_no_user_attributes_rule(
    config: PolicyConfig, user: AbstractBaseUser
) -> Optional[ValidationRule]:
    if not config.no_user_attributes:
        return None
    return UserAttributeRule(user)


def build_regex_rules(config: PolicyConfig, *_) -> Optional[ValidationRule]:
    if not config.regex_rules.count():
        return None
    return CompoundRule(
        [IllegalRegexRule(pattern=r.pattern) for r in config.regex_rules.all()]
    )


RULE_BUILDERS: List[RuleBuilder] = [
    build_min_length_rule,
    build_letters_rule,
    build_uppercase_rule,
    build_numbers_rule,
    build_symbols_rule,
    build_no_common_password_rule,
    build_reuse_limit_rule,
    build_no_user_attributes_rule,
    build_regex_rules,
]


def build_validation_rule(
    config: PolicyConfig, user: AbstractBaseUser
) -> ValidationRule:
    rules = [rule for rule in [build(config, user) for build in RULE_BUILDERS] if rule]
    return CompoundRule(rules)
