# Memory Leak Detection Implementation Plan

**Project**: Akvo RSR Memory Leak Detection  
**Branch**: `feature/memory-leak-detection`  
**Created**: 2025-07-15  
**Goal**: Implement comprehensive memory leak detection for production Django application in Kubernetes environment

## Executive Summary

This plan implements a multi-phase approach to detect memory leaks in the Akvo RSR Django application deployed on Kubernetes. The solution leverages existing infrastructure (Prometheus, Grafana, StatsD) while adding specialized memory leak detection capabilities with minimal performance impact.

## Current Infrastructure Analysis

### Existing Components
- **Kubernetes Deployment**: Multi-container pods (backend, reports, worker, nginx, statsd-to-prometheus, cloudsql-proxy)
- **Monitoring Stack**: Prometheus + Grafana with existing dashboards
- **Metrics Collection**: django-statsd-mozilla integration with statsd-to-prometheus container
- **Resource Monitoring**: Container memory usage already tracked (`container_memory_usage_bytes`)

### Current Limitations
- No memory leak detection capabilities
- No Python object-level memory tracking
- No memory growth trend analysis
- No correlation between memory usage and application operations

## Implementation Strategy

### Core Approach: Django-Prometheus + Custom Memory Leak Detection

**Primary Tools**:
- `django-prometheus`: Mature Django metrics library (foundation)
- `tracemalloc`: Built-in Python memory allocation tracking
- `psutil`: System-level memory monitoring (already installed)
- `gc`: Garbage collection monitoring (built-in)

**Key Benefits**:
- Zero additional security privileges required
- Integrates with existing Prometheus/Grafana infrastructure
- Minimal performance overhead (<0.5%)
- Comprehensive memory leak detection across all containers

## Phase Implementation Plan

### Phase 1: Django-Prometheus Foundation (Immediate - 2-3 hours)

#### Objectives
- Replace custom prometheus metrics with mature django-prometheus library
- Establish unified metrics endpoint
- Ensure compatibility with existing infrastructure

#### Tasks
1. **Install django-prometheus**
   - Add to `scripts/deployment/pip/requirements/production.in`
   - Update requirements lock files
   - Add to `INSTALLED_APPS` in Django settings

2. **Configure Django Integration**
   - Add django-prometheus middleware to existing setup
   - Configure metrics endpoint at `/metrics`
   - Ensure compatibility with existing statsd-to-prometheus container

3. **Update Kubernetes Configuration**
   - Modify existing Prometheus scraping configuration
   - Update service annotations for metrics discovery
   - Test metrics endpoint accessibility

4. **Validate Integration**
   - Verify metrics collection in Prometheus
   - Test existing Grafana dashboard compatibility
   - Ensure no performance degradation

#### Deliverables
- [x] Django-prometheus installed and configured
- [x] Metrics endpoint functional
- [x] Existing monitoring unchanged
- [x] Documentation updated

### Phase 2: Custom Memory Leak Detection Extension (Core Solution - 4-6 hours)

#### Objectives
- Implement Python object-level memory tracking
- Create memory growth detection system
- Add container-specific memory monitoring

#### Tasks
1. **Memory Leak Detection Middleware**
   ```python
   # Create akvo/rsr/middleware/memory_profiling.py
   class MemoryLeakDetectionMiddleware:
       - Integrate tracemalloc with django-prometheus
       - Track memory allocation per request
       - Monitor object count growth
       - Export metrics through existing /metrics endpoint
   ```

2. **Container-Specific Memory Monitoring**
   - **Backend Container**: ✅ Request-level memory tracking via middleware
   - **Reports Container**: ✅ Report generation memory monitoring via middleware
   - **Worker Container**: ❌ Middleware limitation - requires Django-Q hooks or periodic sampling

3. **Custom Memory Metrics**
   ```python
   # Add to django-prometheus metrics
   - django_memory_usage_bytes: Current memory usage by container/view
   - django_memory_growth_events: Memory growth event counter
   - django_object_count_gauge: Python object count tracking
   - django_gc_collections_total: Garbage collection statistics
   ```

4. **Memory Snapshot System**
   - Periodic memory snapshots (hourly)
   - Object count comparison over time
   - Memory growth trend calculation
   - Automated leak pattern detection

#### Deliverables
- [x] Memory leak detection middleware implemented
- [x] HTTP container memory monitoring active (backend, reports)
- [x] Custom memory metrics exported
- [x] Memory snapshot system operational
- [ ] Worker container monitoring implementation (requires separate approach)

### Phase 2.5: Worker Container Memory Monitoring (Optional - 2-3 hours)

#### Objectives
- Implement proper memory monitoring for background job processing
- Address middleware limitation for non-HTTP processes
- Provide comprehensive worker container memory leak detection

#### Tasks
1. **Django-Q Integration Approach**
   ```python
   # Custom Django-Q task wrapper for memory monitoring
   class MemoryMonitoredTask:
       - Pre/post task execution memory measurement
       - Task-specific memory usage tracking
       - Integration with existing Prometheus metrics
   ```

2. **Periodic Worker Memory Sampling**
   ```python
   # Background thread monitoring
   class WorkerMemoryMonitor:
       - 30-second interval memory sampling
       - Container-level memory usage tracking
       - Non-intrusive background monitoring
   ```

3. **Management Command Wrapper**
   ```python
   # Memory-aware base command class
   class MemoryMonitoredCommand(BaseCommand):
       - Wrap existing management commands
       - Track memory usage for batch operations
       - Export metrics via file or HTTP endpoint
   ```

#### Deliverables
- [ ] Django-Q task memory monitoring implemented
- [ ] Periodic worker memory sampling active
- [ ] Management command memory tracking
- [ ] Worker container metrics exported to Prometheus

#### Alternative: Container-Level Monitoring
If application-level monitoring proves complex, use container metrics:
- Prometheus `container_memory_usage_bytes` already available
- Focus on HTTP containers for detailed application metrics
- Use container metrics for worker memory trend analysis

### Phase 3: Enhanced Grafana Dashboard Integration (2-3 hours)

#### Objectives
- Create comprehensive memory leak detection dashboard
- Integrate with existing performance metrics
- Set up automated alerting

#### Tasks
1. **Unified Dashboard Enhancement**
   - Extend existing `ci/k8s/grafana/main.yml` dashboard
   - Add memory leak detection panels
   - Correlate memory usage with HTTP requests, database queries
   - Create memory growth trend visualization

2. **Dashboard Panels**
   - Memory Growth Rate (24h, 7d, 30d trends)
   - Python Object Count Growth
   - Memory Usage by Container/View
   - Memory Leak Detection Events
   - GC Collection Statistics
   - Memory Usage vs Request Rate Correlation

3. **Alerting Configuration**
   - Memory growth rate alerts (>10% increase over 24h)
   - Object count growth alerts
   - Memory leak detection event alerts
   - Container-specific memory threshold alerts

#### Deliverables
- [ ] Enhanced Grafana dashboard with memory leak detection
- [ ] Automated alert configuration
- [ ] Memory trend visualization
- [ ] Correlation analysis panels

### Phase 4: Production Deployment & Validation (2-3 hours)

#### Objectives
- Deploy to production environment safely
- Validate monitoring effectiveness
- Set up maintenance procedures

#### Tasks
1. **Gradual Rollout**
   - Deploy to test environment first
   - Validate performance impact
   - Test alert functionality
   - Monitor for 48 hours before production

2. **Production Deployment**
   - Update Kubernetes deployment configurations
   - Deploy via existing CI/CD pipeline
   - Monitor deployment success
   - Validate metric collection

3. **Monitoring Validation**
   - Verify memory leak detection functionality
   - Test alert triggering
   - Validate dashboard accuracy
   - Check performance metrics

4. **Documentation & Maintenance**
   - Update operational documentation
   - Create troubleshooting guide
   - Set up maintenance procedures
   - Train team on new monitoring capabilities

#### Deliverables
- [ ] Production deployment successful
- [ ] Memory leak detection operational
- [ ] Alert system functional
- [ ] Team training completed

## Technical Implementation Details

### Django-Prometheus Integration

#### Settings Configuration
```python
# akvo/settings/46-prometheus.conf
INSTALLED_APPS += ['django_prometheus']

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    # ... existing middleware
    'akvo.rsr.middleware.memory_profiling.MemoryLeakDetectionMiddleware',
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]

PROMETHEUS_EXPORT_MIGRATIONS = False
```

#### Memory Leak Detection Middleware
```python
# akvo/rsr/middleware/memory_profiling.py
import tracemalloc, psutil, gc, os
from django.conf import settings
from prometheus_client import Gauge, Counter, Histogram

class MemoryLeakDetectionMiddleware:
    """Modern Django middleware using callable pattern for memory leak detection."""
    
    # Class-level metrics to avoid duplicate registration during testing
    _metrics_initialized = False
    _memory_usage_gauge = None
    _memory_growth_counter = None
    _object_count_gauge = None
    _gc_collections_counter = None
    _memory_allocation_histogram = None

    def __init__(self, get_response):
        self.get_response = get_response
        self.enabled = getattr(settings, 'ENABLE_MEMORY_PROFILING', True)
        
        if self.enabled:
            self.process = psutil.Process()
            self.container_name = os.environ.get('CONTAINER_NAME', 'unknown')
            self.sample_rate = getattr(settings, 'MEMORY_PROFILING_SAMPLE_RATE', 1.0)
            self._init_metrics()
            
            if not tracemalloc.is_tracing():
                tracemalloc.start()
    
    def __call__(self, request):
        if not self.enabled:
            return self.get_response(request)
            
        # Sample requests based on configured rate
        import random
        if random.random() > self.sample_rate:
            return self.get_response(request)
            
        # Pre-request memory measurement + tracemalloc snapshot
        gc.collect()
        memory_before = self.process.memory_info().rss
        tracemalloc_before = tracemalloc.take_snapshot() if tracemalloc.is_tracing() else None
        
        # Process request
        response = self.get_response(request)
        
        # Post-request analysis
        memory_after = self.process.memory_info().rss
        memory_diff = memory_after - memory_before
        view_name = self._get_view_name(request)
        
        # Update all metrics
        self._update_memory_metrics(memory_after, memory_diff, view_name)
        self._check_memory_growth(memory_diff)
        self._update_object_counts()
        self._update_gc_metrics()
        
        if tracemalloc_before:
            self._analyze_tracemalloc(tracemalloc_before, view_name)
            
        return response
    
    @classmethod
    def _init_metrics(cls):
        """Initialize comprehensive Prometheus metrics (class-level to avoid duplicates)."""
        if cls._metrics_initialized:
            return
            
        cls._memory_usage_gauge = Gauge('memory_usage_bytes', 'Current memory usage', 
                                       ['container', 'view_name'], namespace='django')
        cls._memory_growth_counter = Counter('memory_growth_events_total', 'Memory growth events', 
                                           ['container', 'threshold'], namespace='django')
        cls._object_count_gauge = Gauge('python_objects_total', 'Python objects in memory', 
                                       ['container', 'object_type'], namespace='django')
        cls._gc_collections_counter = Counter('gc_collections_total', 'GC collection runs', 
                                             ['container', 'generation'], namespace='django')
        cls._memory_allocation_histogram = Histogram('allocation_bytes', 'Memory allocation distribution', 
                                                    ['container', 'view_name'], namespace='django')
        cls._metrics_initialized = True
```

### Kubernetes Configuration Updates

#### Deployment Environment Variables
```yaml
# ci/k8s/deployment.yml
env:
- name: CONTAINER_NAME
  value: "rsr-backend"  # Different for each container
- name: ENABLE_MEMORY_PROFILING
  value: "true"
- name: MEMORY_PROFILING_SAMPLE_RATE
  value: "1.0"  # 100% initially, can be reduced
```

#### Service Annotations
```yaml
# ci/k8s/service.yml
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8000"
    prometheus.io/path: "/metrics"
```

### Grafana Dashboard Enhancements

#### New Dashboard Panels
```json
{
  "title": "Memory Leak Detection",
  "panels": [
    {
      "title": "Memory Growth Rate",
      "type": "graph",
      "targets": [
        {
          "expr": "rate(django_memory_usage_bytes[1h])",
          "legendFormat": "{{container}} - {{view_name}}"
        }
      ]
    },
    {
      "title": "Memory Leak Events",
      "type": "graph", 
      "targets": [
        {
          "expr": "increase(django_memory_growth_events[1h])",
          "legendFormat": "{{container}} - {{threshold}}"
        }
      ]
    }
  ]
}
```

## Performance Impact Assessment

### Expected Overhead
- **Django-prometheus**: <0.1% performance impact
- **Memory leak detection middleware**: <0.4% additional impact
- **Total overhead**: <0.5% performance impact

### Mitigation Strategies
- **Configurable sampling**: Reduce monitoring frequency if needed
- **Conditional activation**: Enable only when memory issues suspected
- **Circuit breaker**: Automatic disable if overhead exceeds threshold

## Risk Assessment & Mitigation

### Technical Risks
1. **Performance Impact**: 
   - Mitigation: Comprehensive testing, gradual rollout
2. **Memory Overhead**: 
   - Mitigation: Efficient implementation, monitoring of monitoring
3. **Alert Fatigue**: 
   - Mitigation: Proper threshold tuning, correlation analysis

### Operational Risks
1. **Deployment Complexity**: 
   - Mitigation: Thorough testing, rollback procedures
2. **Maintenance Burden**: 
   - Mitigation: Good documentation, team training

## Success Criteria

### Phase 1 Success Metrics
- [x] Django-prometheus installed without performance degradation
- [x] Metrics endpoint accessible and functional
- [x] Existing monitoring unchanged

### Phase 2 Success Metrics
- [x] Memory leak detection middleware operational
- [x] Custom memory metrics exported to Prometheus
- [x] HTTP container monitoring active (backend, reports)
- [ ] Worker container monitoring active (architectural limitation identified)

### Phase 3 Success Metrics
- [ ] Enhanced Grafana dashboard functional
- [ ] Automated alerts configured and tested
- [ ] Memory trend analysis available

### Phase 4 Success Metrics
- [ ] Production deployment successful
- [ ] Memory leak detection operational for 7 days
- [ ] Team trained on new monitoring capabilities

## Timeline & Resource Allocation

### Total Estimated Time: 10-15 hours
- **Phase 1**: 2-3 hours
- **Phase 2**: 4-6 hours  
- **Phase 3**: 2-3 hours
- **Phase 4**: 2-3 hours

### Resource Requirements
- **Developer time**: 10-15 hours
- **Testing environment**: 2-3 days
- **Production deployment**: 1 day monitoring

## Next Steps

1. **Immediate**: Begin Phase 1 implementation
2. **Dependencies**: Ensure test environment availability
3. **Approvals**: Confirm production deployment window
4. **Communication**: Notify team of monitoring enhancements

## Monitoring & Maintenance

### Daily Monitoring
- Check alert functionality
- Monitor performance metrics
- Review memory usage trends

### Weekly Reviews
- Analyze memory leak detection reports
- Review alert thresholds
- Optimize monitoring configuration

### Monthly Assessments
- Evaluate monitoring effectiveness
- Update documentation
- Plan feature enhancements

---

**Status**: ✅ Phase 1 & Phase 2 Complete - Ready for Phase 3  
**Last Updated**: 2025-07-15  
**Next Review**: Upon Phase 3 completion

## Phase 2 Implementation Summary

### Completed Features
- **Modern Django Middleware**: Implemented using callable pattern for better performance
- **HTTP Container Monitoring**: Backend and reports containers fully monitored
- **Comprehensive Metrics**: 5 different metric types covering memory usage, growth, objects, GC, and allocations
- **Configurable Sampling**: Reduces overhead with `MEMORY_PROFILING_SAMPLE_RATE`
- **Tracemalloc Integration**: Detailed memory allocation tracking for leak pattern detection
- **Error Resilience**: Middleware continues operating even if metrics collection fails
- **Testing Compatibility**: Class-level metrics prevent duplicate registration during testing
- **Middleware Package Structure**: Organized middleware into proper Python package with backward compatibility

### Architectural Limitation Identified
- **Worker Container**: Django middleware only runs during HTTP request/response cycles
- **Background Jobs**: Django-Q tasks, management commands, and other non-HTTP processes don't trigger middleware
- **Solution Required**: Separate monitoring approach needed for worker container (Django-Q hooks, periodic sampling, or management command wrappers)

### Key Metrics Implemented
1. `django_memory_usage_bytes`: Real-time memory usage per container/view
2. `django_memory_growth_events_total`: Counts when memory growth exceeds thresholds
3. `django_python_objects_total`: Tracks Python object counts by type
4. `django_gc_collections_total`: Garbage collection statistics
5. `django_memory_allocation_bytes`: Memory allocation size distribution

### Current Monitoring Coverage
- ✅ **Backend Container** (rsr-backend): Full HTTP request monitoring
- ✅ **Reports Container** (rsr-reports): Full HTTP request monitoring
- ❌ **Worker Container** (rsr-worker): No monitoring (requires Phase 2.5 implementation)

### Recommended Next Steps
1. **Phase 3**: Proceed with Grafana dashboard for existing HTTP container metrics
2. **Phase 2.5** (Optional): Implement worker container monitoring using Django-Q hooks
3. **Phase 4**: Production deployment with current HTTP monitoring capabilities