import dataclasses
from typing import Any, Optional

from django.db import models
from django.db.models import QuerySet, sql
from django.utils.module_loading import import_string


class PrePoPickler:
    """
    Helps prepare an object pre-pickle and an object post-pickle

    Some objects take an inordinate amount of time to pickle, which negates the benefits of caching.
    In some cases however, it can help to pickle only certain parts of the object from whence the entire object
     can then later be built at a lower cost.
    """

    @classmethod
    def reduce(cls, obj: Any) -> Any:
        """Make a smaller version of the object to be stored"""
        return obj

    @classmethod
    def expand(cls, obj: Any) -> Any:
        """Recreate the stored object from its reduced state"""
        return obj


@dataclasses.dataclass
class QuerysetReduction:
    """The important parts of a Queryset that allow it to be rebuilt"""
    model_name: str
    query: sql.Query


class QuerysetPrePo(PrePoPickler):
    """
    The queryset's model and SQL query are pickled instead of the results from the executed query.

    (Un-)Pickling speed of Querysets is very unstable.
    It can often be more expensive to pickle and unpickle than simply execute it.

    In cases where building the queryset itself is expensive, it can be worth caching the resulting queryset.
    """

    @classmethod
    def reduce(cls, queryset: QuerySet) -> Optional[QuerysetReduction]:
        """Extracts the full, importable path of the Queryset's model + the SQL query"""

        if queryset is None:
            return queryset
        return QuerysetReduction(
            model_name=f"{queryset.model.__module__}.{queryset.model.__qualname__}",
            query=queryset.query
        )

    @classmethod
    def expand(cls, reduction: QuerysetReduction) -> QuerySet:
        """
        Rebuilds a fresh Queryset from a reduction
        """

        model = import_string(reduction.model_name)
        if not issubclass(model, models.Model):
            raise ValueError("Queryset model is not a subclass of django.db.models.Model")
        queryset = model.objects.all()
        queryset.query = reduction.query
        return queryset
