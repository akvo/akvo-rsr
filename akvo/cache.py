from functools import wraps

from django.conf import settings
from django.core.cache import caches


def cache_with_key(keyfunc, timeout=settings.RSR_CACHE_SECONDS, cache_name='default'):
    """Decorator which applies Django caching to a function.

       Decorator argument is a function which computes a cache key
       from the original function's arguments.  You are responsible
       for avoiding collisions with other uses of this decorator or
       other uses of caching."""

    def decorator(func):
        @wraps(func)
        def func_with_caching(*args, **kwargs):
            key = keyfunc(*args, **kwargs)
            cache = caches[cache_name]
            val = cache.get(key)
            # Values are singleton tuples so that we can distinguish
            # a result of None from a missing key.
            if val is not None:
                return val[0]
            val = func(*args, **kwargs)
            cache.set(key, (val,), timeout=timeout)
            return val
        return func_with_caching

    return decorator


def delete_cache_data(key, cache_name='default'):
    cache = caches[cache_name]
    cache.delete(key)
