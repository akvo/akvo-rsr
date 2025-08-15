# Memory Leak Detection Runbook

## Overview
This runbook provides troubleshooting steps for memory leak alerts in the Akvo RSR application deployed on Kubernetes.

## Alert Types

### 1. HighMemoryGrowthRate / CriticalMemoryGrowthRate
**Trigger**: Memory growing >10MB/hour (warning) or >50MB/hour (critical)

**Immediate Actions**:
1. Check Grafana dashboard for memory growth trends
2. Identify the specific container and view causing the growth
3. Review application logs for errors or unusual activity
4. Check recent deployments or configuration changes

**Investigation Steps**:
```bash
# Check current memory usage
kubectl top pods -l app=rsr

# Get detailed memory metrics
kubectl exec -it <pod-name> -c rsr-backend -- cat /proc/meminfo

# Check application logs
kubectl logs <pod-name> -c rsr-backend --tail=100

# Review recent deployment history
kubectl rollout history deployment/rsr
```

### 2. MemoryLeakEventsDetected
**Trigger**: >5 memory growth events per hour

**Investigation**:
1. Correlate with request patterns in Grafana
2. Check for specific views or endpoints causing growth
3. Review recent code changes
4. Monitor garbage collection patterns

### 3. HighPythonObjectGrowth
**Trigger**: >1000 new objects/hour for dict/list types

**Actions**:
1. Review code for object creation patterns
2. Check for proper cleanup in request handlers
3. Look for circular references preventing garbage collection
4. Consider using memory profiling tools

### 4. HighMemoryUsage / CriticalMemoryUsage
**Trigger**: >500MB (warning) or >1GB (critical)

**Immediate Actions**:
1. **CRITICAL**: Scale horizontally if possible
2. Check for memory-intensive operations
3. Consider restarting the affected pod if critical
4. Review memory limits and requests

```bash
# Scale deployment if needed
kubectl scale deployment rsr --replicas=3

# Restart specific pod (last resort)
kubectl delete pod <pod-name>
```

### 5. ExcessiveGarbageCollection
**Trigger**: >10 GC collections/second

**Investigation**:
1. Check for memory pressure
2. Review object creation patterns
3. Consider tuning GC parameters
4. Look for memory leaks causing frequent collections

### 6. MemoryMetricsMissing
**Trigger**: No metrics for 10 minutes

**Actions**:
1. Check middleware configuration
2. Verify Prometheus scraping with authentication
3. Check application health
4. Review Django settings
5. Verify metrics authentication credentials

```bash
# Check if metrics endpoint is accessible (requires authentication)
kubectl exec -it <pod-name> -c rsr-backend -- curl -u $METRICS_AUTH_USERNAME:$METRICS_AUTH_PASSWORD localhost:8000/metrics

# Test authentication behavior (should return 401)
kubectl exec -it <pod-name> -c rsr-backend -- curl -o /dev/null -s -w "%{http_code}" localhost:8000/metrics

# Verify middleware is loaded
kubectl exec -it <pod-name> -c rsr-backend -- python manage.py shell -c "
from django.conf import settings
print([m for m in settings.MIDDLEWARE if 'memory' in m.lower()])
"

# Check authentication credentials are configured
kubectl exec -it <pod-name> -c rsr-backend -- printenv | grep METRICS_AUTH
```

### 7. MetricsAuthenticationFailure
**Trigger**: Prometheus can't scrape metrics due to authentication failure

**Actions**:
1. Verify metrics authentication credentials are configured
2. Check Prometheus scraping configuration includes authentication
3. Test endpoint authentication manually
4. Review secret configuration in Kubernetes

```bash
# Test authentication directly
kubectl exec -it <pod-name> -c rsr-backend -- curl -u $METRICS_AUTH_USERNAME:$METRICS_AUTH_PASSWORD localhost:8000/metrics

# Should return 401 without authentication
kubectl exec -it <pod-name> -c rsr-backend -- curl -o /dev/null -s -w "%{http_code}" localhost:8000/metrics

# Should return 500 if credentials not configured
kubectl exec -it <pod-name> -c rsr-backend -- bash -c 'unset METRICS_AUTH_USERNAME METRICS_AUTH_PASSWORD; curl -o /dev/null -s -w "%{http_code}" localhost:8000/metrics'

# Check secret configuration
kubectl get secret rsr-secret -o yaml | grep -E "(metrics-auth|prometheus)"

# Check Prometheus target status (if you have access to Prometheus UI)
# Navigate to Prometheus UI -> Status -> Targets -> look for 'rsr-backend-metrics' and 'rsr-reports-metrics' jobs
# Both should show status UP with "Last Scrape" updating every 15 seconds
```

## Troubleshooting Steps

### Step 1: Identify the Problem
1. Review alert details and affected components
2. Check Grafana dashboard for trends and correlations
3. Identify time range and affected containers

### Step 2: Gather Information
```bash
# Check pod status and resource usage
kubectl get pods -l app=rsr
kubectl top pods -l app=rsr

# Get detailed pod information
kubectl describe pod <pod-name>

# Check recent events
kubectl get events --sort-by=.metadata.creationTimestamp

# Verify metrics authentication configuration
kubectl exec -it <pod-name> -c rsr-backend -- printenv | grep -E "(METRICS_AUTH|PROMETHEUS)"

# Test metrics endpoint accessibility
kubectl exec -it <pod-name> -c rsr-backend -- curl -o /dev/null -s -w "%{http_code}" -u $METRICS_AUTH_USERNAME:$METRICS_AUTH_PASSWORD localhost:8000/metrics
```

### Step 3: Application-Level Investigation
```bash
# Access Django shell for investigation
kubectl exec -it <pod-name> -c rsr-backend -- python manage.py shell

# In Django shell:
import gc, psutil, tracemalloc
process = psutil.Process()
print(f"Memory: {process.memory_info().rss / 1024 / 1024:.1f}MB")
print(f"Objects: {len(gc.get_objects())}")

# Check tracemalloc if enabled
if tracemalloc.is_tracing():
    snapshot = tracemalloc.take_snapshot()
    top_stats = snapshot.statistics('lineno')[:10]
    for stat in top_stats:
        print(stat)
```

### Step 4: Log Analysis
```bash
# Check application logs for patterns
kubectl logs <pod-name> -c rsr-backend --since=1h | grep -i "memory\|error\|exception"

# Check for specific view patterns
kubectl logs <pod-name> -c rsr-backend --since=1h | grep "view_name"
```

### Step 5: Performance Analysis
1. Use Grafana to correlate memory usage with:
   - Request rate
   - Database query patterns
   - Error rates
   - CPU usage

2. Look for patterns:
   - Specific time periods
   - Particular views or endpoints
   - Correlation with user activity

## Mitigation Strategies

### Immediate (Emergency)
1. **Scale horizontally**: Add more replicas
2. **Restart affected pods**: As last resort for critical alerts
3. **Traffic throttling**: If possible, reduce load

### Short-term
1. **Memory limits**: Adjust Kubernetes memory limits
2. **Garbage collection tuning**: Optimize GC parameters
3. **Code review**: Focus on recent changes
4. **Sampling reduction**: Reduce memory profiling sample rate

### Long-term
1. **Code optimization**: Fix identified memory leaks
2. **Architecture review**: Consider memory-efficient patterns
3. **Monitoring enhancement**: Add more specific metrics
4. **Capacity planning**: Right-size resources

## Configuration Files
- Memory leak middleware: `akvo/rsr/middleware/memory_profiling.py`
- Django settings: `akvo/settings/46-prometheus.conf`
- Kubernetes deployment: `ci/k8s/deployment.yml` (includes metrics auth environment variables)
- Kubernetes service: `ci/k8s/service.yml` (core service configuration)
- Kubernetes alerts: `ci/k8s/memory-leak-alerts.yml`
- Grafana dashboard: `ci/k8s/grafana/main.yml`
- Prometheus configuration: `../akvo-config/k8s/monitoring/prometheus.yaml` (includes `rsr-backend-metrics` and `rsr-reports-metrics` scrape jobs)
- Metrics authentication secrets: `../akvo-config/k8s-secrets/{test|production}/rsr-secret/metrics-auth-*`

## Common Causes
1. **Unclosed database connections**
2. **Large object caching without cleanup**
3. **Circular references preventing GC**
4. **Third-party library memory leaks**
5. **Session or cache data accumulation**
6. **File handle leaks**

## Prevention
1. Regular code reviews focusing on memory management
2. Automated memory testing in CI/CD
3. Regular monitoring of memory trends
4. Proper resource limits and monitoring
5. Memory profiling in development environments

## Escalation
If memory leaks persist after following this runbook:
1. Engage development team for code review
2. Consider enabling detailed memory profiling
3. Use external memory profiling tools
4. Review architecture for memory-intensive components

## Useful Commands
```bash
# Memory profiling in development
python -m tracemalloc your_script.py

# Check Django middleware order
python manage.py shell -c "from django.conf import settings; print(settings.MIDDLEWARE)"

# Monitor real-time memory usage
kubectl exec -it <pod-name> -c rsr-backend -- watch -n 1 'cat /proc/meminfo | head -5'

# Get memory metrics directly (requires authentication)
kubectl exec -it <pod-name> -c rsr-backend -- curl -s -u $METRICS_AUTH_USERNAME:$METRICS_AUTH_PASSWORD localhost:8000/metrics | grep django_memory
```