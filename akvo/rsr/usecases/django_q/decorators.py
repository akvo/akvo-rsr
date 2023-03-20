import datetime
import logging
from datetime import timedelta
from functools import wraps
from typing import Callable

from django.conf import settings
from django.core.cache import cache

from akvo.cache.heartbeat import CacheHeartbeat

UNIQUE_KEY_FORMAT = "unique_django_q:{task_name}"


def unique_task(task_name: str) -> Callable[[Callable], Callable]:
    """
    Creates a decorator to ensure that the task isn't executed in parallel

    :param task_name: The task's unique name
    :return: A decorator
    """

    def decorator(func):

        @wraps(func)
        def wrapper(*args, **kwargs):
            logger = logging.getLogger("akvo.rsr.unique_task_wrapper")

            cache_key = UNIQUE_KEY_FORMAT.format(task_name=task_name)
            cached_time_utc: float = cache.get(cache_key)

            if cached_time_utc:
                key_timeout = settings.UNIQUE_TASK_KEY_TIMEOUT
                # Key timed out?
                if cached_time_utc < (datetime.datetime.utcnow() - timedelta(seconds=key_timeout)).timestamp():
                    cache.delete(cache_key)
                else:
                    logger.info("%s has a valid unique task heartbeat. Skipping run...", task_name)
                    return

            heartbeat_thread = get_unique_cache_heartbeat(cache_key)
            heartbeat_thread.start()
            try:
                return func(*args, **kwargs)
            finally:
                # Let the heartbeat thread end
                logger.info("Signaling '%s' heartbeat thread should end", task_name)
                heartbeat_thread.event_end.set()

                # Clean up the cache
                try:
                    cache.delete(cache_key)
                except:
                    logger.warning("Couldn't delete cache key %s", cache_key, exc_info=True)

        return wrapper

    return decorator


def get_unique_cache_heartbeat(cache_key):
    return CacheHeartbeat(cache_key, key_timeout=settings.UNIQUE_TASK_KEY_TIMEOUT)
