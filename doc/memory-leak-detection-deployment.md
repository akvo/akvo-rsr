# Memory Leak Detection Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the memory leak detection system to production environments. The system includes enhanced monitoring, alerting, and operational procedures for detecting and responding to memory leaks in the Akvo RSR application.

## Prerequisites

- Kubernetes cluster with existing RSR deployment
- kubectl access to the target environment
- Prometheus and Grafana monitoring stack
- Docker images built with memory leak detection middleware

## Deployment Components

### 1. Application Components
- **Django Middleware**: Memory leak detection middleware in HTTP containers (backend, reports)
  - Backend container: `http://localhost:8000/metrics`
  - Reports container: `http://localhost:9000/metrics`
- **Worker Memory Monitoring**: Extended Django-Q probe system with memory metrics for worker container
  - Worker container: `http://localhost:8080/metrics`
- **Prometheus Metrics**: Custom memory metrics exported via `/metrics` endpoint from all containers
- **Environment Variables**: Configuration for memory profiling behavior

### 2. Monitoring Components
- **Grafana Dashboard**: Enhanced with 8 memory leak detection panels (5 general + 3 worker-specific)
- **Alert Rules**: 15 comprehensive alert rules for memory leak detection (including worker-specific alerts)
- **Runbook**: Operational procedures for incident response

### 3. Validation Components
- **Deployment Validation Script**: Automated validation of memory monitoring setup
- **Health Checks**: Verification of metrics collection and alerting

## Pre-Deployment Checklist

### Environment Preparation
- [ ] Verify Kubernetes cluster access
- [ ] Confirm Prometheus is collecting metrics from RSR pods
- [ ] Ensure Grafana dashboard is accessible
- [ ] Backup existing monitoring configuration

### Code Verification
- [ ] Middleware implemented in `akvo/rsr/middleware/memory_profiling.py`
- [ ] Worker monitoring implemented in `akvo/rsr/monitoring/worker_memory.py`
- [ ] Django-Q probe system extended in `akvo/rsr/management/commands/django_q_probettp.py`
- [ ] Django settings include memory profiling middleware
- [ ] Requirements include `django-prometheus` dependency
- [ ] All tests pass with new middleware and worker monitoring

### Configuration Review
- [ ] Deployment YAML includes memory profiling environment variables
- [ ] Service annotations configured for Prometheus scraping
- [ ] Alert rules properly configured
- [ ] Grafana dashboard panels configured

## Deployment Steps

### Step 1: Deploy Application Changes

1. **Apply Kubernetes Configuration**
   ```bash
   # Apply memory leak detection alert rules
   kubectl apply -f ci/k8s/memory-leak-alerts.yml
   
   # Update Grafana dashboard
   kubectl apply -f ci/k8s/grafana/main.yml
   
   # Update service configuration
   kubectl apply -f ci/k8s/service.yml
   
   # Deploy worker metrics service
   kubectl apply -f ci/k8s/worker-metrics-service.yml
   
   # Deploy application with memory monitoring
   kubectl apply -f ci/k8s/deployment.yml
   ```

2. **Monitor Deployment**
   ```bash
   # Watch deployment progress
   kubectl rollout status deployment/rsr --timeout=600s
   
   # Check pod status
   kubectl get pods -l app=rsr
   
   # Monitor logs for any startup issues
   kubectl logs -f deployment/rsr -c rsr-backend
   ```

### Step 2: Validate Deployment

1. **Run Automated Validation**
   ```bash
   # Run the validation script
   ./scripts/deployment/validate-memory-monitoring.sh
   
   # Or with custom parameters
   NAMESPACE=default APP_LABEL=app=rsr ./scripts/deployment/validate-memory-monitoring.sh
   ```

2. **Manual Validation Steps**
   ```bash
   # Check backend metrics endpoint accessibility
   kubectl exec -it <pod-name> -c rsr-backend -- curl localhost:8000/metrics | grep django_memory
   
   # Check reports metrics endpoint accessibility
   kubectl exec -it <pod-name> -c rsr-reports -- curl localhost:9000/metrics | grep django_memory
   
   # Check worker metrics endpoint accessibility  
   kubectl exec -it <pod-name> -c worker -- curl localhost:8080/metrics | grep django_memory
   
   # Verify environment variables (all containers)
   kubectl exec -it <pod-name> -c rsr-backend -- printenv | grep MEMORY
   kubectl exec -it <pod-name> -c rsr-reports -- printenv | grep MEMORY
   kubectl exec -it <pod-name> -c worker -- printenv | grep MEMORY
   
   # Check Django middleware configuration (HTTP containers)
   kubectl exec -it <pod-name> -c rsr-backend -- python manage.py shell -c "from django.conf import settings; print([m for m in settings.MIDDLEWARE if 'memory' in m.lower()])"
   kubectl exec -it <pod-name> -c rsr-reports -- python manage.py shell -c "from django.conf import settings; print([m for m in settings.MIDDLEWARE if 'memory' in m.lower()])"
   
   # Check worker memory monitor initialization
   kubectl exec -it <pod-name> -c worker -- python manage.py shell -c "from akvo.rsr.monitoring.worker_memory import WorkerMemoryMonitor; print('Worker monitoring:', WorkerMemoryMonitor().enabled)"
   ```

### Step 3: Verify Monitoring Integration

1. **Prometheus Metrics Collection**
   ```bash
   # Check if Prometheus is scraping metrics from HTTP containers
   # Access Prometheus UI and search for: django_memory_usage_bytes{container!="rsr-worker"}
   
   # Check if Prometheus is scraping metrics from worker container
   # Search for: django_memory_usage_bytes{container="rsr-worker"}
   
   # Verify worker-specific metrics are being collected
   # Search for: django_worker_task_memory_bytes
   # Search for: django_worker_tasks_total
   ```

2. **Grafana Dashboard Verification**
   ```bash
   # Access Grafana dashboard
   # Navigate to RSR dashboard
   # Verify HTTP container memory leak detection panels are showing data
   # Verify worker container memory monitoring panels are showing data:
   #   - Worker Container Memory Usage (MB)
   #   - Worker Task Execution Rate (tasks/hour)  
   #   - Worker Task Memory Usage by Task (MB)
   ```

3. **Alert System Testing**
   ```bash
   # Check alert rules are loaded
   # Access Prometheus alerts page
   # Verify memory leak detection alerts are configured:
   #   - General memory alerts (HighMemoryGrowthRate, CriticalMemoryUsage, etc.)
   #   - Worker-specific alerts (WorkerTaskHighMemoryUsage, WorkerMemoryGrowthRate, etc.)
   #   - Container-level alerts (ContainerMemoryGrowthRate, ContainerHighMemoryUsage)
   ```

## Post-Deployment Monitoring

### Immediate Monitoring (First 24 Hours)
- [ ] Monitor application performance metrics
- [ ] Watch for memory usage patterns
- [ ] Verify alert system is functional
- [ ] Check for any error logs related to memory profiling

### Short-term Monitoring (First Week)
- [ ] Analyze memory growth trends
- [ ] Review alert threshold effectiveness
- [ ] Monitor garbage collection patterns
- [ ] Assess performance impact

### Long-term Monitoring (First Month)
- [ ] Evaluate memory leak detection effectiveness
- [ ] Optimize alert thresholds based on patterns
- [ ] Review operational procedures
- [ ] Plan any necessary adjustments

## Configuration Parameters

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_MEMORY_PROFILING` | `true` | Enable/disable memory profiling |
| `MEMORY_PROFILING_SAMPLE_RATE` | `1.0` | Sample rate (0.0-1.0) for memory profiling |
| `CONTAINER_NAME` | `rsr-backend`/`rsr-worker` | Container identifier for metrics |
| `ENABLE_PROMETHEUS_METRICS` | `true` | Enable Django Prometheus metrics |

### Memory Profiling Settings

```python
# Django settings for memory profiling
ENABLE_MEMORY_PROFILING = os.environ.get('ENABLE_MEMORY_PROFILING', 'true').lower() == 'true'
MEMORY_PROFILING_SAMPLE_RATE = float(os.environ.get('MEMORY_PROFILING_SAMPLE_RATE', '1.0'))
MEMORY_GROWTH_THRESHOLD_MB = int(os.environ.get('MEMORY_GROWTH_THRESHOLD_MB', '10'))
```

## Troubleshooting

### Common Issues

1. **Metrics Endpoint Not Accessible**
   - Check pod health status
   - Verify service configuration
   - Confirm middleware is properly loaded

2. **Memory Metrics Not Appearing**
   - Verify environment variables are set
   - Check Django middleware configuration
   - Ensure sample rate is > 0

3. **High Performance Impact**
   - Reduce `MEMORY_PROFILING_SAMPLE_RATE` (e.g., to 0.1)
   - Monitor CPU usage patterns
   - Consider disabling in high-load periods

4. **Alerts Not Firing**
   - Verify alert rules are loaded in Prometheus
   - Check metric collection is working
   - Review alert threshold configuration

### Diagnostic Commands

```bash
# Check deployment status
kubectl get deployment rsr -o wide

# View pod logs
kubectl logs -l app=rsr -c rsr-backend --tail=100

# Check backend metrics endpoint
kubectl port-forward svc/rsr 8000:8000 &
curl localhost:8000/metrics | grep django_memory

# Check reports metrics endpoint
kubectl port-forward svc/rsr 9000:9000 &
curl localhost:9000/metrics | grep django_memory

# Check worker metrics endpoint
kubectl port-forward svc/rsr-worker-metrics 8080:8080 &
curl localhost:8080/metrics | grep django_memory

# Test alert rules
kubectl exec -it <prometheus-pod> -- promtool query instant 'django_memory_usage_bytes'
```

## Rollback Procedures

### Quick Rollback (If Issues Occur)

1. **Disable Memory Profiling**
   ```bash
   # Set environment variable to disable profiling
   kubectl set env deployment/rsr ENABLE_MEMORY_PROFILING=false
   
   # Wait for rollout to complete
   kubectl rollout status deployment/rsr
   ```

2. **Full Rollback to Previous Version**
   ```bash
   # Rollback to previous deployment
   kubectl rollout undo deployment/rsr
   
   # Verify rollback
   kubectl rollout status deployment/rsr
   ```

3. **Remove Monitoring Components**
   ```bash
   # Remove alert rules
   kubectl delete -f ci/k8s/memory-leak-alerts.yml
   
   # Restore previous Grafana dashboard
   # (Restore from backup if available)
   ```

## Performance Considerations

### Expected Performance Impact
- **Memory Overhead**: ~1-2MB per HTTP container, ~1MB per worker container
- **CPU Overhead**: <0.5% under normal load (HTTP containers), <0.1% (worker container)
- **Network Overhead**: Minimal (metrics collection only)

### Optimization Recommendations
- Start with `MEMORY_PROFILING_SAMPLE_RATE=1.0` for full monitoring
- Reduce to `0.1` (10%) if performance impact is concerning
- Monitor garbage collection frequency changes
- Consider disabling during peak traffic periods if needed

## Security Considerations

- Memory metrics contain no sensitive application data
- Runbook contains operational procedures, not secrets
- Alert rules use standard Prometheus security model
- All monitoring components run within existing security boundaries

## Maintenance

### Regular Tasks
- Review memory growth trends weekly
- Update alert thresholds based on usage patterns
- Check for new memory leak detection patterns
- Update runbook based on operational experience

### Upgrades
- Monitor for django-prometheus library updates
- Test middleware changes in staging environment
- Coordinate with infrastructure team for Prometheus/Grafana updates
- Review and update alert rules as application evolves

## Support

### Resources
- **Runbook**: `runbooks/memory-leak-detection.md`
- **Technical Documentation**: `MEMORY_LEAK_DETECTION_PLAN.md`
- **Validation Script**: `scripts/deployment/validate-memory-monitoring.sh`
- **Grafana Dashboard**: RSR dashboard with memory leak detection panels

### Escalation
- Level 1: Use runbook procedures
- Level 2: Engage development team
- Level 3: Consider external memory profiling tools
- Level 4: Architecture review for memory optimization

## Success Metrics

### Deployment Success
- [ ] All pods restart successfully
- [ ] Memory metrics are being collected from all containers (backend, reports, worker)
- [ ] Grafana dashboard shows memory data for all containers
- [ ] Alert rules are loaded and functional (including worker-specific alerts)
- [ ] Worker metrics endpoint responding on port 8080
- [ ] No performance degradation observed

### Operational Success
- [ ] Memory leak detection alerts are working
- [ ] Operational procedures are effective
- [ ] Team is trained on new monitoring capabilities
- [ ] Performance impact is within acceptable limits