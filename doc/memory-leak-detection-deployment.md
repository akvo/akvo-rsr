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
- **Django Middleware**: Memory leak detection middleware in all HTTP containers
- **Prometheus Metrics**: Custom memory metrics exported via `/metrics` endpoint (protected with HTTP Basic Authentication)
- **Environment Variables**: Configuration for memory profiling behavior and metrics authentication

### 2. Monitoring Components
- **Grafana Dashboard**: Enhanced with 5 new memory leak detection panels
- **Alert Rules**: 10 comprehensive alert rules for memory leak detection
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
- [ ] Django settings include memory profiling middleware
- [ ] Requirements include `django-prometheus` dependency
- [ ] All tests pass with new middleware

### Configuration Review
- [ ] Deployment YAML includes memory profiling environment variables
- [ ] Metrics authentication credentials configured in secrets
- [ ] Prometheus static target configuration for authenticated scraping
- [ ] Prometheus configuration includes RSR metrics scrape job with authentication
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

   # Deploy application with memory monitoring
   kubectl apply -f ci/k8s/deployment.yml
   ```

2. **Update Prometheus Configuration**
   ```bash
   # Update Prometheus configuration to include RSR metrics scraping with authentication
   # This should be done by the infrastructure team using the updated prometheus.yaml
   # The configuration includes a new 'rsr-metrics' job with basic authentication

   # Restart Prometheus to pick up new configuration
   helm upgrade prometheus prometheus-community/prometheus --namespace monitoring --values prometheus.yaml
   ```

3. **Monitor Deployment**
   ```bash
   # Watch deployment progress
   kubectl rollout status deployment/rsr --timeout=600s

   # Check pod status
   kubectl get pods -l app=rsr

   # Monitor logs for any startup issues
   kubectl logs -f deployment/rsr -c rsr-backend

   # Verify Prometheus is picking up the new target
   # Check Prometheus UI -> Status -> Targets -> look for 'rsr-metrics' job
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
   # Check metrics endpoint accessibility (requires authentication)
   kubectl exec -it <pod-name> -c rsr-backend -- curl -u $METRICS_AUTH_USERNAME:$METRICS_AUTH_PASSWORD localhost:8000/metrics | grep django_memory

   # Verify environment variables
   kubectl exec -it <pod-name> -c rsr-backend -- printenv | grep -E "(MEMORY|METRICS_AUTH)"

   # Check Django middleware configuration
   kubectl exec -it <pod-name> -c rsr-backend -- python manage.py shell -c "from django.conf import settings; print([m for m in settings.MIDDLEWARE if 'memory' in m.lower()])"
   ```

### Step 3: Verify Monitoring Integration

1. **Prometheus Metrics Collection**
   ```bash
   # Check if Prometheus is scraping metrics with authentication
   # Access Prometheus UI -> Status -> Targets -> verify 'rsr-metrics' job is UP

   # Search for memory metrics in Prometheus UI
   # Query: django_memory_usage_bytes
   # Query: django_memory_growth_events_total

   # Verify the 'rsr-metrics' job is successfully authenticating
   # Should see "Last Scrape" time updating every 15 seconds
   ```

2. **Grafana Dashboard Verification**
   ```bash
   # Access Grafana dashboard
   # Navigate to RSR dashboard
   # Verify new memory leak detection panels are showing data
   ```

3. **Alert System Testing**
   ```bash
   # Check alert rules are loaded
   # Access Prometheus alerts page
   # Verify memory leak detection alerts are configured
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
| `CONTAINER_NAME` | `rsr-backend` | Container identifier for metrics |
| `ENABLE_PROMETHEUS_METRICS` | `true` | Enable Django Prometheus metrics |
| `METRICS_AUTH_USERNAME` | *required* | Username for /metrics endpoint authentication |
| `METRICS_AUTH_PASSWORD` | *required* | Password for /metrics endpoint authentication |

### Memory Profiling Settings

```python
# Django settings for memory profiling
ENABLE_MEMORY_PROFILING = os.environ.get('ENABLE_MEMORY_PROFILING', 'true').lower() == 'true'
MEMORY_PROFILING_SAMPLE_RATE = float(os.environ.get('MEMORY_PROFILING_SAMPLE_RATE', '1.0'))
MEMORY_GROWTH_THRESHOLD_MB = int(os.environ.get('MEMORY_GROWTH_THRESHOLD_MB', '10'))

# Metrics endpoint authentication (required)
METRICS_AUTH_USERNAME = os.environ.get('METRICS_AUTH_USERNAME')
METRICS_AUTH_PASSWORD = os.environ.get('METRICS_AUTH_PASSWORD')
```

## Troubleshooting

### Common Issues

1. **Metrics Endpoint Not Accessible**
   - Check pod health status
   - Verify service configuration
   - Confirm middleware is properly loaded
   - Ensure authentication credentials are provided
   - Test endpoint with: `curl -u username:password localhost:8000/metrics`

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

5. **Metrics Authentication Issues**
   - Verify `METRICS_AUTH_USERNAME` and `METRICS_AUTH_PASSWORD` are set
   - Check credentials are correctly configured in Kubernetes secrets
   - Ensure Prometheus scraping configuration includes authentication
   - Test authentication: returns 401 without credentials, 200 with correct credentials
   - Returns 500 if credentials not configured (indicates misconfiguration)

### Diagnostic Commands

```bash
# Check deployment status
kubectl get deployment rsr -o wide

# View pod logs
kubectl logs -l app=rsr -c rsr-backend --tail=100

# Check metrics endpoint (requires authentication)
kubectl port-forward svc/rsr 8000:8000 &
curl -u $METRICS_AUTH_USERNAME:$METRICS_AUTH_PASSWORD localhost:8000/metrics | grep django_memory

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
- **Memory Overhead**: ~1-2MB per container
- **CPU Overhead**: <0.5% under normal load
- **Network Overhead**: Minimal (metrics collection only)

### Optimization Recommendations
- Start with `MEMORY_PROFILING_SAMPLE_RATE=1.0` for full monitoring
- Reduce to `0.1` (10%) if performance impact is concerning
- Monitor garbage collection frequency changes
- Consider disabling during peak traffic periods if needed

## Security Considerations

### Metrics Endpoint Security
- **HTTP Basic Authentication**: `/metrics` endpoint requires authentication with username/password
- **Mandatory Credentials**: Authentication cannot be disabled - returns 500 error if credentials not configured
- **Environment Variables**: Credentials stored as Kubernetes secrets (`METRICS_AUTH_USERNAME`, `METRICS_AUTH_PASSWORD`)
- **Prometheus Configuration**: Dedicated `rsr-metrics` scrape job with static target and basic authentication
- **Static Target**: Uses `rsr.default.svc.cluster.local:8000` for direct service access
- **Credentials**: Hardcoded in Prometheus configuration (private repository)

### General Security
- Memory metrics contain no sensitive application data
- Runbook contains operational procedures, not secrets
- Alert rules use standard Prometheus security model
- All monitoring components run within existing security boundaries

## Configuration Files

### Application Configuration
- **Memory leak middleware**: `akvo/rsr/middleware/memory_profiling.py`
- **Django settings**: `akvo/settings/46-prometheus.conf`
- **Kubernetes deployment**: `ci/k8s/deployment.yml` (includes metrics auth environment variables)
- **Kubernetes service**: `ci/k8s/service.yml` (core service configuration)

### Monitoring Configuration
- **Kubernetes alerts**: `ci/k8s/memory-leak-alerts.yml`
- **Grafana dashboard**: `ci/k8s/grafana/main.yml`
- **Prometheus configuration**: `../akvo-config/k8s/monitoring/prometheus.yaml` (includes `rsr-metrics` job)
- **Validation script**: `scripts/deployment/validate-memory-monitoring.sh`

### Secrets Configuration
- **Test environment**: `../akvo-config/k8s-secrets/test/rsr-secret/metrics-auth-*`
- **Production environment**: `../akvo-config/k8s-secrets/production/rsr-secret/metrics-auth-*`

### Prometheus Scrape Job Configuration

The Prometheus configuration includes dedicated scrape jobs for RSR metrics:

```yaml
# Backend container metrics (Django application on port 8000)
- job_name: 'rsr-backend-metrics'
  static_configs:
    - targets: ['rsr.default.svc.cluster.local:8000']
  metrics_path: '/metrics'
  basic_auth:
    username: '***redacted***'
    password: '***redacted***'
  scrape_interval: 15s

# Reports container metrics (Django reports service on port 9000)
- job_name: 'rsr-reports-metrics'
  static_configs:
    - targets: ['rsr.default.svc.cluster.local:9000']
  metrics_path: '/metrics'
  basic_auth:
    username: '***redacted***'
    password: '***redacted***'
  scrape_interval: 15s
```

**Container Coverage:**
- **Backend container** (`rsr-backend`): Port 8000 - HTTP Django metrics with authentication
- **Reports container** (`rsr-reports`): Port 9000 - HTTP Django metrics with authentication

**Key Features:**
- **Multiple targets**: Separate jobs for backend and reports containers
- **Authentication**: Both HTTP endpoints require basic authentication
- **Service exposure**: Kubernetes service exposes both ports 8000 and 9000
- **Stable access**: Uses service DNS names for reliable connectivity
- **Load balancing**: Service provides load balancing if multiple replicas exist

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
- [ ] Memory metrics are being collected from both containers
- [ ] Prometheus `rsr-backend-metrics` job is successfully scraping with authentication
- [ ] Prometheus `rsr-reports-metrics` job is successfully scraping with authentication
- [ ] Grafana dashboard shows memory data from both backend and reports containers
- [ ] Alert rules are loaded and functional
- [ ] Both metrics endpoints return 401 without credentials, 200 with correct credentials
- [ ] No performance degradation observed

### Operational Success
- [ ] Memory leak detection alerts are working
- [ ] Operational procedures are effective
- [ ] Team is trained on new monitoring capabilities
- [ ] Performance impact is within acceptable limits