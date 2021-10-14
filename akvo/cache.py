import functools
import operator
from functools import wraps
from typing import List, Dict, Tuple

from django.conf import settings
from django.core.cache import caches
from django.core.cache.backends.memcached import MemcachedCache


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


def list_cache_keys(cache_name: str = 'default') -> List[str]:
    cache = caches[cache_name]
    list_func = getattr(cache, "list_keys")
    if not list_func:
        raise ValueError(f"Cannot list keys of cache {cache_name}: {type(cache)}")
    return list_func()


def delete_cache_data(key, cache_name='default'):
    cache = caches[cache_name]
    cache.delete(key)


class AkvoMemcachedCache(MemcachedCache):

    def list_keys(self) -> List[str]:
        """
        List all keys in memcached

        Implementation of https://www.darkcoding.net/software/memcached-list-all-keys/
        """
        data: List[Tuple[str, Dict[str, str]]] = self.client.get_slabs()
        keys = []
        slab_keys = functools.reduce(
            operator.add,
            [list(slab_data.keys()) for _, slab_data in data],
            []
        )
        for slab_key in slab_keys:
            # List max 10,000 keys
            stat_data: List[Tuple[str, Dict[str, str]]] = self.client.get_stats(f"cachedump {slab_key} 10000")
            cache_lines = functools.reduce(
                operator.add,
                [list(server_data.keys()) for _, server_data in stat_data],
                []
            )
            # ITEM views.decorators.cache.cache_page..8427e [7736 b; 1256056128 s]
            for cache_line in cache_lines:
                # 0: ITEM, 1: key, 3: stats
                _, key, stats = cache_line.split(" ", 2)
                keys.append(key)
        return keys