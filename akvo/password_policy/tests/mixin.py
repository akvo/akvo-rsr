from typing import Protocol

from akvo.password_policy.core import ErrorItem


class HasAssertEqualProtocol(Protocol):
    def assertEqual(self, first, second, msg=None):
        ...


class ValidationResultMixin:
    def assertValidationError(
        self: HasAssertEqualProtocol,
        error: ErrorItem,
        expected_code: str,
        **expected_context
    ):
        self.assertEqual(expected_code, error.code)
        for key, value in expected_context.items():
            self.assertEqual(value, error.context[key])
