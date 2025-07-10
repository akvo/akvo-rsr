# Memory Protection Testing Guide

Comprehensive guide for testing memory protection mechanisms in Akvo RSR.

## Test Structure Overview

The memory protection test suite is organized to cover all components:

```
akvo/rsr/tests/
├── test_cache_management.py          # TTL cache system tests
├── commands/
│   └── test_cleanup_deletion_tracker.py  # Deletion tracker command tests
├── models/
│   └── test_project.py              # Project deletion tests
├── rest/
│   └── test_project_children_simple.py  # Chunked processing tests
└── usecases/
    └── test_period_update_aggregation.py  # Aggregation depth tests
```

## TTL Cache Testing

### Test File: `akvo/rsr/tests/test_cache_management.py`

#### Basic Cache Operations

```python
class TTLCacheTest(TestCase):
    def test_basic_cache_operations(self):
        """Test fundamental get/set operations"""
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
```

#### Memory Management Tests

```python
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

    # Adding key3 should now evict key2 (not key1)
    cache.set('key3', 'value3')

    self.assertEqual(cache.get('key1'), 'value1')  # Still there
    self.assertIsNone(cache.get('key2'))          # Evicted
    self.assertEqual(cache.get('key3'), 'value3')
```

#### Thread Safety Tests

```python
def test_thread_safety(self):
    """Test concurrent access from multiple threads"""
    cache = TTLCache(max_size=100, ttl=10)
    errors = []

    def worker(thread_id):
        try:
            for i in range(50):
                key = f'thread_{thread_id}_key_{i}'
                value = f'thread_{thread_id}_value_{i}'
                cache.set(key, value)

                retrieved = cache.get(key)
                if retrieved != value:
                    errors.append(f'Mismatch in thread {thread_id}: {value} != {retrieved}')
        except Exception as e:
            errors.append(f'Exception in thread {thread_id}: {e}')

    threads = []
    for i in range(5):
        thread = threading.Thread(target=worker, args=(i,))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    self.assertEqual(len(errors), 0, f'Thread safety errors: {errors}')
```

#### Statistics Tests

```python
def test_cache_statistics(self):
    """Test cache statistics accuracy"""
    cache = TTLCache(max_size=5, ttl=1)

    # Initial stats
    stats = cache.stats()
    self.assertEqual(stats['size'], 0)
    self.assertEqual(stats['max_size'], 5)
    self.assertEqual(stats['utilization_percent'], 0)

    # Add some entries
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')

    stats = cache.stats()
    self.assertEqual(stats['size'], 2)
    self.assertEqual(stats['utilization_percent'], 40)  # 2/5 * 100
```

### CacheManager Tests

```python
class CacheManagerTest(TestCase):
    def test_cache_creation_and_retrieval(self):
        """Test named cache creation and retrieval"""
        manager = CacheManager()

        # Get cache (creates if doesn't exist)
        cache1 = manager.get_cache('test_cache', max_size=10, ttl=5)
        cache2 = manager.get_cache('test_cache')  # Should return same instance

        self.assertIs(cache1, cache2)
        self.assertEqual(cache1.max_size, 10)
        self.assertEqual(cache1.ttl, 5)

    def test_global_cleanup(self):
        """Test cleanup across all caches"""
        manager = CacheManager()

        cache1 = manager.get_cache('cache1', ttl=0.1)
        cache2 = manager.get_cache('cache2', ttl=0.1)

        # Add entries to both caches
        cache1.set('key1', 'value1')
        cache2.set('key2', 'value2')

        # Wait for expiration
        time.sleep(0.15)

        # Trigger global cleanup
        cleanup_counts = manager.cleanup_all()

        self.assertEqual(cleanup_counts['cache1'], 1)
        self.assertEqual(cleanup_counts['cache2'], 1)
```

### Decorator Tests

```python
class DecoratorTest(TestCase):
    def test_cached_property(self):
        """Test @ttl_cached_property decorator"""

        class TestModel:
            def __init__(self):
                self.call_count = 0

            @ttl_cached_property(ttl=1, max_size=10)
            def expensive_property(self):
                self.call_count += 1
                return f'computed_value_{self.call_count}'

        model = TestModel()

        # First call should compute
        result1 = model.expensive_property
        self.assertEqual(model.call_count, 1)
        self.assertEqual(result1, 'computed_value_1')

        # Second call should return cached value
        result2 = model.expensive_property
        self.assertEqual(model.call_count, 1)  # Not incremented
        self.assertEqual(result2, 'computed_value_1')

        # Delete property to clear cache
        del model.expensive_property

        # Next call should compute again
        result3 = model.expensive_property
        self.assertEqual(model.call_count, 2)
        self.assertEqual(result3, 'computed_value_2')

    def test_cached_method(self):
        """Test @cached_method decorator"""

        class TestModel:
            def __init__(self):
                self.call_count = 0

            @cached_method(ttl=1, max_size=10)
            def expensive_method(self, param1, param2='default'):
                self.call_count += 1
                return f'computed_{param1}_{param2}_{self.call_count}'

        model = TestModel()

        # Different parameters should trigger computation
        result1 = model.expensive_method('a', 'b')
        result2 = model.expensive_method('a', 'c')
        self.assertEqual(model.call_count, 2)

        # Same parameters should return cached value
        result3 = model.expensive_method('a', 'b')
        self.assertEqual(model.call_count, 2)  # Not incremented
        self.assertEqual(result3, result1)
```

## Project Deletion Tracker Testing

### Test File: `akvo/rsr/tests/commands/test_cleanup_deletion_tracker.py`

```python
class DeletionTrackerTest(TestCase):
    def test_basic_tracking(self):
        """Test basic add/remove/contains operations"""
        tracker = ProjectDeletionTracker()

        # Initially empty
        self.assertNotIn(123, tracker)

        # Add and check
        tracker.add(123)
        self.assertIn(123, tracker)

        # Remove and check
        tracker.discard(123)
        self.assertNotIn(123, tracker)

    def test_automatic_cleanup(self):
        """Test automatic cleanup of stale entries"""
        tracker = ProjectDeletionTracker()
        tracker._cleanup_threshold = 0.1  # 100ms for testing

        tracker.add(123)
        self.assertIn(123, tracker)

        # Wait for staleness
        time.sleep(0.15)

        # Adding another entry should trigger cleanup
        tracker.add(456)

        self.assertNotIn(123, tracker)  # Should be cleaned up
        self.assertIn(456, tracker)     # Should remain

    def test_force_cleanup(self):
        """Test manual force cleanup"""
        tracker = ProjectDeletionTracker()
        tracker._cleanup_threshold = 0.1  # 100ms for testing

        tracker.add(123)
        tracker.add(456)

        # Wait for staleness
        time.sleep(0.15)

        # Force cleanup
        cleaned_count = tracker.force_cleanup()

        self.assertEqual(cleaned_count, 2)
        self.assertNotIn(123, tracker)
        self.assertNotIn(456, tracker)
```

### Management Command Tests

```python
class CleanupDeletionTrackerCommandTest(TestCase):
    def test_stats_command(self):
        """Test stats output"""
        DELETION_SET.add(123)
        DELETION_SET.add(456)

        out = StringIO()
        call_command('cleanup_deletion_tracker', '--stats', stdout=out)
        output = out.getvalue()

        self.assertIn('Active deletions: 2', output)
        self.assertIn('Tracked timestamps: 2', output)

    def test_dry_run_command(self):
        """Test dry run functionality"""
        DELETION_SET.add(123)

        out = StringIO()
        call_command('cleanup_deletion_tracker', '--dry-run', stdout=out)
        output = out.getvalue()

        # Should still be tracked after dry run
        self.assertIn(123, DELETION_SET)
```

## Chunked Processing Testing

### Test File: `akvo/rest/tests/test_project_children_simple.py`

```python
class ChunkedProcessingTest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.parent_project = ProjectFactory()

        # Create many child projects
        self.children = []
        for i in range(150):  # Enough to trigger chunking
            child = ProjectFactory(parent=self.parent_project)
            self.children.append(child)

    @override_settings(RSR_DESCENDANTS_CHUNK_SIZE=50)
    def test_chunked_processing(self):
        """Test that large hierarchies are processed in chunks"""
        self.client.force_authenticate(user=self.user)

        url = f'/rest/v1/project/{self.parent_project.id}/children/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        # Check memory protection headers
        self.assertIn('X-Total-Processed', response)
        self.assertIn('X-Children-Count', response)
        self.assertIn('X-Memory-Protection', response)
        self.assertEqual(response['X-Memory-Protection'], 'chunked')

        # Should process all children
        self.assertEqual(int(response['X-Total-Processed']), 150)

    @override_settings(RSR_MAX_DESCENDANTS_PER_REQUEST=100)
    def test_response_truncation(self):
        """Test that responses are truncated when too large"""
        self.client.force_authenticate(user=self.user)

        url = f'/rest/v1/project/{self.parent_project.id}/children/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['X-Truncated'], 'true')

        # Should return exactly the limit
        data = response.json()
        self.assertEqual(len(data), 100)
```

## Aggregation Depth Testing

### Test File: `akvo/rsr/tests/usecases/test_period_update_aggregation.py`

```python
class AggregationDepthTest(TestCase):
    def setUp(self):
        # Create a deep project hierarchy
        self.projects = []
        parent = None

        for i in range(10):  # Create 10-level hierarchy
            project = ProjectFactory(parent=parent)
            self.projects.append(project)
            parent = project

    @override_settings(RSR_MAX_AGGREGATION_DEPTH=5)
    def test_depth_limiting(self):
        """Test that aggregation respects depth limits"""
        # Create periods for the hierarchy
        periods = []
        for project in self.projects:
            result = ResultFactory(project=project)
            indicator = IndicatorFactory(result=result)
            period = IndicatorPeriodFactory(indicator=indicator)
            periods.append(period)

        # Link periods in hierarchy
        for i in range(1, len(periods)):
            periods[i].parent_period = periods[i-1]
            periods[i].save()

        # Start aggregation from deepest period
        deepest_period = periods[-1]

        with self.assertLogs('akvo.rsr.usecases.period_update_aggregation', level='WARNING') as logs:
            aggregate(deepest_period)

        # Should log depth warning
        warning_found = any('Maximum aggregation depth' in log for log in logs.output)
        self.assertTrue(warning_found)

    def test_circular_reference_detection(self):
        """Test detection of circular references"""
        # Create circular reference in periods
        period1 = IndicatorPeriodFactory()
        period2 = IndicatorPeriodFactory(parent_period=period1)
        period1.parent_period = period2  # Creates cycle
        period1.save()

        with self.assertLogs('akvo.rsr.usecases.period_update_aggregation', level='WARNING') as logs:
            aggregate(period1)

        # Should log circular reference warning
        warning_found = any('Circular reference detected' in log for log in logs.output)
        self.assertTrue(warning_found)
```

## Memory-Aware Test Utilities

### Custom Test Mixins

```python
class MemoryProtectionTestMixin:
    """Mixin providing memory protection test utilities"""

    def assert_cache_empty(self, cache_name):
        """Assert that a named cache is empty"""
        cache = cache_manager._caches.get(cache_name)
        if cache:
            self.assertEqual(len(cache._cache), 0, f"Cache '{cache_name}' is not empty")

    def assert_cache_size(self, cache_name, expected_size):
        """Assert cache has expected number of entries"""
        cache = cache_manager._caches.get(cache_name)
        self.assertIsNotNone(cache, f"Cache '{cache_name}' not found")
        self.assertEqual(len(cache._cache), expected_size)

    def assert_deletion_tracker_empty(self):
        """Assert deletion tracker is empty"""
        with DELETION_SET._lock:
            self.assertEqual(len(DELETION_SET._deletion_set), 0)
            self.assertEqual(len(DELETION_SET._timestamps), 0)

    def create_cache_pressure(self, cache, num_entries):
        """Create memory pressure by filling cache"""
        for i in range(num_entries):
            cache.set(f'pressure_key_{i}', f'pressure_value_{i}')

    def measure_memory_growth(self, operation, iterations=100):
        """Measure memory growth during repeated operations"""
        import psutil
        import os

        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss

        for i in range(iterations):
            operation()

        final_memory = process.memory_info().rss
        growth = final_memory - initial_memory

        return {
            'initial_memory': initial_memory,
            'final_memory': final_memory,
            'growth_bytes': growth,
            'growth_percent': (growth / initial_memory) * 100
        }
```

### Memory Leak Detection Tests

```python
class MemoryLeakDetectionTest(TestCase, MemoryProtectionTestMixin):
    def test_cache_memory_bounded(self):
        """Test that caches don't grow unbounded"""
        cache = TTLCache(max_size=10, ttl=1)

        def fill_cache():
            for i in range(20):  # More than max_size
                cache.set(f'key_{i}', f'value_{i}')

        memory_stats = self.measure_memory_growth(fill_cache, iterations=10)

        # Memory growth should be minimal due to size limits
        self.assertLess(memory_stats['growth_percent'], 50,
                       "Cache memory growth exceeded expected bounds")

        # Cache should not exceed max size
        self.assertLessEqual(len(cache._cache), 10)

    def test_deletion_tracker_cleanup(self):
        """Test that deletion tracker cleans up properly"""
        def add_and_remove():
            for i in range(10):
                DELETION_SET.add(i)
                DELETION_SET.discard(i)

        memory_stats = self.measure_memory_growth(add_and_remove, iterations=100)

        # Should have minimal growth due to cleanup
        self.assertLess(memory_stats['growth_percent'], 25)

        # Tracker should be empty
        self.assert_deletion_tracker_empty()
```

## Performance Testing

### Cache Performance Tests

```python
class CachePerformanceTest(TestCase):
    def test_cache_performance_under_load(self):
        """Test cache performance with high load"""
        cache = TTLCache(max_size=1000, ttl=60)

        # Warm up cache
        for i in range(500):
            cache.set(f'key_{i}', f'value_{i}')

        # Measure get performance
        start_time = time.time()
        for i in range(1000):
            cache.get(f'key_{i % 500}')  # Mix hits and misses
        get_time = time.time() - start_time

        # Measure set performance
        start_time = time.time()
        for i in range(1000):
            cache.set(f'new_key_{i}', f'new_value_{i}')
        set_time = time.time() - start_time

        # Performance should be reasonable
        self.assertLess(get_time, 0.1, "Cache get operations too slow")
        self.assertLess(set_time, 0.2, "Cache set operations too slow")

    def test_concurrent_access_performance(self):
        """Test performance under concurrent access"""
        cache = TTLCache(max_size=1000, ttl=60)
        results = {'errors': 0, 'operations': 0}

        def worker():
            try:
                for i in range(100):
                    key = f'key_{threading.current_thread().ident}_{i}'
                    cache.set(key, f'value_{i}')
                    retrieved = cache.get(key)
                    if retrieved is not None:
                        results['operations'] += 1
            except Exception:
                results['errors'] += 1

        start_time = time.time()
        threads = [threading.Thread(target=worker) for _ in range(10)]

        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()

        total_time = time.time() - start_time

        self.assertEqual(results['errors'], 0)
        self.assertGreater(results['operations'], 900)  # Should complete most operations
        self.assertLess(total_time, 2.0, "Concurrent operations too slow")
```

## Integration Testing

### End-to-End Memory Protection Tests

```python
class MemoryProtectionIntegrationTest(APITestCase, MemoryProtectionTestMixin):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def test_full_memory_protection_workflow(self):
        """Test complete memory protection during project operations"""
        # Create large hierarchy
        parent = ProjectFactory()
        children = [ProjectFactory(parent=parent) for _ in range(200)]

        # Test chunked API response
        response = self.client.get(f'/rest/v1/project/{parent.id}/children/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['X-Memory-Protection'], 'chunked')

        # Test cache usage during operations
        initial_stats = cache_manager.get_global_stats()

        # Perform operations that should use caching
        for i in range(10):
            self.client.get(f'/rest/v1/project/{parent.id}/')

        final_stats = cache_manager.get_global_stats()

        # Should have created and used caches
        self.assertGreater(final_stats['_global']['total_entries'],
                          initial_stats['_global']['total_entries'])

        # Test deletion tracking
        project_to_delete = children[0]
        DELETION_SET.add(project_to_delete.id)

        self.assertIn(project_to_delete.id, DELETION_SET)

        # Simulate deletion completion
        DELETION_SET.discard(project_to_delete.id)
        self.assertNotIn(project_to_delete.id, DELETION_SET)
```

## Test Configuration

### Settings for Testing

```python
# In test settings
RSR_CACHE_TTL = 1                      # Short TTL for testing
RSR_CACHE_MAX_SIZE = 10                # Small caches for testing
RSR_CACHE_CLEANUP_INTERVAL = 0.1       # Frequent cleanup for testing

RSR_MAX_DESCENDANTS_PER_REQUEST = 50   # Small responses for testing
RSR_DESCENDANTS_CHUNK_SIZE = 25        # Small chunks for testing

RSR_MAX_AGGREGATION_DEPTH = 10         # Shallow depth for testing
```

### Test Runners and Fixtures

```python
class MemoryTestCase(TestCase):
    """Base test case with memory protection setup"""

    def setUp(self):
        super().setUp()
        # Clear all caches before each test
        cache_manager.clear_all()

        # Clear deletion tracker
        DELETION_SET.force_cleanup()

    def tearDown(self):
        # Clean up after test
        cache_manager.clear_all()
        DELETION_SET.force_cleanup()
        super().tearDown()
```

## Best Practices for Testing Memory Protection

### Test Design Principles

1. **Isolation**: Each test should start with clean caches and trackers
2. **Determinism**: Use fixed TTLs and sizes for predictable behavior
3. **Coverage**: Test both success and failure scenarios
4. **Performance**: Include performance regression tests
5. **Integration**: Test interactions between components

### Common Test Patterns

```python
# Pattern 1: Test with temporary settings
@override_settings(RSR_CACHE_TTL=0.1)
def test_with_short_ttl(self):
    # Test behavior with very short TTL
    pass

# Pattern 2: Test async cleanup
def test_async_cleanup(self):
    # Setup conditions
    # Trigger async operation
    # Wait for completion
    # Assert results
    pass

# Pattern 3: Test memory pressure
def test_under_memory_pressure(self):
    # Fill caches to capacity
    # Perform operations
    # Assert graceful degradation
    pass
```

### Memory Testing Utilities

```python
def assert_memory_stable(test_func, iterations=10, threshold_percent=25):
    """Assert that a function doesn't cause significant memory growth"""
    import psutil
    import os

    process = psutil.Process(os.getpid())
    initial_memory = process.memory_info().rss

    for _ in range(iterations):
        test_func()
        # Optional: Force garbage collection
        import gc
        gc.collect()

    final_memory = process.memory_info().rss
    growth_percent = ((final_memory - initial_memory) / initial_memory) * 100

    assert growth_percent < threshold_percent, \
        f"Memory growth {growth_percent:.1f}% exceeds threshold {threshold_percent}%"
```

This comprehensive testing guide ensures that all memory protection mechanisms are thoroughly validated and continue to work correctly as the codebase evolves.
