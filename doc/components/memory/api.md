# Memory Protection API Reference

Complete API documentation for all memory management components in Akvo RSR.

## Cache Management API

### TTLCache Class

```python
class TTLCache:
    """Thread-safe TTL cache with size limits and automatic cleanup."""
```

#### Constructor

```python
def __init__(self, max_size: int = DEFAULT_CACHE_MAX_SIZE, ttl: int = DEFAULT_CACHE_TTL)
```

**Parameters**:
- `max_size` (int): Maximum number of entries in cache (default: 1000)
- `ttl` (int): Time-to-live in seconds for cache entries (default: 3600)

**Example**:
```python
cache = TTLCache(max_size=500, ttl=1800)  # 500 entries, 30 min TTL
```

#### Methods

##### get(key)

```python
def get(self, key: str) -> Optional[Any]
```

Retrieve value from cache, returns None if expired or missing.

**Parameters**:
- `key` (str): Cache key to retrieve

**Returns**:
- `Any | None`: Cached value or None if not found/expired

**Thread Safety**: Yes (uses RLock)

**Example**:
```python
value = cache.get('user_123')
if value is None:
    value = expensive_computation()
    cache.set('user_123', value)
```

##### set(key, value)

```python
def set(self, key: str, value: Any) -> None
```

Store value in cache with TTL expiration.

**Parameters**:
- `key` (str): Cache key
- `value` (Any): Value to store

**Side Effects**:
- Triggers LRU eviction if max_size exceeded
- May trigger periodic cleanup of expired entries
- Updates LRU order (moves key to end)

**Thread Safety**: Yes (uses RLock)

**Example**:
```python
cache.set('user_123', {'name': 'John', 'email': 'john@example.com'})
```

##### clear()

```python
def clear(self) -> None
```

Clear all cache entries immediately.

**Thread Safety**: Yes (uses RLock)

**Example**:
```python
cache.clear()  # Empty the cache completely
```

##### stats()

```python
def stats(self) -> Dict[str, Any]
```

Return detailed cache statistics.

**Returns**:
```python
{
    'size': int,                    # Current number of entries
    'max_size': int,               # Maximum allowed entries
    'expired_entries': int,        # Number of expired (but not yet cleaned) entries
    'ttl_seconds': int,           # TTL in seconds
    'utilization_percent': float   # Percentage of max_size currently used
}
```

**Thread Safety**: Yes (uses RLock)

**Example**:
```python
stats = cache.stats()
print(f"Cache utilization: {stats['utilization_percent']:.1f}%")
```

#### Private Methods

##### _cleanup_expired()

```python
def _cleanup_expired(self) -> int
```

Remove all expired entries and return count removed.

**Returns**:
- `int`: Number of entries removed

**Note**: Called automatically during `set()` operations at configured intervals.

### CacheManager Class

```python
class CacheManager:
    """Global cache manager for tracking and managing all TTL caches."""
```

#### Constructor

```python
def __init__(self)
```

Creates empty cache registry. Use the global `cache_manager` instance.

#### Methods

##### get_cache(name, max_size, ttl)

```python
def get_cache(self, name: str, max_size: int = DEFAULT_CACHE_MAX_SIZE,
              ttl: int = DEFAULT_CACHE_TTL) -> TTLCache
```

Get or create a named cache with specified parameters.

**Parameters**:
- `name` (str): Unique cache name
- `max_size` (int): Maximum cache size (default: 1000)
- `ttl` (int): TTL in seconds (default: 3600)

**Returns**:
- `TTLCache`: Cache instance

**Thread Safety**: Yes (uses RLock)

**Example**:
```python
user_cache = cache_manager.get_cache('users', max_size=500, ttl=1800)
project_cache = cache_manager.get_cache('projects', max_size=200, ttl=3600)
```

##### cleanup_all()

```python
def cleanup_all(self) -> Dict[str, int]
```

Cleanup expired entries from all registered caches.

**Returns**:
```python
{
    'cache_name_1': int,  # Number of entries cleaned
    'cache_name_2': int,  # -1 indicates cleanup error
    # ...
}
```

**Thread Safety**: Yes (uses RLock)

**Example**:
```python
cleanup_counts = cache_manager.cleanup_all()
total_cleaned = sum(count for count in cleanup_counts.values() if count >= 0)
print(f"Cleaned {total_cleaned} expired entries")
```

##### clear_all()

```python
def clear_all(self) -> None
```

Clear all entries from all registered caches.

**Thread Safety**: Yes (uses RLock)

**Example**:
```python
cache_manager.clear_all()  # Nuclear option - clears everything
```

##### get_global_stats()

```python
def get_global_stats(self) -> Dict[str, Any]
```

Get comprehensive statistics for all caches.

**Returns**:
```python
{
    'cache_name_1': {
        'size': int,
        'max_size': int,
        'expired_entries': int,
        'ttl_seconds': int,
        'utilization_percent': float
    },
    # ... per-cache stats
    '_global': {
        'total_caches': int,
        'total_entries': int,
        'total_max_entries': int,
        'global_utilization_percent': float
    }
}
```

**Thread Safety**: Yes (uses RLock)

**Example**:
```python
stats = cache_manager.get_global_stats()
global_stats = stats['_global']
print(f"Total caches: {global_stats['total_caches']}")
print(f"Global utilization: {global_stats['global_utilization_percent']:.1f}%")
```

### Decorators

#### @ttl_cached_property

```python
def ttl_cached_property(ttl: int = DEFAULT_CACHE_TTL, max_size: int = DEFAULT_CACHE_MAX_SIZE)
```

Decorator for caching expensive property computations.

**Parameters**:
- `ttl` (int): TTL in seconds for cached values
- `max_size` (int): Maximum number of cached property values

**Returns**:
- `property`: Property descriptor with caching

**Cache Key Format**: `{object_id}_{property_name}`

**Example**:
```python
class MyModel:
    @ttl_cached_property(ttl=1800, max_size=100)
    def expensive_calculation(self):
        return sum(self.complex_data_processing())

    # Clear cache manually
    del self.expensive_calculation
```

#### @cached_method

```python
def cached_method(ttl: int = DEFAULT_CACHE_TTL, max_size: int = DEFAULT_CACHE_MAX_SIZE)
```

Decorator for caching method results with parameters.

**Parameters**:
- `ttl` (int): TTL in seconds for cached values
- `max_size` (int): Maximum number of cached method results

**Returns**:
- `Callable`: Wrapped method with caching

**Cache Key Format**: `{object_id}_{method_name}_{params_hash}`

**Example**:
```python
class MyModel:
    @cached_method(ttl=900, max_size=50)
    def expensive_query(self, filter_param, limit=10):
        return self.objects.filter(field=filter_param)[:limit]
```

## Project Deletion Tracker API

### ProjectDeletionTracker Class

```python
class ProjectDeletionTracker:
    """Thread-safe tracker for projects being deleted with automatic cleanup."""
```

#### Constructor

```python
def __init__(self)
```

Creates tracker with 1-hour cleanup threshold. Use the global `DELETION_SET` instance.

#### Methods

##### add(project_id)

```python
def add(self, project_id: int) -> None
```

Add project to deletion tracking.

**Parameters**:
- `project_id` (int): Project ID to track

**Side Effects**:
- May trigger periodic cleanup
- Records timestamp for cleanup purposes

**Thread Safety**: Yes (uses Lock)

**Example**:
```python
DELETION_SET.add(project.id)
try:
    project.delete()
finally:
    DELETION_SET.discard(project.id)
```

##### discard(project_id)

```python
def discard(self, project_id: int) -> None
```

Remove project from deletion tracking.

**Parameters**:
- `project_id` (int): Project ID to remove

**Thread Safety**: Yes (uses Lock)

**Example**:
```python
DELETION_SET.discard(project.id)  # Safe to call even if not tracked
```

##### __contains__(project_id)

```python
def __contains__(self, project_id: int) -> bool
```

Check if project is currently being deleted.

**Parameters**:
- `project_id` (int): Project ID to check

**Returns**:
- `bool`: True if project is being deleted

**Thread Safety**: Yes (uses Lock)

**Example**:
```python
if project.id in DELETION_SET:
    return  # Skip signal processing
```

##### force_cleanup()

```python
def force_cleanup(self) -> int
```

Force cleanup of all stale entries.

**Returns**:
- `int`: Number of entries removed

**Thread Safety**: Yes (uses Lock)

**Example**:
```python
cleaned_count = DELETION_SET.force_cleanup()
print(f"Removed {cleaned_count} stale deletion entries")
```

#### Private Methods

##### _maybe_cleanup()

```python
def _maybe_cleanup(self) -> None
```

Automatic cleanup called during `add()` operations.

##### _cleanup_stale_entries(current_time)

```python
def _cleanup_stale_entries(self, current_time: float) -> None
```

Remove entries older than cleanup threshold.

## Configuration Constants

### Default Settings

```python
# From akvo/rsr/cache_management.py
DEFAULT_CACHE_TTL = 3600                    # 1 hour
DEFAULT_CACHE_MAX_SIZE = 1000               # 1000 entries per cache
DEFAULT_CACHE_CLEANUP_INTERVAL = 300        # 5 minutes

# From akvo/rest/views/project.py
DEFAULT_MAX_DESCENDANTS_PER_REQUEST = 1000  # Max children in API response
DEFAULT_DESCENDANTS_CHUNK_SIZE = 500        # Chunk size for processing

# From akvo/rsr/usecases/period_update_aggregation.py
MAX_AGGREGATION_DEPTH = 100                 # Maximum aggregation depth
```

### Django Settings

```python
# In akvo/settings/30-rsr.conf
RSR_CACHE_TTL = 3600                        # Override default TTL
RSR_CACHE_MAX_SIZE = 1000                   # Override default max size
RSR_CACHE_CLEANUP_INTERVAL = 300            # Override cleanup interval

RSR_MAX_DESCENDANTS_PER_REQUEST = 1000      # Override max descendants
RSR_DESCENDANTS_CHUNK_SIZE = 500            # Override chunk size

RSR_MAX_AGGREGATION_DEPTH = 100             # Override max depth
```

## Management Commands API

### manage_cache Command

```bash
python manage.py manage_cache <action> [options]
```

#### Actions

**stats**: Display cache statistics
```bash
python manage.py manage_cache stats [--cache-name NAME] [--json]
```

**cleanup**: Clean expired entries
```bash
python manage.py manage_cache cleanup [--cache-name NAME] [--dry-run]
```

**clear**: Clear cache entries
```bash
python manage.py manage_cache clear [--cache-name NAME] [--dry-run]
```

**monitor**: Health monitoring
```bash
python manage.py manage_cache monitor [--json]
```

#### Options

- `--cache-name NAME`: Target specific cache (optional)
- `--json`: Output in JSON format
- `--dry-run`: Show what would be done without changes

### cleanup_deletion_tracker Command

```bash
python manage.py cleanup_deletion_tracker [options]
```

#### Options

- `--stats`: Show current deletion tracker statistics
- `--dry-run`: Show what would be cleaned without changes

#### Examples

```bash
# Show stats
python manage.py cleanup_deletion_tracker --stats

# Dry run
python manage.py cleanup_deletion_tracker --dry-run

# Actually cleanup
python manage.py cleanup_deletion_tracker
```

## Global Instances

### cache_manager

```python
from akvo.rsr.cache_management import cache_manager

# Global CacheManager instance
cache_manager: CacheManager
```

### DELETION_SET

```python
from akvo.rsr.models.project import DELETION_SET

# Global ProjectDeletionTracker instance
DELETION_SET: ProjectDeletionTracker
```

## Error Handling

### Exception Types

**Cache Operations**:
- All cache operations are designed to be resilient
- Failed operations log warnings but don't raise exceptions
- Cache misses return None rather than raising KeyError

**Deletion Tracking**:
- All operations are safe to call multiple times
- Missing entries in discard/contains operations are handled gracefully
- Lock contention is handled by blocking until available

### Error Recovery

**Cache Failures**:
```python
try:
    result = cache.get(key)
    if result is None:
        result = fallback_computation()
        cache.set(key, result)
except Exception as e:
    logger.warning(f"Cache operation failed: {e}")
    result = fallback_computation()
```

**Deletion Tracking Failures**:
```python
try:
    DELETION_SET.add(project_id)
    # ... deletion logic
except Exception as e:
    logger.error(f"Deletion tracking failed: {e}")
finally:
    DELETION_SET.discard(project_id)  # Always cleanup
```

## Performance Characteristics

### Time Complexity

**TTLCache Operations**:
- `get()`: O(1) average, O(n) worst case during cleanup
- `set()`: O(1) average, O(n) worst case during eviction/cleanup
- `clear()`: O(n)
- `stats()`: O(n)

**ProjectDeletionTracker Operations**:
- `add()`: O(1) average, O(n) during cleanup
- `discard()`: O(1)
- `__contains__()`: O(1)
- `force_cleanup()`: O(n)

### Memory Complexity

**TTLCache**: O(max_size) per cache instance
**ProjectDeletionTracker**: O(number of concurrent deletions)
**CacheManager**: O(number of caches × average cache size)

### Thread Safety Guarantees

- All operations are thread-safe using appropriate locking
- No data races or corruption possible
- Lock ordering prevents deadlocks
- Operations are atomic from external perspective

---

This API reference provides complete technical documentation for integrating with and extending the memory protection system in Akvo RSR.
