import operator
import pickle
import socket
from functools import reduce
from typing import List, Tuple, Dict

import pymemcache
from django.core.cache.backends.memcached import PyMemcacheCache


class AkvoMemcacheClient(pymemcache.HashClient):

    def get_slabs(self) -> List[Tuple[str, Dict[str, dict]]]:  # pragma: no cover
        """
        Override to fix decoding error in super().get_slabs

        Slabs are memory regions in memcache where data is stored.
        They have a unique ID (number).

        FIXME: Needs to be rewritten because the dependency is changed to pymemcache
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


class AkvoMemcachedCache(PyMemcacheCache):

    @property
    def _cache(self):
        """Provide our AkvoMemcacheClient for cache access"""

        if getattr(self, '_client', None) is None:
            self._client = AkvoMemcacheClient(self._servers, **self._options)
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
