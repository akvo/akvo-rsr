from typing import Protocol

from akvo.password_policy.core import ErrorItem


class HasAssertEqualAndAssertDictContainsSubsetProtocol(Protocol):
    def assertEqual(self, first, second, msg=None):
        ...

    def assertDictContainsSubset(self, subset, dictionary, msg=None):
        ...


class ValidationResultMixin:
    def assertValidationError(
        self: HasAssertEqualAndAssertDictContainsSubsetProtocol,
        error: ErrorItem,
        expected_code: str,
        **expected_context
    ):
        self.assertEqual(expected_code, error.code)
        if expected_context:
            self.assertDictContainsSubset(expected_context, error.context)
