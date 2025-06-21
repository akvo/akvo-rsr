"""
Cache Management System for Memory Protection

This module provides TTL policies and size limits for cached properties
to prevent memory exhaustion in production environments.
"""

import functools
import logging
import threading
import time
from collections import OrderedDict
from typing import Any, Dict, Optional, Callable

from django.conf import settings

logger = logging.getLogger(__name__)

# Default cache settings
DEFAULT_CACHE_TTL = getattr(settings, 'RSR_CACHE_TTL', 3600)  # 1 hour
DEFAULT_CACHE_MAX_SIZE = getattr(settings, 'RSR_CACHE_MAX_SIZE', 1000)  # items per cache
DEFAULT_CACHE_CLEANUP_INTERVAL = getattr(settings, 'RSR_CACHE_CLEANUP_INTERVAL', 300)  # 5 minutes


class TTLCache:
    """
    Thread-safe TTL cache with size limits and automatic cleanup.

    Features:
    - Time-to-live expiration for cache entries
    - Maximum size limits with LRU eviction
    - Automatic cleanup of expired entries
    - Thread-safe operations
    - Memory usage tracking
    """

    def __init__(self, max_size: int = DEFAULT_CACHE_MAX_SIZE, ttl: int = DEFAULT_CACHE_TTL):
        self.max_size = max_size
        self.ttl = ttl
        self._cache: OrderedDict = OrderedDict()
        self._expiry_times: Dict[str, float] = {}
        self._lock = threading.RLock()
        self._last_cleanup = time.time()

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache, returning None if expired or missing"""
        with self._lock:
            current_time = time.time()

            # Check if key exists and not expired
            if key in self._cache and current_time < self._expiry_times.get(key, 0):
                # Move to end (LRU)
                self._cache.move_to_end(key)
                return self._cache[key]

            # Remove expired key
            if key in self._cache:
                del self._cache[key]
                self._expiry_times.pop(key, None)

            return None

    def set(self, key: str, value: Any) -> None:
        """Set value in cache with TTL"""
        with self._lock:
            current_time = time.time()

            # Set value and expiry time
            self._cache[key] = value
            self._expiry_times[key] = current_time + self.ttl

            # Move to end (LRU)
            self._cache.move_to_end(key)

            # Enforce size limit
            while len(self._cache) > self.max_size:
                oldest_key = next(iter(self._cache))
                del self._cache[oldest_key]
                self._expiry_times.pop(oldest_key, None)

            # Periodic cleanup
            if current_time - self._last_cleanup > DEFAULT_CACHE_CLEANUP_INTERVAL:
                self._cleanup_expired()
                self._last_cleanup = current_time

    def _cleanup_expired(self) -> int:
        """Remove all expired entries, return count removed"""
        current_time = time.time()
        expired_keys = [
            key for key, expiry in self._expiry_times.items()
            if current_time >= expiry
        ]

        for key in expired_keys:
            self._cache.pop(key, None)
            self._expiry_times.pop(key, None)

        if expired_keys:
            logger.debug(f"TTLCache cleaned up {len(expired_keys)} expired entries")

        return len(expired_keys)

    def clear(self) -> None:
        """Clear all cache entries"""
        with self._lock:
            self._cache.clear()
            self._expiry_times.clear()

    def stats(self) -> Dict[str, Any]:
        """Return cache statistics"""
        with self._lock:
            current_time = time.time()
            expired_count = sum(
                1 for expiry in self._expiry_times.values()
                if current_time >= expiry
            )

            return {
                'size': len(self._cache),
                'max_size': self.max_size,
                'expired_entries': expired_count,
                'ttl_seconds': self.ttl,
                'utilization_percent': (len(self._cache) / self.max_size) * 100
            }


class CacheManager:
    """
    Global cache manager for tracking and managing all TTL caches.

    Features:
    - Centralized cache registration and monitoring
    - Global cleanup operations
    - Memory usage tracking across all caches
    - Cache statistics and health monitoring
    """

    def __init__(self):
        self._caches: Dict[str, TTLCache] = {}
        self._lock = threading.RLock()

    def get_cache(self, name: str, max_size: int = DEFAULT_CACHE_MAX_SIZE,
                  ttl: int = DEFAULT_CACHE_TTL) -> TTLCache:
        """Get or create a named cache"""
        with self._lock:
            if name not in self._caches:
                self._caches[name] = TTLCache(max_size=max_size, ttl=ttl)
                logger.info(f"Created TTL cache '{name}' with max_size={max_size}, ttl={ttl}s")
            return self._caches[name]

    def cleanup_all(self) -> Dict[str, int]:
        """Cleanup all registered caches, return cleanup counts"""
        cleanup_counts = {}
        with self._lock:
            for name, cache in self._caches.items():
                try:
                    count = cache._cleanup_expired()
                    cleanup_counts[name] = count
                except Exception as e:
                    logger.error(f"Error cleaning cache '{name}': {e}")
                    cleanup_counts[name] = -1

        total_cleaned = sum(count for count in cleanup_counts.values() if count >= 0)
        if total_cleaned > 0:
            logger.info(f"Global cache cleanup removed {total_cleaned} expired entries")

        return cleanup_counts

    def clear_all(self) -> None:
        """Clear all registered caches"""
        with self._lock:
            for cache in self._caches.values():
                cache.clear()
            logger.info("Cleared all TTL caches")

    def get_global_stats(self) -> Dict[str, Any]:
        """Get statistics for all caches"""
        stats = {}
        total_size = 0
        total_max_size = 0

        with self._lock:
            for name, cache in self._caches.items():
                cache_stats = cache.stats()
                stats[name] = cache_stats
                total_size += cache_stats['size']
                total_max_size += cache_stats['max_size']

        stats['_global'] = {
            'total_caches': len(self._caches),
            'total_entries': total_size,
            'total_max_entries': total_max_size,
            'global_utilization_percent': (total_size / total_max_size * 100) if total_max_size else 0
        }

        return stats


# Global cache manager instance
cache_manager = CacheManager()


def ttl_cached_property(ttl: int = DEFAULT_CACHE_TTL, max_size: int = DEFAULT_CACHE_MAX_SIZE):
    """
    Decorator for cached properties with TTL and size limits.

    Usage:
        @ttl_cached_property(ttl=1800, max_size=500)
        def expensive_property(self):
            return expensive_computation()
    """
    def decorator(func: Callable) -> property:
        cache_name = f"{func.__module__}.{func.__qualname__}"
        ttl_cache = cache_manager.get_cache(cache_name, max_size=max_size, ttl=ttl)

        def getter(self):
            # Create cache key based on object identity and function name
            cache_key = f"{id(self)}_{func.__name__}"

            # Try to get from cache
            result = ttl_cache.get(cache_key)
            if result is not None:
                return result

            # Compute and cache result
            result = func(self)
            ttl_cache.set(cache_key, result)
            return result

        def deleter(self):
            # Clear cache entry for this object
            cache_key = f"{id(self)}_{func.__name__}"
            ttl_cache._cache.pop(cache_key, None)
            ttl_cache._expiry_times.pop(cache_key, None)

        return property(getter, None, deleter, func.__doc__)

    return decorator


def cached_method(ttl: int = DEFAULT_CACHE_TTL, max_size: int = DEFAULT_CACHE_MAX_SIZE):
    """
    Decorator for caching method results with TTL and size limits.

    Usage:
        @cached_method(ttl=900, max_size=200)
        def expensive_method(self, param1, param2):
            return expensive_computation(param1, param2)
    """
    def decorator(func: Callable) -> Callable:
        cache_name = f"{func.__module__}.{func.__qualname__}"
        ttl_cache = cache_manager.get_cache(cache_name, max_size=max_size, ttl=ttl)

        @functools.wraps(func)
        def wrapper(self, *args, **kwargs):
            # Create cache key from object, args, and kwargs
            cache_key = f"{id(self)}_{func.__name__}_{hash((args, tuple(sorted(kwargs.items()))))}"

            # Try to get from cache
            result = ttl_cache.get(cache_key)
            if result is not None:
                return result

            # Compute and cache result
            result = func(self, *args, **kwargs)
            ttl_cache.set(cache_key, result)
            return result

        return wrapper

    return decorator
