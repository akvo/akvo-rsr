import logging
from functools import wraps
from typing import Any, Callable, List, Type

from django.conf import settings
from django.core.cache import caches, BaseCache

from akvo.cache.prepo import PrePoPickler

logger = logging.getLogger(__name__)


def cache_with_key(
        keyfunc: Callable[..., Any],
        timeout: int = settings.RSR_CACHE_SECONDS,
        cache_name: str = 'default',
        prepo_pickle: Type[PrePoPickler] = None
):
    """Decorator which applies Django caching to a function.

    :param keyfunc: Function which computes a cache key
           from the original function's arguments.  You are responsible
           for avoiding collisions with other uses of this decorator or
           other uses of caching.
    :param timeout: How long the value will be valid in the cache
    :param cache_name: Which cache to store the value in
    :param prepo_pickle: Pre- and post-processing class for pickled values
    """

    prepo_pickle = prepo_pickle or PrePoPickler

    def decorator(func):
        @wraps(func)
        def func_with_caching(*args, **kwargs):
            key = keyfunc(*args, **kwargs)
            cache: BaseCache = caches[cache_name]
            cached_tuple = cache.get(key)
            # Values are singleton tuples so that we can distinguish
            # a result of None from a missing key.
            if cached_tuple is not None:
                val = cached_tuple[0]
                try:
                    return prepo_pickle.expand(val)
                except:
                    logger.exception("Couldn't expand a pickled value. Re-caching %s", key)
                    cache.delete(key)

            val = func(*args, **kwargs)
            cache.set(key, (prepo_pickle.reduce(val),), timeout=timeout)
            return val

        return func_with_caching

    return decorator


def list_cache_keys(cache_name: str = 'default') -> List[str]:
    """List the keys that exist in the given cache"""

    cache = caches[cache_name]
    list_func = getattr(cache, "list_keys", None)
    if not list_func:  # pragma: no cover
        raise ValueError(f"Cannot list keys of cache {cache_name}: {type(cache)}")
    return list_func()


def delete_cache_data(key, cache_name='default'):
    cache = caches[cache_name]
    cache.delete(key)
