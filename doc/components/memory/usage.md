# Advanced Usage Patterns

This guide covers advanced usage patterns and production considerations for the Akvo RSR memory protection system.

## Production Deployment Patterns

### Memory-Aware Model Design

```python
from akvo.rsr.cache_management import ttl_cached_property, cached_method
from akvo.rsr.models.project import DELETION_SET

class MyModel(models.Model):
    # Use TTL caching for expensive computations
    @ttl_cached_property(ttl=1800, max_size=100)
    def expensive_aggregation(self):
        # This will be cached for 30 minutes with max 100 entries
        return self.aggregate_complex_data()

    # Cache method results with different TTL
    @cached_method(ttl=300, max_size=50)
    def get_filtered_data(self, filter_params):
        # Cached for 5 minutes with max 50 parameter combinations
        return self.filter_and_process(filter_params)

    def delete(self, *args, **kwargs):
        # Track deletion to prevent signal handler issues
        DELETION_SET.add(self.id)
        try:
            super().delete(*args, **kwargs)
        finally:
            DELETION_SET.discard(self.id)
```

### Large Dataset Processing

```python
from akvo.rsr.cache_management import cache_manager

def process_large_dataset(queryset):
    """Process large dataset with memory protection"""

    # Use dedicated cache for this operation
    process_cache = cache_manager.get_cache(
        'large_dataset_processing',
        max_size=500,
        ttl=600  # 10 minutes
    )

    # Process in chunks to avoid memory exhaustion
    chunk_size = 1000
    processed_count = 0

    for chunk_start in range(0, queryset.count(), chunk_size):
        chunk = queryset[chunk_start:chunk_start + chunk_size]

        for item in chunk:
            # Check cache first
            cache_key = f"processed_{item.id}"
            result = process_cache.get(cache_key)

            if result is None:
                result = expensive_processing(item)
                process_cache.set(cache_key, result)

            yield result

        processed_count += len(chunk)

        # Log progress for monitoring
        if processed_count % 5000 == 0:
            logger.info(f"Processed {processed_count} items")
```

### Memory-Efficient API Views

```python
from django.http import StreamingHttpResponse
from akvo.rsr.cache_management import cached_method

class MemoryEfficientViewSet(viewsets.ModelViewSet):

    @cached_method(ttl=300, max_size=20)
    def get_expensive_data(self, filters):
        """Cache expensive data queries"""
        return self.get_queryset().complex_filter(**filters)

    def list(self, request):
        """Memory-efficient list with streaming response"""
        if self.should_stream_response(request):
            return self.stream_response(request)
        return super().list(request)

    def should_stream_response(self, request):
        """Determine if response should be streamed"""
        # Stream for large datasets
        total_count = self.get_queryset().count()
        return total_count > 10000

    def stream_response(self, request):
        """Stream large responses to avoid memory issues"""
        def generate_data():
            queryset = self.get_queryset()
            chunk_size = 100

            for offset in range(0, queryset.count(), chunk_size):
                chunk = queryset[offset:offset + chunk_size]
                serializer = self.get_serializer(chunk, many=True)

                for item in serializer.data:
                    yield json.dumps(item) + '\n'

        return StreamingHttpResponse(
            generate_data(),
            content_type='application/json'
        )
```

## Cache Optimization Strategies

### Cache Warming

```python
from akvo.rsr.cache_management import cache_manager

def warm_critical_caches():
    """Pre-populate critical caches during low-traffic periods"""

    # Get commonly used cache
    project_cache = cache_manager.get_cache('project_aggregations')

    # Pre-compute for active projects
    active_projects = Project.objects.filter(status='A')[:100]

    for project in active_projects:
        cache_key = f"project_stats_{project.id}"
        if project_cache.get(cache_key) is None:
            stats = compute_project_statistics(project)
            project_cache.set(cache_key, stats)
```

### Cache Invalidation Patterns

```python
from django.db.models.signals import post_save, post_delete
from akvo.rsr.cache_management import cache_manager

@receiver(post_save, sender=Project)
def invalidate_project_caches(sender, instance, **kwargs):
    """Invalidate related caches when project changes"""

    # Clear specific cache entries
    caches_to_clear = [
        'project_aggregations',
        'project_statistics',
        'project_hierarchy'
    ]

    for cache_name in caches_to_clear:
        cache = cache_manager.get_cache(cache_name)

        # Clear entries related to this project
        cache_key = f"project_{instance.id}"
        cache._cache.pop(cache_key, None)
        cache._expiry_times.pop(cache_key, None)

        # Also clear parent project caches
        if instance.parent:
            parent_key = f"project_{instance.parent.id}"
            cache._cache.pop(parent_key, None)
            cache._expiry_times.pop(parent_key, None)
```

## Monitoring and Alerting

### Custom Monitoring Metrics

```python
from akvo.rsr.cache_management import cache_manager
from akvo.rsr.models.project import DELETION_SET

def collect_memory_metrics():
    """Collect memory-related metrics for monitoring"""

    # Cache metrics
    cache_stats = cache_manager.get_global_stats()
    global_stats = cache_stats.pop('_global', {})

    metrics = {
        'cache_total_entries': global_stats.get('total_entries', 0),
        'cache_utilization_percent': global_stats.get('global_utilization_percent', 0),
        'cache_count': global_stats.get('total_caches', 0),
    }

    # Deletion tracker metrics
    with DELETION_SET._lock:
        metrics.update({
            'deletion_tracker_size': len(DELETION_SET._deletion_set),
            'deletion_tracker_timestamps': len(DELETION_SET._timestamps),
        })

    # Cache-specific metrics
    for cache_name, stats in cache_stats.items():
        prefix = f'cache_{cache_name}'
        metrics[f'{prefix}_size'] = stats.get('size', 0)
        metrics[f'{prefix}_expired'] = stats.get('expired_entries', 0)
        metrics[f'{prefix}_utilization'] = stats.get('utilization_percent', 0)

    return metrics
```

### Health Check Endpoints

```python
from django.http import JsonResponse
from django.views.decorators.cache import never_cache

@never_cache
def memory_health_check(request):
    """Health check endpoint for memory monitoring"""

    metrics = collect_memory_metrics()

    # Determine health status
    health_status = 'healthy'
    warnings = []

    # Check cache utilization
    if metrics.get('cache_utilization_percent', 0) > 80:
        health_status = 'warning'
        warnings.append('High cache utilization')

    # Check deletion tracker size
    if metrics.get('deletion_tracker_size', 0) > 100:
        health_status = 'warning'
        warnings.append('Large deletion tracker')

    # Check for expired entries
    total_expired = sum(
        v for k, v in metrics.items()
        if k.endswith('_expired')
    )
    if total_expired > 50:
        health_status = 'warning'
        warnings.append('High number of expired cache entries')

    return JsonResponse({
        'status': health_status,
        'warnings': warnings,
        'metrics': metrics,
        'timestamp': timezone.now().isoformat()
    })
```

## Performance Tuning

### Cache Size Optimization

```python
# settings.py

# For high-memory environments
if ENVIRONMENT == 'production-high-memory':
    RSR_CACHE_MAX_SIZE = 2000
    RSR_CACHE_TTL = 7200  # 2 hours
    RSR_DESCENDANTS_CHUNK_SIZE = 1000

# For memory-constrained environments
elif ENVIRONMENT == 'production-low-memory':
    RSR_CACHE_MAX_SIZE = 200
    RSR_CACHE_TTL = 900  # 15 minutes
    RSR_DESCENDANTS_CHUNK_SIZE = 100
    RSR_MAX_DESCENDANTS_PER_REQUEST = 200

# For development
else:
    RSR_CACHE_MAX_SIZE = 500
    RSR_CACHE_TTL = 3600  # 1 hour
    RSR_DESCENDANTS_CHUNK_SIZE = 500
```

### Database Query Optimization

```python
def get_project_hierarchy_efficient(project_id):
    """Memory-efficient project hierarchy retrieval"""

    # Use select_related and prefetch_related strategically
    queryset = Project.objects.select_related(
        'parent',
        'primary_organisation'
    ).prefetch_related(
        'children__children',  # Only 2 levels deep
        'results__indicators__periods'
    ).filter(
        Q(id=project_id) | Q(parent_id=project_id) | Q(parent__parent_id=project_id)
    )

    # Use iterator() for large datasets to avoid caching all objects
    if queryset.count() > 1000:
        return queryset.iterator(chunk_size=100)
    else:
        return queryset.all()
```

## Error Handling and Recovery

### Graceful Degradation

```python
from akvo.rsr.cache_management import cache_manager

def get_data_with_fallback(key, compute_func, cache_name='default'):
    """Get data with graceful cache fallback"""

    try:
        # Try cache first
        cache = cache_manager.get_cache(cache_name)
        result = cache.get(key)

        if result is not None:
            return result

    except Exception as e:
        logger.warning(f"Cache access failed for {key}: {e}")

    try:
        # Compute data
        result = compute_func()

        # Try to cache result
        try:
            cache.set(key, result)
        except Exception as e:
            logger.warning(f"Cache storage failed for {key}: {e}")

        return result

    except Exception as e:
        logger.error(f"Data computation failed for {key}: {e}")
        raise
```

### Memory Pressure Handling

```python
import psutil
from akvo.rsr.cache_management import cache_manager

def handle_memory_pressure():
    """Handle high memory usage situations"""

    # Check system memory usage
    memory = psutil.virtual_memory()

    if memory.percent > 85:  # High memory usage
        logger.warning(f"High memory usage: {memory.percent}%")

        # Force cache cleanup
        cleaned_counts = cache_manager.cleanup_all()
        logger.info(f"Emergency cache cleanup: {cleaned_counts}")

        # If still high, clear some caches
        if memory.percent > 90:
            logger.warning("Critical memory usage, clearing caches")
            cache_manager.clear_all()
```

## Best Practices Summary

### Do's

1. **Use TTL caching** for expensive computations
2. **Set appropriate cache sizes** based on your environment
3. **Monitor cache statistics** regularly
4. **Use chunked processing** for large datasets
5. **Implement graceful degradation** for cache failures
6. **Track deletions** to prevent signal handler issues
7. **Use streaming responses** for large API responses

### Don'ts

1. **Don't cache mutable objects** without proper invalidation
2. **Don't set unlimited cache sizes**
3. **Don't ignore memory pressure warnings**
4. **Don't forget to clean up** temporary caches
5. **Don't process entire large datasets** in memory at once
6. **Don't cache database connections** or other resources
7. **Don't disable memory protection** in production

### Configuration Guidelines

- **Cache TTL**: 15 minutes to 2 hours depending on data volatility
- **Cache size**: 100-2000 entries depending on available memory
- **Chunk size**: 100-1000 items depending on object size
- **Cleanup interval**: 3-10 minutes for active cleanup
- **Aggregation depth**: 50-200 levels depending on hierarchy complexity
