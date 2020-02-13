from functools import wraps

from django.conf import settings
from django.core.cache import cache
from django.utils.cache import get_cache_key, _generate_cache_header_key


def cache_with_key(keyfunc, timeout=settings.RSR_CACHE_SECONDS):
    """Decorator which applies Django caching to a function.

       Decorator argument is a function which computes a cache key
       from the original function's arguments.  You are responsible
       for avoiding collisions with other uses of this decorator or
       other uses of caching."""

    def decorator(func):
        @wraps(func)
        def func_with_caching(*args, **kwargs):
            key = keyfunc(*args, **kwargs)
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


def delete_cache(keyfunc, *args, **kwargs):
    key = keyfunc(*args, **kwargs)
    cache.delete(key)


def get_cached_data(request, key_prefix, data, serializer):
    """Function to get serialized data from the cache based on the request."""

    # Set the cache_header_key, if it hasn't already been set
    cache_header_key = _generate_cache_header_key(key_prefix, request)
    if cache.get(cache_header_key) is None:
        cache.set(cache_header_key, [], None)

    cache_key = get_cache_key(request, key_prefix)
    cached_data = cache.get(cache_key, None)
    cache_used = True
    if not cached_data and data is not None:
        cache_used = False
        cached_data = serializer(data, many=True).data
        cache.set(cache_key, cached_data)

    return cached_data, cache_used


def set_cached_data(request, key_prefix, data):
    """Function to save data to the cache based on the request.

    NOTE: The function should always be called after calling get_cached_data.
    Currently, the function is only used once.

    """

    cache_key = get_cache_key(request, key_prefix)
    cache.set(cache_key, data)
