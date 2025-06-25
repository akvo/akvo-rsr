"""
Custom Prometheus metrics for RSR-specific memory monitoring.

This module defines Prometheus metrics specific to Akvo RSR's memory usage patterns,
including project model instances, cache usage, and deletion tracking.
"""

import gc
import logging
import os
from collections import defaultdict
from typing import Dict

import psutil
from django.conf import settings
from prometheus_client import Counter, Gauge, Histogram, Info

logger = logging.getLogger(__name__)


class RSRMemoryMetrics:
    """
    Container for all RSR-specific Prometheus metrics.

    Provides centralized management of custom metrics that extend
    the base django-prometheus functionality.
    """

    def __init__(self):
        self._setup_metrics()
        self._process = psutil.Process(os.getpid())

    def _setup_metrics(self):
        """Initialize all RSR-specific Prometheus metrics"""

        # Memory usage metrics
        self.memory_usage_mb = Gauge(
            "rsr_memory_usage_mb", "Current memory usage in MB", ["memory_type"]
        )

        self.memory_growth_rate = Gauge(
            "rsr_memory_growth_rate_mb_per_hour", "Memory growth rate in MB per hour"
        )

        # Django model instance metrics
        self.model_instance_count = Gauge(
            "rsr_model_instance_count",
            "Number of Django model instances in memory",
            ["model_name"],
        )

        # Cache metrics (extending existing cache_management)
        self.cache_memory_usage = Gauge(
            "rsr_cache_memory_mb", "Memory used by RSR TTL caches in MB", ["cache_name"]
        )

        self.cache_utilization_percent = Gauge(
            "rsr_cache_utilization_percent",
            "Cache utilization percentage",
            ["cache_name"],
        )

        # Project deletion tracker metrics
        self.deletion_tracker_size = Gauge(
            "rsr_deletion_tracker_size",
            "Number of projects currently being tracked for deletion",
        )

        self.deletion_tracker_cleanup_count = Counter(
            "rsr_deletion_tracker_cleanup_total",
            "Total number of deletion tracker cleanup operations",
        )

        # Request-level memory metrics
        self.request_memory_delta = Histogram(
            "rsr_request_memory_delta_mb",
            "Memory change during request processing in MB",
            buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 25.0, 50.0, 100.0],
        )

        self.request_memory_peak = Histogram(
            "rsr_request_memory_peak_mb",
            "Peak memory usage during request in MB",
            buckets=[10, 25, 50, 100, 250, 500, 1000, 2000],
        )

        # Memory leak detection metrics
        self.memory_leak_detected = Counter(
            "rsr_memory_leak_detected_total",
            "Number of memory leaks detected",
            ["object_type", "severity"],
        )

        self.object_growth_rate = Gauge(
            "rsr_object_growth_rate_per_hour",
            "Object creation rate per hour",
            ["object_type"],
        )

        # System memory metrics
        self.system_memory_available_mb = Gauge(
            "rsr_system_memory_available_mb", "Available system memory in MB"
        )

        self.system_memory_usage_percent = Gauge(
            "rsr_system_memory_usage_percent", "System memory usage percentage"
        )

        # RSR-specific operational metrics
        self.project_hierarchy_depth = Histogram(
            "rsr_project_hierarchy_depth",
            "Depth of project hierarchies being processed",
            buckets=[1, 2, 3, 4, 5, 10, 15, 20, 50],
        )

        self.aggregation_memory_usage = Histogram(
            "rsr_aggregation_memory_mb",
            "Memory usage during aggregation operations",
            buckets=[1, 5, 10, 25, 50, 100, 250],
        )

        # Info metric for monitoring configuration
        self.monitoring_info = Info(
            "rsr_memory_monitoring_info",
            "Information about RSR memory monitoring configuration",
        )

        # Set monitoring configuration info
        self.monitoring_info.info(
            {
                "django_prometheus_enabled": str(
                    getattr(settings, "PROMETHEUS_METRICS_ENABLED", False)
                ),
                "cache_ttl_default": str(getattr(settings, "RSR_CACHE_TTL", 3600)),
                "cache_max_size_default": str(
                    getattr(settings, "RSR_CACHE_MAX_SIZE", 1000)
                ),
                "memory_monitoring_version": "1.0.0",
            }
        )

    def update_memory_metrics(self):
        """Update current memory usage metrics"""
        try:
            # Process memory usage
            memory_info = self._process.memory_info()
            self.memory_usage_mb.labels(memory_type="rss").set(
                memory_info.rss / 1024 / 1024
            )
            self.memory_usage_mb.labels(memory_type="vms").set(
                memory_info.vms / 1024 / 1024
            )

            # System memory
            system_memory = psutil.virtual_memory()
            self.system_memory_available_mb.set(system_memory.available / 1024 / 1024)
            self.system_memory_usage_percent.set(system_memory.percent)

        except Exception as e:
            logger.warning(f"Error updating memory metrics: {e}")

    def update_model_instance_metrics(self):
        """Update Django model instance count metrics"""
        try:
            model_counts = self._count_model_instances()

            for model_name, count in model_counts.items():
                self.model_instance_count.labels(model_name=model_name).set(count)

        except Exception as e:
            logger.warning(f"Error updating model instance metrics: {e}")

    def update_cache_metrics(self):
        """Update TTL cache metrics from cache_management system"""
        try:
            from akvo.rsr.cache_management import cache_manager

            # Get global cache statistics
            cache_stats = cache_manager.get_global_stats()

            for cache_name, stats in cache_stats.items():
                if cache_name == "_global":
                    continue

                # Estimate memory usage (rough calculation)
                estimated_memory_mb = stats.get("size", 0) * 0.001  # Rough estimate
                self.cache_memory_usage.labels(cache_name=cache_name).set(
                    estimated_memory_mb
                )

                # Cache utilization
                utilization = stats.get("utilization_percent", 0)
                self.cache_utilization_percent.labels(cache_name=cache_name).set(
                    utilization
                )

        except Exception as e:
            logger.warning(f"Error updating cache metrics: {e}")

    def update_deletion_tracker_metrics(self):
        """Update project deletion tracker metrics"""
        try:
            from akvo.rsr.models.project import DELETION_SET

            # Get current deletion tracker size
            with DELETION_SET._lock:
                tracker_size = len(DELETION_SET._deletion_set)
                self.deletion_tracker_size.set(tracker_size)

        except Exception as e:
            logger.warning(f"Error updating deletion tracker metrics: {e}")

    def record_request_memory(
        self, memory_before_mb: float, memory_after_mb: float, peak_memory_mb: float
    ):
        """Record memory usage for a request"""
        try:
            memory_delta = memory_after_mb - memory_before_mb
            self.request_memory_delta.observe(memory_delta)
            self.request_memory_peak.observe(peak_memory_mb)

        except Exception as e:
            logger.warning(f"Error recording request memory metrics: {e}")

    def record_memory_leak(self, object_type: str, severity: str = "medium"):
        """Record a detected memory leak"""
        try:
            self.memory_leak_detected.labels(
                object_type=object_type, severity=severity
            ).inc()

        except Exception as e:
            logger.warning(f"Error recording memory leak metric: {e}")

    def record_project_hierarchy_depth(self, depth: int):
        """Record project hierarchy depth being processed"""
        try:
            self.project_hierarchy_depth.observe(depth)
        except Exception as e:
            logger.warning(f"Error recording hierarchy depth metric: {e}")

    def record_aggregation_memory(self, memory_mb: float):
        """Record memory usage during aggregation operations"""
        try:
            self.aggregation_memory_usage.observe(memory_mb)
        except Exception as e:
            logger.warning(f"Error recording aggregation memory metric: {e}")

    def _count_model_instances(self) -> Dict[str, int]:
        """Count Django model instances currently in memory"""
        model_counts = defaultdict(int)

        try:
            # Get all objects in memory
            all_objects = gc.get_objects()

            # Count Django model instances
            for obj in all_objects:
                if hasattr(obj, "_meta") and hasattr(obj._meta, "app_label"):
                    # Focus on RSR models
                    if obj._meta.app_label == "rsr":
                        model_name = obj._meta.model_name
                        model_counts[model_name] += 1

        except Exception as e:
            logger.warning(f"Error counting model instances: {e}")

        return dict(model_counts)


# Global metrics instance (initialized lazily)
rsr_metrics = None


def get_rsr_metrics():
    """Get or create the global RSR metrics instance."""
    global rsr_metrics
    if rsr_metrics is None:
        rsr_metrics = RSRMemoryMetrics()
    return rsr_metrics


def register_rsr_metrics():
    """
    Register RSR metrics with the Prometheus registry.

    This function should be called during Django startup to ensure
    all custom metrics are available.
    """
    logger.info("RSR memory monitoring metrics registered")
    return get_rsr_metrics()


def update_all_metrics():
    """
    Update all RSR metrics with current values.

    This function can be called periodically to refresh metrics
    or triggered by specific events.
    """
    metrics = get_rsr_metrics()
    metrics.update_memory_metrics()
    metrics.update_model_instance_metrics()
    metrics.update_cache_metrics()
    metrics.update_deletion_tracker_metrics()


# Convenience functions for external use
def record_request_memory(
    memory_before_mb: float, memory_after_mb: float, peak_memory_mb: float
):
    """Record memory usage for a request"""
    get_rsr_metrics().record_request_memory(memory_before_mb, memory_after_mb, peak_memory_mb)


def record_memory_leak(object_type: str, severity: str = "medium"):
    """Record a detected memory leak"""
    get_rsr_metrics().record_memory_leak(object_type, severity)


def record_hierarchy_depth(depth: int):
    """Record project hierarchy depth"""
    get_rsr_metrics().record_project_hierarchy_depth(depth)


def record_aggregation_memory(memory_mb: float):
    """Record aggregation memory usage"""
    get_rsr_metrics().record_aggregation_memory(memory_mb)
