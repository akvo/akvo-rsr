from typing import List

from pymemcache.serde import python_memcache_deserializer
from pymemcache.serde import python_memcache_serializer
from django.core.cache.backends.memcached import PyMemcacheCache


class AkvoMemcachedCache(PyMemcacheCache):

    def __init__(self, server, params):
        super().__init__(server, params)
        self._options = {
            'serializer': python_memcache_serializer,
            'deserializer': python_memcache_deserializer,
            **self._options,
        }

    def list_keys(self) -> List[str]:
        """
        List all keys in memcached

        Implementation of https://www.darkcoding.net/software/memcached-list-all-keys/
        """
        keys = []
        for client in self._cache.clients.values():
            slab_keys = set()
            items = client.stats('items')
            for item in items.keys():
                slab = item.decode('ascii').split(':')
                slab_keys.add(slab[1])
            for slab_key in slab_keys:
                data = client.stats('cachedump', str(slab_key), '10000')
                for raw_key in data.keys():
                    # raw_key format "%s:%s:%s" (django.core.cache.backends.base.default_key_func)
                    key = raw_key.decode('ascii').split(':', 2)
                    if len(key) < 3:
                        continue
                    keys.append(key[2])
        return keys
