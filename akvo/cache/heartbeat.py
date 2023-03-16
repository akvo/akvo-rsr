import datetime
import logging
from threading import Event, Thread
from typing import Union

from django.core.cache import cache


class CacheHeartbeat(Thread):
    """
    Thread to update set a cache key with a max life and refresh it as long as the thread is alive

    The thread can be ended by setting the `event_end` flag
    """

    def __init__(self, cache_key: str, key_timeout: float = 30.0, beat_interval: int = 3):
        """
        :param cache_key: The cache key to keep alive
        :param key_timeout: How long the cache key should live without the heartbeat thread
        :param beat_interval: How often per timeout the key should "beat"
        """
        super().__init__()
        self.cache_key = cache_key
        self.event_end = Event()
        self.key_timeout = key_timeout
        self.beat_interval = beat_interval

    def run(self) -> None:
        logger = logging.getLogger("akvo.rsr.CacheHeartBeat")
        logger.info("Starting cache heartbeat for '%s' with timeout %s", self.cache_key, self.key_timeout)
        self.event_end.clear()
        while not self.event_end.is_set():
            # Refresh the heartbeat
            self.set_cache_value()
            self.event_end.wait(self.key_timeout / self.beat_interval)

        cache.delete(self.cache_key)
        logger.info("Ended cache heartbeat for '%s'", self.cache_key)

    def set_cache_value(self):
        cache.set(self.cache_key, self.get_calc_value(), self.key_timeout)

    def get_calc_value(self) -> Union[str, int, float]:
        return datetime.datetime.utcnow().timestamp()
