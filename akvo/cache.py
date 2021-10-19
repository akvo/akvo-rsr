import operator
import pickle
import socket
from functools import reduce, wraps
from typing import Dict, List, Tuple

import memcache
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
    """List the keys that exist in the given cache"""

    cache = caches[cache_name]
    list_func = getattr(cache, "list_keys", None)
    if not list_func:  # pragma: no cover
        raise ValueError(f"Cannot list keys of cache {cache_name}: {type(cache)}")
    return list_func()


def delete_cache_data(key, cache_name='default'):
    cache = caches[cache_name]
    cache.delete(key)


class AkvoMemcacheClient(memcache.Client):

    def get_slabs(self) -> List[Tuple[str, Dict[str, dict]]]:  # pragma: no cover
        """
        Override to fix decoding error in super().get_slabs

        Slabs are memory regions in memcache where data is stored.
        They have a unique ID (number).
        """
        data = []
        for s in self.servers:
            if not s.connect():
                continue
            if s.family == socket.AF_INET:
                name = '%s:%s (%s)' % (s.ip, s.port, s.weight)
            elif s.family == socket.AF_INET6:
                name = '[%s]:%s (%s)' % (s.ip, s.port, s.weight)
            else:
                name = 'unix:%s (%s)' % (s.address, s.weight)
            serverData = {}
            data.append((name, serverData))
            s.send_cmd('stats items')
            readline = s.readline
            while 1:
                line: bytes = readline()
                if not line or line.strip() == b'END':
                    break
                item = line.decode('ascii').strip().split(' ', 2)
                # 0 = STAT, 1 = ITEM, 2 = Value
                slab = item[1].split(':', 2)
                # 0 = items, 1 = Slab #, 2 = Name
                if slab[1] not in serverData:
                    serverData[slab[1]] = {}
                serverData[slab[1]][slab[2]] = item[2]
        return data


class AkvoMemcachedCache(MemcachedCache):

    @property
    def _cache(self):
        """Provide our AkvoMemcacheClient for cache access"""

        if getattr(self, '_client', None) is None:
            client_kwargs = dict(pickleProtocol=pickle.HIGHEST_PROTOCOL)
            client_kwargs.update(self._options)
            self._client = AkvoMemcacheClient(self._servers, **client_kwargs)
        return self._client

    def list_keys(self) -> List[str]:
        """
        List all keys in memcached

        Implementation of https://www.darkcoding.net/software/memcached-list-all-keys/
        """
        # tuples of (server name, server data)
        # server data has key: slab_id, value: slab stats
        data: List[Tuple[str, Dict[str, dict]]] = self._cache.get_slabs()
        keys = []
        slab_keys = reduce(
            operator.add,
            [list(slab_data.keys()) for _, slab_data in data],
            []
        )
        for slab_key in slab_keys:
            # List max 10,000 keys
            # tuples of (servername, server data)
            # server data has key: cache line, value: stats line
            stat_data: List[Tuple[str, Dict[str, str]]] = self._cache.get_stats(f"cachedump {slab_key} 10000")
            cache_lines = reduce(
                operator.add,
                [list(server_data.keys()) for _, server_data in stat_data],
                []
            )
            # example:
            # :1:projects_filter__user_45454__418c1b09da887315af25ccde52100faf
            for cache_line in cache_lines:
                # 0: ???, 1: id?, 2: key
                _, _id, key = cache_line.split(":", 2)
                keys.append(key)
        return keys
