"""
Tests for TTL cache management system
"""
import time
import threading

from django.test import TestCase, override_settings
from akvo.rsr.cache_management import TTLCache, CacheManager, cache_manager, ttl_cached_property, cached_method


class TTLCacheTest(TestCase):
    """Test TTL cache functionality"""

    def test_basic_cache_operations(self):
        """Test basic get/set operations"""
        cache = TTLCache(max_size=3, ttl=1)

        # Test set and get
        cache.set('key1', 'value1')
        self.assertEqual(cache.get('key1'), 'value1')

        # Test missing key
        self.assertIsNone(cache.get('nonexistent'))

    def test_ttl_expiration(self):
        """Test that entries expire after TTL"""
        cache = TTLCache(max_size=10, ttl=0.1)  # 100ms TTL

        cache.set('key1', 'value1')
        self.assertEqual(cache.get('key1'), 'value1')

        # Wait for expiration
        time.sleep(0.15)
        self.assertIsNone(cache.get('key1'))

    def test_lru_eviction(self):
        """Test LRU eviction when max size exceeded"""
        cache = TTLCache(max_size=2, ttl=10)

        cache.set('key1', 'value1')
        cache.set('key2', 'value2')
        cache.set('key3', 'value3')  # Should evict key1

        self.assertIsNone(cache.get('key1'))
        self.assertEqual(cache.get('key2'), 'value2')
        self.assertEqual(cache.get('key3'), 'value3')

    def test_lru_reordering(self):
        """Test that accessing keys moves them to end of LRU order"""
        cache = TTLCache(max_size=2, ttl=10)

        cache.set('key1', 'value1')
        cache.set('key2', 'value2')

        # Access key1 to move it to end
        cache.get('key1')

        # Add key3, should evict key2 (not key1)
        cache.set('key3', 'value3')

        self.assertEqual(cache.get('key1'), 'value1')
        self.assertIsNone(cache.get('key2'))
        self.assertEqual(cache.get('key3'), 'value3')

    def test_cleanup_expired(self):
        """Test manual cleanup of expired entries"""
        cache = TTLCache(max_size=10, ttl=0.1)

        cache.set('key1', 'value1')
        cache.set('key2', 'value2')

        time.sleep(0.15)
        cleaned = cache._cleanup_expired()

        self.assertEqual(cleaned, 2)
        self.assertIsNone(cache.get('key1'))
        self.assertIsNone(cache.get('key2'))

    def test_clear(self):
        """Test clearing all cache entries"""
        cache = TTLCache(max_size=10, ttl=10)

        cache.set('key1', 'value1')
        cache.set('key2', 'value2')

        cache.clear()

        self.assertIsNone(cache.get('key1'))
        self.assertIsNone(cache.get('key2'))

    def test_stats(self):
        """Test cache statistics"""
        cache = TTLCache(max_size=5, ttl=0.1)

        cache.set('key1', 'value1')
        cache.set('key2', 'value2')

        stats = cache.stats()

        self.assertEqual(stats['size'], 2)
        self.assertEqual(stats['max_size'], 5)
        self.assertEqual(stats['ttl_seconds'], 0.1)
        self.assertEqual(stats['utilization_percent'], 40.0)

        # Wait for expiration and check expired count
        time.sleep(0.15)
        stats = cache.stats()
        self.assertEqual(stats['expired_entries'], 2)

    def test_thread_safety(self):
        """Test thread-safe operations"""
        cache = TTLCache(max_size=100, ttl=1)
        results = []

        def worker(thread_id):
            for i in range(10):
                key = f'thread_{thread_id}_key_{i}'
                value = f'thread_{thread_id}_value_{i}'
                cache.set(key, value)
                retrieved = cache.get(key)
                results.append(retrieved == value)

        threads = []
        for i in range(5):
            thread = threading.Thread(target=worker, args=(i,))
            threads.append(thread)
            thread.start()

        for thread in threads:
            thread.join()

        # All operations should succeed
        self.assertTrue(all(results))


class CacheManagerTest(TestCase):
    """Test cache manager functionality"""

    def setUp(self):
        self.manager = CacheManager()

    def test_get_cache(self):
        """Test getting or creating named caches"""
        cache1 = self.manager.get_cache('test_cache', max_size=10, ttl=5)
        cache2 = self.manager.get_cache('test_cache')  # Should return same instance

        self.assertIs(cache1, cache2)
        self.assertEqual(cache1.max_size, 10)
        self.assertEqual(cache1.ttl, 5)

    def test_cleanup_all(self):
        """Test cleanup across all caches"""
        cache1 = self.manager.get_cache('cache1', ttl=0.1)
        cache2 = self.manager.get_cache('cache2', ttl=0.1)

        cache1.set('key1', 'value1')
        cache2.set('key2', 'value2')

        time.sleep(0.15)

        cleanup_counts = self.manager.cleanup_all()

        self.assertEqual(cleanup_counts['cache1'], 1)
        self.assertEqual(cleanup_counts['cache2'], 1)

    def test_clear_all(self):
        """Test clearing all caches"""
        cache1 = self.manager.get_cache('cache1')
        cache2 = self.manager.get_cache('cache2')

        cache1.set('key1', 'value1')
        cache2.set('key2', 'value2')

        self.manager.clear_all()

        self.assertIsNone(cache1.get('key1'))
        self.assertIsNone(cache2.get('key2'))

    def test_global_stats(self):
        """Test global statistics across all caches"""
        cache1 = self.manager.get_cache('cache1', max_size=5, ttl=10)
        cache2 = self.manager.get_cache('cache2', max_size=3, ttl=10)

        cache1.set('key1', 'value1')
        cache2.set('key2', 'value2')

        stats = self.manager.get_global_stats()

        self.assertEqual(stats['_global']['total_caches'], 2)
        self.assertEqual(stats['_global']['total_entries'], 2)
        self.assertEqual(stats['_global']['total_max_entries'], 8)
        self.assertEqual(stats['_global']['global_utilization_percent'], 25.0)

        self.assertIn('cache1', stats)
        self.assertIn('cache2', stats)


class TestObject:
    """Test object for decorator tests"""

    def __init__(self):
        self.expensive_call_count = 0
        self.method_call_count = 0

    @ttl_cached_property(ttl=1, max_size=10)
    def expensive_property(self):
        self.expensive_call_count += 1
        return f"expensive_result_{self.expensive_call_count}"

    @cached_method(ttl=1, max_size=10)
    def expensive_method(self, param1, param2=None):
        self.method_call_count += 1
        return f"method_result_{param1}_{param2}_{self.method_call_count}"


class CacheDecoratorsTest(TestCase):
    """Test cache decorators"""

    def test_ttl_cached_property(self):
        """Test TTL cached property decorator"""
        obj = TestObject()

        # First access should compute value
        result1 = obj.expensive_property
        self.assertEqual(result1, "expensive_result_1")
        self.assertEqual(obj.expensive_call_count, 1)

        # Second access should return cached value
        result2 = obj.expensive_property
        self.assertEqual(result2, "expensive_result_1")
        self.assertEqual(obj.expensive_call_count, 1)

        # Wait for TTL expiration
        time.sleep(1.1)

        # Third access should recompute
        result3 = obj.expensive_property
        self.assertEqual(result3, "expensive_result_2")
        self.assertEqual(obj.expensive_call_count, 2)

    def test_cached_method(self):
        """Test cached method decorator"""
        obj = TestObject()

        # First call should compute value
        result1 = obj.expensive_method('param1', param2='param2')
        self.assertEqual(result1, "method_result_param1_param2_1")
        self.assertEqual(obj.method_call_count, 1)

        # Same call should return cached value
        result2 = obj.expensive_method('param1', param2='param2')
        self.assertEqual(result2, "method_result_param1_param2_1")
        self.assertEqual(obj.method_call_count, 1)

        # Different parameters should compute new value
        result3 = obj.expensive_method('different', param2='params')
        self.assertEqual(result3, "method_result_different_params_2")
        self.assertEqual(obj.method_call_count, 2)

    def test_property_deletion(self):
        """Test deleting cached property"""
        obj = TestObject()

        # Access property to cache it
        result1 = obj.expensive_property
        self.assertEqual(obj.expensive_call_count, 1)

        # Delete cached value
        del obj.expensive_property

        # Next access should recompute
        result2 = obj.expensive_property
        self.assertEqual(obj.expensive_call_count, 2)
        self.assertNotEqual(result1, result2)


class CacheIntegrationTest(TestCase):
    """Integration tests with Django settings"""

    @override_settings(RSR_CACHE_TTL=5, RSR_CACHE_MAX_SIZE=50)
    def test_settings_integration(self):
        """Test that cache respects Django settings"""
        # Re-import to get updated settings
        from importlib import reload
        from akvo.rsr import cache_management
        reload(cache_management)

        # Should use settings values
        self.assertEqual(cache_management.DEFAULT_CACHE_TTL, 5)
        self.assertEqual(cache_management.DEFAULT_CACHE_MAX_SIZE, 50)

    def test_global_cache_manager(self):
        """Test global cache manager instance"""
        cache1 = cache_manager.get_cache('test_cache')
        cache2 = cache_manager.get_cache('test_cache')

        self.assertIs(cache1, cache2)

        cache1.set('test_key', 'test_value')
        self.assertEqual(cache2.get('test_key'), 'test_value')
