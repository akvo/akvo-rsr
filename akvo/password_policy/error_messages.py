from django.utils.translation import gettext_lazy as _

from akvo.password_policy.rules.character import CharacterRule
from akvo.password_policy.rules.common_password import CommonPasswordRule
from akvo.password_policy.rules.length import LengthRule
from akvo.password_policy.rules.regex import RegexRule
from akvo.password_policy.rules.user_attribute import UserAttributeRule

ERROR_MESSAGES = {
    CharacterRule.ERROR_CODE_LETTERS: _(
        "Password must contain %(expected)s or more letters."
    ),
    CharacterRule.ERROR_CODE_NUMBERS: _(
        "Password must contain %(expected)s or more numbers."
    ),
    CharacterRule.ERROR_CODE_UPPERCASES: _(
        "Password must contain %(expected)d or more uppercase characters."
    ),
    CharacterRule.ERROR_CODE_SYMBOLS: _(
        "Password must contain %(expected)d or more symbol characters."
    ),
    CommonPasswordRule.ERROR_CODE: _("Password is too common."),
    LengthRule.ERROR_CODE_MIN: _(
        "Password must be %(expected)s or more characters in length."
    ),
    RegexRule.ERROR_CODE: _("Password matches the illegal pattern '%(match)s'."),
    UserAttributeRule.ERROR_CODE: _("Password is too similar to the '%(attribute)s'."),
}


def get_error_message(code: str) -> str:
    return str(ERROR_MESSAGES.get(code, code))
