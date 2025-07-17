# Phase 2.5: Worker Container Memory Monitoring Implementation Plan

**Project**: Akvo RSR Memory Leak Detection - Phase 2.5  
**Created**: 2025-07-16  
**Goal**: Implement comprehensive memory monitoring for Django-Q worker container  
**Status**: ✅ Complete

## Executive Summary

This document outlines the implementation plan for Phase 2.5 of the memory leak detection system, specifically addressing the architectural limitation identified in Phase 2 where Django middleware cannot monitor background jobs in the worker container.

## Current Architecture Analysis

### Existing Django-Q Infrastructure
- **Probe System**: `/akvo/rsr/management/commands/django_q_probettp.py`
  - HTTP server on localhost:8080
  - Health check endpoint for Kubernetes liveness/readiness probes
  - Checks cluster status and recent task success (10-minute window)
  - Signal handling for graceful shutdown

- **Worker Container Configuration**:
  - Runs `manage.py qcluster` for Django-Q background processing
  - Environment variable: `IS_WORKER=yes`
  - Health checks via probe script
  - Resource limits: 1000m CPU request, 6000m limit

- **Background Jobs**:
  - 5 active scheduled tasks (IATI checks, aggregation, cleanup, imports)
  - Unique task protection using cache-based locking
  - Robust error handling and retry logic
  - PID-based dead job detection

### Current Monitoring Gap
- ❌ **Worker Container**: No application-level memory monitoring
- ✅ **Backend Container**: Full HTTP request monitoring via middleware
- ✅ **Reports Container**: Full HTTP request monitoring via middleware
- ✅ **Container-Level**: Kubernetes metrics available but not application-specific

## Implementation Strategy

### Three-Pronged Approach

#### 1. Primary: Extend Django-Q Probe System
**Rationale**: Leverage existing HTTP server infrastructure
- Extend `django_q_probettp.py` with `/metrics` endpoint
- Add memory monitoring to existing health check server
- Reuse memory profiling logic from Phase 2 middleware
- Minimal infrastructure changes required

#### 2. Secondary: Django-Q Task Wrapper
**Rationale**: Provide task-specific memory insights
- Create decorator for existing background tasks
- Track pre/post task execution memory usage
- Export metrics via existing django-prometheus integration
- Optional enhancement without breaking existing functionality

#### 3. Fallback: Periodic Background Monitoring
**Rationale**: Continuous monitoring independent of task execution
- 30-second interval memory sampling
- Background thread monitoring
- Container-level memory usage tracking
- Non-intrusive implementation

## Technical Implementation Plan

### Step 1: Create Worker Memory Monitoring Module
**File**: `akvo/rsr/monitoring/worker_memory.py`

```python
class WorkerMemoryMonitor:
    """
    Worker-specific memory monitoring class that can be used by:
    1. Django-Q probe system (HTTP endpoint)
    2. Task wrappers (pre/post task measurement)
    3. Background monitoring thread (periodic sampling)
    """
    
    def __init__(self):
        # Initialize memory tracking components
        # Reuse logic from existing middleware
        
    def collect_memory_metrics(self):
        # Core memory collection logic
        # Memory usage, object counts, GC stats
        
    def format_prometheus_metrics(self):
        # Format metrics for Prometheus consumption
        # Compatible with existing django-prometheus integration
        
    def export_to_prometheus(self):
        # Export metrics using prometheus_client
        # Maintain consistency with existing patterns
```

### Step 2: Extend Django-Q Probe System
**File**: `akvo/rsr/management/commands/django_q_probettp.py`

**Changes**:
- Add `/metrics` endpoint alongside existing health check
- Integrate `WorkerMemoryMonitor` for memory metrics collection
- Maintain existing health check functionality
- Use same port 8080 (already monitored by Kubernetes)

```python
class DjangoQRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/metrics':
            self.handle_metrics_request()
        else:
            self.handle_health_check()  # Existing functionality
            
    def handle_metrics_request(self):
        # Collect and return memory metrics
        # Format as Prometheus metrics
        
    def handle_health_check(self):
        # Existing health check logic (unchanged)
```

### Step 3: Create Django-Q Task Wrapper
**File**: `akvo/rsr/monitoring/task_wrapper.py`

```python
class MemoryMonitoredTask:
    """
    Decorator for Django-Q tasks to add memory monitoring
    Usage: @memory_monitored_task
    """
    
    def __call__(self, func):
        def wrapper(*args, **kwargs):
            # Pre-task memory measurement
            result = func(*args, **kwargs)
            # Post-task memory measurement
            # Export task-specific metrics
            return result
        return wrapper
```

### Step 4: Update Kubernetes Configuration
**File**: `ci/k8s/deployment.yml`

**Changes**:
- Add worker container environment variables for memory monitoring
- Update health check configuration to include metrics endpoint
- Configure Prometheus scraping for worker container

```yaml
# Worker container environment variables
env:
- name: CONTAINER_NAME
  value: "rsr-worker"
- name: ENABLE_MEMORY_PROFILING
  value: "true"
- name: MEMORY_PROFILING_SAMPLE_RATE
  value: "1.0"
```

### Step 5: Update Service Configuration
**File**: `ci/k8s/service.yml`

**Changes**:
- Add service configuration for worker metrics collection
- Configure proper port and path for Prometheus scraping

### Step 6: Extend Alert Rules
**File**: `ci/k8s/memory-leak-alerts.yml`

**Changes**:
- Add worker-specific memory leak detection alerts
- Include task-level memory usage alerts
- Maintain consistency with existing alert patterns

### Step 7: Update Grafana Dashboard
**File**: `ci/k8s/grafana/main.yml`

**Changes**:
- Add worker container memory monitoring panels
- Include task-specific memory usage visualization
- Correlate worker memory with task execution patterns

## Detailed Implementation Tasks

### Task 1: Worker Memory Monitoring Module
- [ ] Create `akvo/rsr/monitoring/` directory
- [ ] Implement `WorkerMemoryMonitor` class
- [ ] Extract reusable logic from existing middleware
- [ ] Add worker-specific memory metrics
- [ ] Implement Prometheus metrics export
- [ ] Add comprehensive error handling
- [ ] Create unit tests

### Task 2: Extend Django-Q Probe System
- [ ] Read current `django_q_probettp.py` implementation
- [ ] Add `/metrics` endpoint handler
- [ ] Integrate `WorkerMemoryMonitor`
- [ ] Maintain existing health check functionality
- [ ] Add proper HTTP headers for metrics
- [ ] Test endpoint accessibility
- [ ] Ensure backward compatibility

### Task 3: Django-Q Task Wrapper
- [ ] Create `MemoryMonitoredTask` decorator
- [ ] Implement pre/post task memory measurement
- [ ] Add task-specific metrics export
- [ ] Create usage documentation
- [ ] Test with existing scheduled tasks
- [ ] Ensure minimal performance impact

### Task 4: Kubernetes Configuration Updates
- [ ] Update worker container environment variables
- [ ] Configure Prometheus scraping annotations
- [ ] Update health check configuration
- [ ] Test service discovery
- [ ] Validate metrics collection

### Task 5: Alert Rules Extension
- [ ] Add worker-specific memory alerts
- [ ] Include task-level memory thresholds
- [ ] Test alert triggering
- [ ] Validate notification routing
- [ ] Update runbook documentation

### Task 6: Grafana Dashboard Updates
- [ ] Add worker memory usage panels
- [ ] Create task execution correlation graphs
- [ ] Add worker-specific trend analysis
- [ ] Test dashboard functionality
- [ ] Ensure proper metric visualization

### Task 7: Testing and Validation
- [ ] Unit tests for memory monitoring components
- [ ] Integration tests with Django-Q
- [ ] Performance impact assessment
- [ ] Memory leak detection validation
- [ ] End-to-end testing in test environment

### Task 8: Documentation Updates
- [ ] Update `MEMORY_LEAK_DETECTION_PLAN.md`
- [ ] Document new monitoring capabilities
- [ ] Create operational procedures
- [ ] Update troubleshooting guide
- [ ] Add deployment instructions

## Performance Considerations

### Expected Impact
- **Memory Overhead**: <1MB per worker container
- **CPU Overhead**: <0.1% under normal load
- **Network Overhead**: Minimal (metrics collection only)
- **Disk I/O**: Negligible (in-memory metrics)

### Optimization Strategies
- **Configurable Sampling**: Reduce monitoring frequency if needed
- **Lazy Loading**: Initialize monitoring components only when needed
- **Efficient Data Structures**: Use minimal memory for monitoring itself
- **Graceful Degradation**: Continue operation if monitoring fails

## Success Criteria

### Phase 2.5 Success Metrics
- [ ] Worker container memory metrics exported to Prometheus
- [ ] Memory leak detection alerts functional for background jobs
- [ ] Task-level memory usage tracking operational
- [ ] <0.1% performance impact on Django-Q processing
- [ ] Grafana dashboard shows worker memory trends
- [ ] Alert system covers all container types
- [ ] Documentation updated with new capabilities

### Integration Success
- [ ] Seamless integration with existing monitoring infrastructure
- [ ] Backward compatibility with existing health checks
- [ ] Consistent metric naming with Phase 2 implementation
- [ ] Proper error handling and graceful degradation
- [ ] Comprehensive test coverage

## Risk Assessment

### Technical Risks
1. **Performance Impact on Django-Q**: 
   - Mitigation: Minimal monitoring overhead, configurable sampling
2. **Health Check Disruption**: 
   - Mitigation: Maintain existing endpoint, add new functionality
3. **Memory Monitoring Overhead**: 
   - Mitigation: Efficient implementation, monitoring the monitor

### Operational Risks
1. **Deployment Complexity**: 
   - Mitigation: Gradual rollout, comprehensive testing
2. **Alert Noise**: 
   - Mitigation: Proper threshold tuning, correlation analysis
3. **Maintenance Burden**: 
   - Mitigation: Good documentation, automated testing

## Timeline

### Estimated Duration: 2-3 hours
- **Task 1-2**: 1 hour (Core implementation)
- **Task 3-4**: 30 minutes (Configuration updates)
- **Task 5-6**: 30 minutes (Monitoring integration)
- **Task 7-8**: 30 minutes (Testing and documentation)

### Dependencies
- Existing Phase 2 middleware implementation
- Django-Q probe system
- Kubernetes deployment configuration
- Prometheus and Grafana infrastructure

## Next Steps

1. **Immediate**: Begin Task 1 (Worker Memory Monitoring Module)
2. **Validation**: Test each component individually
3. **Integration**: Combine components into complete solution
4. **Deployment**: Update configurations and deploy
5. **Monitoring**: Validate functionality and performance

---

**Status**: 🚧 In Progress  
**Next Review**: After implementation completion  
**Dependencies**: Phase 2 middleware, Django-Q infrastructure