"""
Hybrid Memory Monitoring for Akvo RSR

This package provides comprehensive memory monitoring and leak detection
using a hybrid approach that combines:

- django-prometheus: Base Django metrics collection
- pympler: Memory leak detection for Python objects
- memray: Deep memory profiling for debugging
- Custom RSR metrics: RSR-specific monitoring and alerting

The system is designed to be production-safe with minimal overhead
while providing comprehensive insights into memory usage patterns.
"""

from .prometheus_metrics import (
    RSRMemoryMetrics,
    register_rsr_metrics,
)

from .middleware import (
    RSRMemoryMonitoringMiddleware,
)

__version__ = '1.0.0'
__author__ = 'Akvo RSR Team'

default_app_config = 'akvo.rsr.memory_monitoring.apps.MemoryMonitoringConfig'

__all__ = [
    'RSRMemoryMetrics',
    'register_rsr_metrics',
    'RSRMemoryMonitoringMiddleware',
]