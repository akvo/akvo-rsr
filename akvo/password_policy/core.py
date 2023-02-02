from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass(frozen=True)
class ErrorItem:
    code: str
    context: Dict[str, int | str] = field(default_factory=dict)


@dataclass(frozen=True)
class ValidationResult:
    errors: List[ErrorItem] = field(default_factory=list)

    @classmethod
    def error(
        cls, code: str, context: Optional[Dict[str, int | str]] = None
    ) -> ValidationResult:
        return cls(errors=[ErrorItem(code=code, context=context or {})])

    @classmethod
    def valid(cls) -> ValidationResult:
        return cls()

    def is_valid(self) -> bool:
        return len(self.errors) == 0

    def merge(self, other: ValidationResult) -> ValidationResult:
        return ValidationResult(self.errors + other.errors)


class ValidationRule(ABC):
    @abstractmethod
    def validate(self, password: str) -> ValidationResult:
        ...
