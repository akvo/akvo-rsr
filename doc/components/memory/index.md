# Memory Protection & Performance

Akvo RSR includes comprehensive memory protection mechanisms and a hybrid monitoring system to prevent memory exhaustion, detect memory leaks, and ensure stable operation in production environments with large datasets and complex project hierarchies.

## 🔥 NEW: Hybrid Memory Monitoring System

RSR now includes a production-ready hybrid memory monitoring system that combines:
- **Prometheus metrics** for real-time monitoring and alerting
- **Pympler-based leak detection** for automatic memory leak identification
- **Memray profiling** for deep memory analysis during debugging
- **Grafana dashboards** for visualization and historical analysis
- **Comprehensive test suite** ensuring reliability

## 📚 Documentation Structure

```{toctree}
:maxdepth: 2

MEMORY_MONITORING.md
implementation.md
api.md
testing.md
usage.md
```

## 🚀 Quick Navigation

| Document | Purpose | Audience |
|----------|---------|----------|
| **[Memory Monitoring Guide](MEMORY_MONITORING.md)** | **COMPLETE**: Comprehensive hybrid memory monitoring system documentation | Production Engineers, DevOps |
| **[Implementation Guide](implementation.md)** | Original memory protection mechanisms (TTL cache, deletion tracker, etc.) | Developers, System Architects |
| **[API Reference](api.md)** | Complete API documentation for all classes and methods | Developers, Contributors |
| **[Testing Guide](testing.md)** | Memory-aware testing patterns and utilities | QA Engineers, Developers |
| **[Usage Patterns](usage.md)** | Advanced usage patterns and production considerations | DevOps, Production Engineers |

## Quick Start

### 🚀 Hybrid Memory Monitoring (NEW)

For production environments, enable the hybrid monitoring system:

```bash
# Enable memory monitoring with Prometheus metrics
RSR_MEMORY_MONITORING_ENABLED=true
RSR_PROMETHEUS_METRICS_ENABLED=true

# Enable leak detection (recommended for production)
RSR_LEAK_DETECTION_ENABLED=true
RSR_LEAK_GROWTH_THRESHOLD=0.2  # 20% growth triggers alert

# Disable profiling in production (enable only for debugging)
RSR_PROFILING_ENABLED=false
```

**Management Commands**:
```bash
# Check for memory leaks
python manage.py rsr_memory_monitoring check-leaks

# Get system health status
python manage.py rsr_memory_monitoring health-check

# View Prometheus metrics
curl http://localhost:8000/metrics/
```

**🎯 Quick Links**:
- [Complete Hybrid Monitoring Setup](MEMORY_MONITORING.md#quick-start)
- [Grafana Dashboard Installation](MEMORY_MONITORING.md#grafana-dashboards)
- [Production Deployment Guide](MEMORY_MONITORING.md#production-deployment)

### Classic Memory Protection Settings

```python
# Cache Management
RSR_CACHE_TTL = 3600  # 1 hour TTL for cached properties
RSR_CACHE_MAX_SIZE = 1000  # Max items per cache
RSR_CACHE_CLEANUP_INTERVAL = 300  # 5 minutes

# Project Hierarchy Limits
RSR_MAX_DESCENDANTS_PER_REQUEST = 1000  # Max children in single API response
RSR_DESCENDANTS_CHUNK_SIZE = 500  # Chunk size for memory-efficient processing
RSR_MAX_AGGREGATION_DEPTH = 100  # Max depth for aggregation operations

# IATI Export Protection
RSR_IATI_EXPORT_CHUNK_SIZE = 100  # Chunk size for XML streaming
```

### Memory-Safe Coding Patterns

```python
from akvo.rsr.cache_management import ttl_cached_property, cached_method

class MyModel(models.Model):
    # TTL cached property with automatic cleanup
    @ttl_cached_property(ttl=1800, max_size=500)
    def expensive_property(self):
        return expensive_computation()

    # Cached method with size limits
    @cached_method(ttl=900, max_size=200)
    def expensive_method(self, param1, param2):
        return expensive_computation(param1, param2)
```

## Memory Protection Mechanisms

### 1. TTL Cache Management System

**Location**: `/akvo/rsr/cache_management.py`

The TTL cache system provides automatic memory management for cached data:

- **Time-to-live expiration**: Automatic cleanup of expired entries
- **Size limits**: LRU eviction when cache reaches maximum size
- **Thread safety**: All operations are thread-safe
- **Global management**: Centralized monitoring and cleanup

**Key Classes**:
- `TTLCache`: Individual cache with TTL and size limits
- `CacheManager`: Global registry and management of all caches
- `@ttl_cached_property`: Decorator for cached properties
- `@cached_method`: Decorator for cached methods

### 2. Project Deletion Tracker

**Location**: `/akvo/rsr/models/project.py:76-130`

Prevents memory leaks during project deletion operations:

- **Thread-safe tracking**: Uses threading.Lock for concurrent safety
- **Automatic cleanup**: Periodic removal of stale entries
- **Timestamp tracking**: Monitors entry age for cleanup decisions
- **Manual cleanup**: Management command for forced cleanup

**Usage**:
```python
from akvo.rsr.models.project import DELETION_SET

# Track project deletion
DELETION_SET.add(project_id)

# Check if project is being deleted
if project_id in DELETION_SET:
    # Skip processing

# Remove from tracking
DELETION_SET.discard(project_id)
```

### 3. Chunked Project Hierarchy Processing

**Location**: `/akvo/rest/views/project.py:173-243`

Prevents memory exhaustion when handling large project hierarchies:

- **Chunked queries**: Process descendants in small batches
- **Response limits**: Cap maximum items in single response
- **Progress monitoring**: Log processing progress for large hierarchies
- **Memory headers**: Add metadata to responses for monitoring

**Configuration**:
- `RSR_MAX_DESCENDANTS_PER_REQUEST`: Maximum children returned (default: 1000)
- `RSR_DESCENDANTS_CHUNK_SIZE`: Chunk size for processing (default: 500)

### 4. Aggregation Depth Protection

**Location**: `/akvo/rsr/usecases/period_update_aggregation.py:40-96`

Prevents stack overflow and infinite loops in project aggregation:

- **Iterative processing**: Avoids recursion-based stack overflow
- **Depth limits**: Configurable maximum aggregation depth
- **Circular detection**: Prevents infinite loops in circular hierarchies
- **Error isolation**: Continue processing when individual operations fail

**Configuration**:
- `RSR_MAX_AGGREGATION_DEPTH`: Maximum traversal depth (default: 100)

## Memory Monitoring

### Cache Statistics

```bash
# Get cache statistics
python manage.py manage_cache stats

# JSON output for monitoring systems
python manage.py manage_cache stats --json

# Monitor specific cache
python manage.py manage_cache stats --cache-name "my_cache"
```

### Deletion Tracker Statistics

```bash
# Show deletion tracker stats
python manage.py cleanup_deletion_tracker --stats

# Dry run cleanup (show what would be cleaned)
python manage.py cleanup_deletion_tracker --dry-run

# Force cleanup of stale entries
python manage.py cleanup_deletion_tracker
```

### Memory Usage Headers

API responses include memory protection metadata:

```http
X-Total-Processed: 2500
X-Children-Count: 1000
X-Truncated: false
X-Memory-Protection: chunked
```

## Configuration Guide

### Production Recommendations

```python
# Conservative settings for large production systems
RSR_CACHE_TTL = 1800  # 30 minutes
RSR_CACHE_MAX_SIZE = 500  # Smaller caches
RSR_CACHE_CLEANUP_INTERVAL = 180  # 3 minutes

# Hierarchy processing limits
RSR_MAX_DESCENDANTS_PER_REQUEST = 500  # Smaller responses
RSR_DESCENDANTS_CHUNK_SIZE = 250  # Smaller chunks
RSR_MAX_AGGREGATION_DEPTH = 50  # Shallower hierarchies

# IATI export limits
RSR_IATI_EXPORT_CHUNK_SIZE = 50  # Smaller XML chunks
```

### Development Settings

```python
# More permissive settings for development
RSR_CACHE_TTL = 3600  # 1 hour
RSR_CACHE_MAX_SIZE = 1000  # Larger caches
RSR_DESCENDANTS_CHUNK_SIZE = 1000  # Larger chunks
RSR_MAX_AGGREGATION_DEPTH = 100  # Deeper hierarchies
```

## Troubleshooting

### High Memory Usage

1. **Check cache statistics**:
   ```bash
   python manage.py manage_cache stats --json
   ```

2. **Force cache cleanup**:
   ```bash
   python manage.py manage_cache cleanup
   ```

3. **Clear all caches**:
   ```bash
   python manage.py manage_cache clear
   ```

### Slow API Responses

1. **Check if responses are being truncated**:
   - Look for `X-Truncated: true` header
   - Consider reducing `RSR_MAX_DESCENDANTS_PER_REQUEST`

2. **Optimize chunk sizes**:
   - Reduce `RSR_DESCENDANTS_CHUNK_SIZE` for memory-constrained environments
   - Increase for better performance with sufficient memory

### Aggregation Issues

1. **Check aggregation depth**:
   - Look for "Maximum aggregation depth reached" warnings in logs
   - Consider increasing `RSR_MAX_AGGREGATION_DEPTH` if hierarchies are legitimate

2. **Check for circular references**:
   - Look for "Circular reference detected" warnings
   - Investigate project hierarchy data integrity

## Advanced Topics

- [Implementation Guide](implementation.md) - Detailed technical documentation of memory protection mechanisms
- [Usage Patterns](usage.md) - Advanced usage patterns and production considerations
- [Testing Guide](testing.md) - Memory-aware testing patterns and utilities
- [API Reference](api.md) - Complete API documentation for all memory management components

## Related Components

- [Project Hierarchies](../projects.md#hierarchies) - Project hierarchy management
- [Results Framework](../results_framework/aggregation.md) - Result aggregation system
- [IATI Exports](../iati_exports.md) - IATI XML export system
