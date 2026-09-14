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
            # `assertDictContainsSubset` was removed in Python 3.12. Comparing only the keys
            # the expectation names keeps the subset semantics and still yields a readable
            # diff when one of them is wrong.
            actual_context = {key: error.context.get(key) for key in expected_context}
            self.assertEqual(expected_context, actual_context)
