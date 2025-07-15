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
   - **Backend Container**: Request-level memory tracking
   - **Reports Container**: Report generation memory monitoring  
   - **Worker Container**: Background job memory leak detection

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
- [ ] Memory leak detection middleware implemented
- [ ] Container-specific memory monitoring active
- [ ] Custom memory metrics exported
- [ ] Memory snapshot system operational

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
import tracemalloc
import psutil
import gc
from django_prometheus.conf import NAMESPACE
from prometheus_client import Gauge, Counter, Histogram

class MemoryLeakDetectionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.process = psutil.Process()
        
        # Custom metrics
        self.memory_usage_gauge = Gauge(
            'django_memory_usage_bytes',
            'Current memory usage',
            ['container', 'view_name'],
            namespace=NAMESPACE
        )
        
        self.memory_growth_counter = Counter(
            'django_memory_growth_events',
            'Memory growth events',
            ['container', 'threshold'],
            namespace=NAMESPACE
        )
        
        # Initialize tracemalloc
        if not tracemalloc.is_tracing():
            tracemalloc.start()
    
    def __call__(self, request):
        # Pre-request memory snapshot
        gc.collect()
        mem_before = self.process.memory_info().rss
        
        # Execute request
        response = self.get_response(request)
        
        # Post-request memory analysis
        mem_after = self.process.memory_info().rss
        memory_diff = mem_after - mem_before
        
        # Update metrics
        container_name = os.environ.get('CONTAINER_NAME', 'unknown')
        view_name = getattr(request, 'resolver_match', {}).get('view_name', 'unknown')
        
        self.memory_usage_gauge.labels(
            container=container_name,
            view_name=view_name
        ).set(mem_after)
        
        # Detect memory growth
        if memory_diff > 10 * 1024 * 1024:  # 10MB threshold
            self.memory_growth_counter.labels(
                container=container_name,
                threshold='10mb'
            ).inc()
        
        return response
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
- [ ] Memory leak detection middleware operational
- [ ] Custom memory metrics exported to Prometheus
- [ ] Container-specific monitoring active

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

**Status**: ✅ Phase 1 Complete - Beginning Phase 2  
**Last Updated**: 2025-07-15  
**Next Review**: Upon Phase 2 completion