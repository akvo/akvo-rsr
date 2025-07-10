# Memory Protection Implementation Guide

This document provides detailed technical documentation for the memory protection mechanisms implemented in Akvo RSR.

## Architecture Overview

The memory protection system consists of four main components:

1. **TTL Cache Management System** (`akvo/rsr/cache_management.py`)
2. **Project Deletion Tracker** (`akvo/rsr/models/project.py`)
3. **Chunked Hierarchy Processing** (`akvo/rest/views/project.py`)
4. **Aggregation Depth Protection** (`akvo/rsr/usecases/period_update_aggregation.py`)

## 1. TTL Cache Management System

### Core Classes

#### TTLCache Class

**Location**: `akvo/rsr/cache_management.py:25-125`

A thread-safe cache implementation with time-to-live (TTL) expiration and size limits.

**Key Features**:
- **Thread Safety**: Uses `threading.RLock()` for all operations
- **TTL Expiration**: Automatic expiration of entries after configured time
- **LRU Eviction**: Least Recently Used eviction when max size exceeded
- **Automatic Cleanup**: Periodic cleanup of expired entries
- **Memory Tracking**: Statistics for monitoring cache usage

**Constructor Parameters**:
```python
TTLCache(max_size: int = DEFAULT_CACHE_MAX_SIZE, ttl: int = DEFAULT_CACHE_TTL)
```

**Core Methods**:

- `get(key: str) -> Optional[Any]`: Retrieve value, returns None if expired/missing
- `set(key: str, value: Any) -> None`: Store value with TTL
- `clear() -> None`: Clear all cache entries
- `stats() -> Dict[str, Any]`: Return cache statistics

**Implementation Details**:

- Uses `OrderedDict` for LRU ordering
- Separate `_expiry_times` dict tracks expiration timestamps
- Periodic cleanup runs every `DEFAULT_CACHE_CLEANUP_INTERVAL` seconds
- Size enforcement happens on every `set()` operation

#### CacheManager Class

**Location**: `akvo/rsr/cache_management.py:127-197`

Global registry and manager for all TTL caches in the application.

**Key Features**:
- **Centralized Management**: Single point for all cache operations
- **Named Caches**: Create and retrieve caches by name
- **Global Operations**: Cleanup and clear all caches simultaneously
- **Statistics Aggregation**: Combined statistics across all caches

**Core Methods**:

- `get_cache(name, max_size, ttl) -> TTLCache`: Get or create named cache
- `cleanup_all() -> Dict[str, int]`: Cleanup all caches, return counts
- `clear_all() -> None`: Clear all registered caches
- `get_global_stats() -> Dict[str, Any]`: Statistics for all caches

**Global Instance**:
```python
cache_manager = CacheManager()  # Singleton instance
```

### Decorators

#### @ttl_cached_property

**Location**: `akvo/rsr/cache_management.py:203-238`

Decorator for caching expensive property computations with TTL and size limits.

**Usage**:
```python
@ttl_cached_property(ttl=1800, max_size=500)
def expensive_property(self):
    return expensive_computation()
```

**Implementation Details**:
- Creates cache named `{module}.{qualname}`
- Cache key format: `{object_id}_{function_name}`
- Includes deleter for cache invalidation
- Thread-safe access to underlying TTLCache

#### @cached_method

**Location**: `akvo/rsr/cache_management.py:241-271`

Decorator for caching method results with parameters.

**Usage**:
```python
@cached_method(ttl=900, max_size=200)
def expensive_method(self, param1, param2):
    return expensive_computation(param1, param2)
```

**Implementation Details**:
- Cache key includes hashed parameters: `{object_id}_{method_name}_{params_hash}`
- Handles both positional and keyword arguments
- Thread-safe parameter hashing

### Configuration

**Settings** (`akvo/settings/30-rsr.conf:40-43`):
```python
RSR_CACHE_TTL = 3600                    # Default TTL (1 hour)
RSR_CACHE_MAX_SIZE = 1000               # Default max size per cache
RSR_CACHE_CLEANUP_INTERVAL = 300        # Cleanup interval (5 minutes)
```

## 2. Project Deletion Tracker

### ProjectDeletionTracker Class

**Location**: `akvo/rsr/models/project.py:76-130`

Thread-safe tracker for projects being deleted to prevent signal handler memory leaks.

**Problem Solved**:
- Django signal handlers can cause memory leaks during object deletion
- Multiple signal handlers may process the same deletion event
- Cascade deletions can trigger recursive signal processing

**Key Features**:
- **Thread Safety**: Uses `threading.Lock()` for all operations
- **Automatic Cleanup**: Removes stale entries older than 1 hour
- **Timestamp Tracking**: Monitors entry age for cleanup decisions
- **Memory Protection**: Prevents unbounded growth of tracking set

**Core Methods**:

- `add(project_id: int) -> None`: Track project deletion
- `discard(project_id: int) -> None`: Remove from tracking
- `__contains__(project_id: int) -> bool`: Check if being deleted
- `force_cleanup() -> int`: Manual cleanup, returns count removed

**Implementation Details**:

```python
class ProjectDeletionTracker:
    def __init__(self):
        self._deletion_set: Set[int] = set()
        self._timestamps: Dict[int, float] = {}
        self._lock = threading.Lock()
        self._cleanup_threshold = 3600  # 1 hour
        self._last_cleanup = time.time()
```

**Automatic Cleanup**:
- Runs every 15 minutes (`_cleanup_threshold / 4`)
- Removes entries older than 1 hour
- Called during `add()` operations

**Global Instance**:
```python
DELETION_SET = ProjectDeletionTracker()
```

**Usage Pattern**:
```python
from akvo.rsr.models.project import DELETION_SET

# Track deletion
DELETION_SET.add(project_id)

# Check if being deleted
if project_id in DELETION_SET:
    return  # Skip processing

# Remove from tracking
DELETION_SET.discard(project_id)
```

## 3. Chunked Hierarchy Processing

### Memory-Efficient API Response Generation

**Location**: `akvo/rest/views/project.py:173-243`

Prevents memory exhaustion when handling large project hierarchies in API responses.

**Problem Solved**:
- Large project hierarchies (1000+ projects) can exhaust memory
- QuerySet evaluation loads all objects into memory simultaneously
- Serialization of large datasets causes memory spikes

**Key Features**:
- **Chunked Processing**: Process descendants in configurable batches
- **Response Limits**: Cap maximum items in single response
- **Progress Monitoring**: Log processing progress for large hierarchies
- **Memory Headers**: Add metadata to responses for monitoring

**Core Method**: `_get_children_chunked(project, request)`

**Configuration**:
```python
RSR_MAX_DESCENDANTS_PER_REQUEST = 1000  # Max children in response
RSR_DESCENDANTS_CHUNK_SIZE = 500        # Chunk size for processing
```

**Implementation Flow**:

1. **Chunked Query Processing**:
```python
def _chunked_queryset(self, queryset, chunk_size: int) -> Iterator[List]:
    """Yield successive chunks from queryset"""
    offset = 0
    while True:
        chunk = list(queryset[offset:offset + chunk_size])
        if not chunk:
            break
        yield chunk
        offset += chunk_size
```

2. **Progress Monitoring**:
```python
if processed_count % 1000 == 0:
    logger.info(f"Processed {processed_count} descendants for project {project.id}")
```

3. **Response Truncation**:
```python
if len(children) > max_descendants:
    logger.warning(f"Truncating children response: {len(children)} -> {max_descendants}")
    children = children[:max_descendants]
```

4. **Memory Protection Headers**:
```python
response['X-Total-Processed'] = str(processed_count)
response['X-Children-Count'] = str(len(children))
response['X-Truncated'] = 'true' if len(children) >= max_descendants else 'false'
response['X-Memory-Protection'] = 'chunked'
```

## 4. Aggregation Depth Protection

### Iterative Aggregation System

**Location**: `akvo/rsr/usecases/period_update_aggregation.py:40-96`

Prevents stack overflow and infinite loops in project aggregation operations.

**Problem Solved**:
- Recursive aggregation can cause stack overflow with deep hierarchies
- Circular references in project hierarchies cause infinite loops
- Failed aggregations can block entire aggregation chains

**Key Features**:
- **Iterative Processing**: Avoids recursion-based stack overflow
- **Depth Limits**: Configurable maximum aggregation depth
- **Circular Detection**: Prevents infinite loops in circular hierarchies
- **Error Isolation**: Continue processing when individual operations fail

**Configuration**:
```python
RSR_MAX_AGGREGATION_DEPTH = 100  # Default maximum depth
```

**Implementation Details**:

```python
def _aggregate_period_value(period: IndicatorPeriod, max_depth: int = None):
    if max_depth is None:
        max_depth = MAX_AGGREGATION_DEPTH

    processed_periods: Set[int] = set()
    periods_to_process = [period]
    depth = 0

    while periods_to_process and depth < max_depth:
        current_period = periods_to_process.pop(0)

        # Prevent infinite loops
        if current_period.id in processed_periods:
            logger.warning("Circular reference detected")
            continue
```

**Error Handling**:
```python
try:
    value, numerator, denominator = calculate_period_actual_value(current_period)
    current_period.actual_value = str(value) if value else ''
    current_period.save()
except Exception as e:
    logger.error(f"Error aggregating period {current_period.id}: {e}")
    continue  # Don't let one failure stop the entire chain
```

**Depth Protection**:
```python
if depth >= max_depth:
    logger.warning(
        f"Maximum aggregation depth ({max_depth}) reached for period {period.id}. "
        f"Hierarchy may be too deep or contain cycles."
    )
```

## Management Commands

### manage_cache Command

**Location**: `akvo/rsr/management/commands/manage_cache.py`

Provides comprehensive cache management and monitoring capabilities.

**Actions**:
- `stats`: Display cache statistics (with optional JSON output)
- `cleanup`: Clean expired entries from caches
- `clear`: Clear all cache entries
- `monitor`: Health monitoring with issue detection

**Usage Examples**:
```bash
# Get cache statistics
python manage.py manage_cache stats

# JSON output for monitoring systems
python manage.py manage_cache stats --json

# Cleanup expired entries
python manage.py manage_cache cleanup

# Clear all caches
python manage.py manage_cache clear

# Health monitoring
python manage.py manage_cache monitor
```

**Health Monitoring Features**:
- Detects high cache utilization (>75%, >90%)
- Identifies caches with many expired entries
- Provides recommendations for optimization
- JSON output for integration with monitoring systems

### cleanup_deletion_tracker Command

**Location**: `akvo/rsr/management/commands/cleanup_deletion_tracker.py`

Manages the project deletion tracker to prevent memory leaks.

**Usage Examples**:
```bash
# Show deletion tracker stats
python manage.py cleanup_deletion_tracker --stats

# Dry run cleanup
python manage.py cleanup_deletion_tracker --dry-run

# Force cleanup of stale entries
python manage.py cleanup_deletion_tracker
```

## Testing

### Comprehensive Test Suite

**Location**: `akvo/rsr/tests/test_cache_management.py`

Tests cover all memory protection components:

- **TTLCache Tests**: TTL expiration, LRU eviction, thread safety
- **CacheManager Tests**: Global operations, statistics aggregation
- **Decorator Tests**: Property and method caching functionality
- **Integration Tests**: Real-world usage patterns

**Key Test Patterns**:
```python
def test_ttl_expiration(self):
    cache = TTLCache(max_size=10, ttl=0.1)  # 100ms TTL
    cache.set('key1', 'value1')
    time.sleep(0.15)
    self.assertIsNone(cache.get('key1'))

def test_lru_eviction(self):
    cache = TTLCache(max_size=2, ttl=10)
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    cache.set('key3', 'value3')  # Should evict key1
    self.assertIsNone(cache.get('key1'))
```

## Performance Considerations

### Memory Usage Optimization

1. **Cache Size Tuning**:
   - Production: 200-500 entries per cache
   - Development: 500-1000 entries per cache
   - High-memory environments: Up to 2000 entries

2. **TTL Configuration**:
   - Frequently changing data: 5-15 minutes
   - Semi-static data: 30-60 minutes
   - Static reference data: 2-4 hours

3. **Chunk Size Optimization**:
   - Memory-constrained: 100-250 items per chunk
   - Balanced environments: 500 items per chunk
   - High-memory environments: 1000+ items per chunk

### Monitoring and Alerting

**Key Metrics to Monitor**:
- Cache utilization percentage
- Expired entry counts
- Response truncation frequency
- Aggregation depth warnings
- Deletion tracker size

**Alert Thresholds**:
- HIGH: Cache utilization > 90%
- MEDIUM: Cache utilization > 75%
- WARNING: Many expired entries (>10% of cache size)
- CRITICAL: Deletion tracker size > 100 entries

## Best Practices

### Development Guidelines

1. **Use TTL Caching** for expensive computations:
```python
@ttl_cached_property(ttl=1800, max_size=100)
def expensive_computation(self):
    return self.complex_calculation()
```

2. **Track Deletions** to prevent signal handler issues:
```python
DELETION_SET.add(project_id)
try:
    # Deletion logic
finally:
    DELETION_SET.discard(project_id)
```

3. **Monitor Cache Health** regularly:
```python
stats = cache_manager.get_global_stats()
if stats['_global']['global_utilization_percent'] > 80:
    logger.warning("High cache utilization detected")
```

### Production Deployment

1. **Conservative Settings** for production:
```python
RSR_CACHE_TTL = 1800                    # 30 minutes
RSR_CACHE_MAX_SIZE = 500                # Smaller caches
RSR_MAX_DESCENDANTS_PER_REQUEST = 500   # Smaller responses
RSR_DESCENDANTS_CHUNK_SIZE = 250        # Smaller chunks
```

2. **Regular Monitoring**:
- Set up alerts for high cache utilization
- Monitor response truncation frequency
- Track deletion tracker growth

3. **Graceful Degradation**:
- Handle cache failures gracefully
- Provide fallback mechanisms for memory pressure
- Implement circuit breakers for expensive operations

## Security Considerations

1. **Thread Safety**: All components use appropriate locking mechanisms
2. **Memory Bounds**: All data structures have explicit size limits
3. **Cleanup Guarantees**: Automatic cleanup prevents unbounded growth
4. **Error Isolation**: Individual failures don't affect entire system

## Future Enhancements

Potential improvements identified for future implementation:

1. **Memory Leak Detection**: Automated detection of memory growth patterns
2. **Performance Profiling**: Request-level memory usage tracking
3. **Dynamic Tuning**: Automatic adjustment of cache sizes based on usage
4. **Enhanced Monitoring**: Real-time memory usage dashboards
5. **Predictive Scaling**: Proactive cache warming and sizing

---

This implementation provides a robust foundation for memory protection in Django applications with complex hierarchical data structures and high-volume operations.
