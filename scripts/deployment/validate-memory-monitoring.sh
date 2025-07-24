#!/bin/bash

# Memory Leak Detection Deployment Validation Script
# This script validates that memory leak detection is properly deployed and functional

set -euo pipefail

NAMESPACE="${NAMESPACE:-default}"
APP_LABEL="${APP_LABEL:-app=rsr}"
TIMEOUT="${TIMEOUT:-300}"

echo "🔍 Validating Memory Leak Detection Deployment"
echo "Namespace: $NAMESPACE"
echo "App Label: $APP_LABEL"
echo "Timeout: ${TIMEOUT}s"
echo

# Function to wait for pods to be ready
wait_for_pods() {
    echo "⏳ Waiting for pods to be ready..."
    kubectl wait --for=condition=ready pod -l "$APP_LABEL" -n "$NAMESPACE" --timeout="${TIMEOUT}s"
    echo "✅ All pods are ready"
}

# Function to check if metrics endpoint is accessible
check_metrics_endpoint() {
    local pod_name=$1
    local container_name=$2
    local port=$3
    
    echo "🔍 Checking metrics endpoint for $container_name in pod $pod_name..."
    
    # Check if metrics endpoint is accessible
    local metrics_output
    metrics_output=$(kubectl exec -n "$NAMESPACE" "$pod_name" -c "$container_name" -- curl -s "localhost:$port/metrics" || echo "FAILED")
    
    if [[ "$metrics_output" == "FAILED" ]]; then
        echo "❌ Failed to access metrics endpoint for $container_name"
        return 1
    fi
    
    # Check for Django Prometheus metrics
    if echo "$metrics_output" | grep -q "django_"; then
        echo "✅ Django Prometheus metrics found for $container_name"
    else
        echo "⚠️  Django Prometheus metrics not found for $container_name"
    fi
    
    # Check for memory leak detection metrics
    local memory_metrics=(
        "django_memory_usage_bytes"
        "django_memory_growth_events_total"
        "django_python_objects_total"
        "django_gc_collections_total"
        "django_memory_allocation_bytes"
    )
    
    local found_metrics=0
    for metric in "${memory_metrics[@]}"; do
        if echo "$metrics_output" | grep -q "$metric"; then
            echo "✅ Found memory metric: $metric"
            ((found_metrics++))
        else
            echo "⚠️  Missing memory metric: $metric"
        fi
    done
    
    if [[ $found_metrics -ge 3 ]]; then
        echo "✅ Memory leak detection metrics are active for $container_name ($found_metrics/5 metrics found)"
        return 0
    else
        echo "❌ Insufficient memory leak detection metrics for $container_name ($found_metrics/5 metrics found)"
        return 1
    fi
}

# Function to check environment variables
check_environment_variables() {
    local pod_name=$1
    local container_name=$2
    
    echo "🔍 Checking environment variables for $container_name in pod $pod_name..."
    
    local required_vars=(
        "ENABLE_MEMORY_PROFILING"
        "MEMORY_PROFILING_SAMPLE_RATE"
        "CONTAINER_NAME"
        "ENABLE_PROMETHEUS_METRICS"
    )
    
    for var in "${required_vars[@]}"; do
        local value
        value=$(kubectl exec -n "$NAMESPACE" "$pod_name" -c "$container_name" -- printenv "$var" 2>/dev/null || echo "NOT_SET")
        if [[ "$value" != "NOT_SET" ]]; then
            echo "✅ $var=$value"
        else
            echo "❌ Missing environment variable: $var"
        fi
    done
}

# Function to check Django middleware configuration
check_middleware_configuration() {
    local pod_name=$1
    local container_name=$2
    
    echo "🔍 Checking Django middleware configuration for $container_name..."
    
    local middleware_check
    middleware_check=$(kubectl exec -n "$NAMESPACE" "$pod_name" -c "$container_name" -- python manage.py shell -c "
from django.conf import settings
middleware = getattr(settings, 'MIDDLEWARE', [])
prometheus_before = any('PrometheusBeforeMiddleware' in m for m in middleware)
memory_profiling = any('MemoryLeakDetectionMiddleware' in m for m in middleware)
prometheus_after = any('PrometheusAfterMiddleware' in m for m in middleware)
print(f'PrometheusBeforeMiddleware: {prometheus_before}')
print(f'MemoryLeakDetectionMiddleware: {memory_profiling}')
print(f'PrometheusAfterMiddleware: {prometheus_after}')
print(f'All required middleware: {prometheus_before and memory_profiling and prometheus_after}')
" 2>/dev/null || echo "FAILED")
    
    if [[ "$middleware_check" == "FAILED" ]]; then
        echo "❌ Failed to check middleware configuration"
        return 1
    fi
    
    echo "$middleware_check"
    
    if echo "$middleware_check" | grep -q "All required middleware: True"; then
        echo "✅ All required middleware is configured"
        return 0
    else
        echo "❌ Required middleware missing or misconfigured"
        return 1
    fi
}

# Function to check health endpoints
check_health_endpoints() {
    local pod_name=$1
    local container_name=$2
    local port=$3
    
    echo "🔍 Checking health endpoint for $container_name..."
    
    local health_status
    health_status=$(kubectl exec -n "$NAMESPACE" "$pod_name" -c "$container_name" -- curl -s -o /dev/null -w "%{http_code}" "localhost:$port/healthz" || echo "000")
    
    if [[ "$health_status" == "200" ]]; then
        echo "✅ Health endpoint is responding (HTTP $health_status)"
        return 0
    else
        echo "❌ Health endpoint is not responding properly (HTTP $health_status)"
        return 1
    fi
}

# Main validation function
main() {
    echo "Starting validation..."
    
    # Wait for pods to be ready
    wait_for_pods
    
    # Get pod information
    local pods
    pods=$(kubectl get pods -n "$NAMESPACE" -l "$APP_LABEL" -o jsonpath='{.items[*].metadata.name}')
    
    if [[ -z "$pods" ]]; then
        echo "❌ No pods found with label $APP_LABEL"
        exit 1
    fi
    
    local validation_errors=0
    
    for pod_name in $pods; do
        echo
        echo "🔍 Validating pod: $pod_name"
        echo "================================"
        
        # Check backend container
        echo
        echo "Backend Container (rsr-backend):"
        check_environment_variables "$pod_name" "rsr-backend" || ((validation_errors++))
        check_middleware_configuration "$pod_name" "rsr-backend" || ((validation_errors++))
        check_health_endpoints "$pod_name" "rsr-backend" "8000" || ((validation_errors++))
        check_metrics_endpoint "$pod_name" "rsr-backend" "8000" || ((validation_errors++))
        
        # Check reports container
        echo
        echo "Reports Container (rsr-reports):"
        check_environment_variables "$pod_name" "rsr-reports" || ((validation_errors++))
        check_middleware_configuration "$pod_name" "rsr-reports" || ((validation_errors++))
        check_health_endpoints "$pod_name" "rsr-reports" "9000" || ((validation_errors++))
        check_metrics_endpoint "$pod_name" "rsr-reports" "9000" || ((validation_errors++))
        
        # Check worker container (basic checks only, no HTTP endpoints)
        echo
        echo "Worker Container (rsr-worker):"
        check_environment_variables "$pod_name" "rsr-worker" || ((validation_errors++))
        echo "ℹ️  Worker container monitoring relies on container-level metrics (middleware not applicable)"
    done
    
    echo
    echo "================================"
    if [[ $validation_errors -eq 0 ]]; then
        echo "🎉 All validations passed! Memory leak detection is properly deployed."
        exit 0
    else
        echo "❌ $validation_errors validation errors found. Please check the configuration."
        exit 1
    fi
}

# Run main function
main "$@"