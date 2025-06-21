"""
RSR Memory Monitoring Middleware

This middleware extends django-prometheus with RSR-specific memory monitoring
capabilities. It tracks memory usage per request and updates custom metrics.
"""

import gc
import logging
import os
import time
from typing import Optional

import psutil
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils.deprecation import MiddlewareMixin

from .prometheus_metrics import get_rsr_metrics, update_all_metrics

logger = logging.getLogger(__name__)


class RSRMemoryMonitoringMiddleware(MiddlewareMixin):
    """
    Middleware for RSR-specific memory monitoring.

    This middleware:
    1. Tracks memory usage per request
    2. Updates RSR-specific Prometheus metrics
    3. Adds memory monitoring headers to responses
    4. Periodically refreshes all metrics

    Designed to work alongside django-prometheus middleware.
    """

    def __init__(self, get_response=None):
        super().__init__(get_response)
        self.enabled = getattr(settings, "RSR_MEMORY_MONITORING_ENABLED", True)
        self.detailed_tracking = getattr(
            settings, "RSR_MEMORY_DETAILED_TRACKING", False
        )
        self.header_prefix = getattr(
            settings, "RSR_MEMORY_HEADER_PREFIX", "X-RSR-Memory"
        )
        self.metrics_update_interval = getattr(
            settings, "RSR_METRICS_UPDATE_INTERVAL", 300
        )  # 5 minutes

        self._process = psutil.Process(os.getpid())
        self._last_metrics_update = 0

        if self.enabled:
            logger.info("RSR memory monitoring middleware enabled")

    def process_request(self, request: HttpRequest) -> Optional[HttpResponse]:
        """
        Process incoming request - capture initial memory state.
        """
        if not self.enabled:
            return None

        try:
            # Record initial memory state
            memory_info = self._process.memory_info()
            request._rsr_memory_start = {
                "timestamp": time.time(),
                "rss_mb": memory_info.rss / 1024 / 1024,
                "vms_mb": memory_info.vms / 1024 / 1024,
                "objects_before": (
                    len(gc.get_objects()) if self.detailed_tracking else 0
                ),
            }

            # Periodically update all metrics
            current_time = time.time()
            if current_time - self._last_metrics_update > self.metrics_update_interval:
                update_all_metrics()
                self._last_metrics_update = current_time

        except Exception as e:
            logger.warning(f"Error in RSR memory monitoring process_request: {e}")

        return None

    def process_response(
        self, request: HttpRequest, response: HttpResponse
    ) -> HttpResponse:
        """
        Process response - calculate memory usage and update metrics.
        """
        if not self.enabled or not hasattr(request, "_rsr_memory_start"):
            return response

        try:
            # Calculate memory usage for this request
            memory_start = request._rsr_memory_start
            memory_info = self._process.memory_info()

            memory_end = {
                "timestamp": time.time(),
                "rss_mb": memory_info.rss / 1024 / 1024,
                "vms_mb": memory_info.vms / 1024 / 1024,
                "objects_after": len(gc.get_objects()) if self.detailed_tracking else 0,
            }

            # Calculate deltas
            duration = memory_end["timestamp"] - memory_start["timestamp"]
            memory_delta_rss = memory_end["rss_mb"] - memory_start["rss_mb"]
            memory_delta_vms = memory_end["vms_mb"] - memory_start["vms_mb"]
            peak_memory = max(memory_start["rss_mb"], memory_end["rss_mb"])

            # Record metrics
            get_rsr_metrics().record_request_memory(
                memory_before_mb=memory_start["rss_mb"],
                memory_after_mb=memory_end["rss_mb"],
                peak_memory_mb=peak_memory,
            )

            # Add memory headers to response
            self._add_memory_headers(
                response,
                {
                    "duration_seconds": duration,
                    "memory_delta_rss_mb": memory_delta_rss,
                    "memory_delta_vms_mb": memory_delta_vms,
                    "memory_before_mb": memory_start["rss_mb"],
                    "memory_after_mb": memory_end["rss_mb"],
                    "peak_memory_mb": peak_memory,
                    "objects_created": (
                        (memory_end["objects_after"] - memory_start["objects_before"])
                        if self.detailed_tracking
                        else None
                    ),
                },
            )

            # Check for potential memory issues
            self._check_memory_concerns(memory_delta_rss, peak_memory, request)

        except Exception as e:
            logger.warning(f"Error in RSR memory monitoring process_response: {e}")

        return response

    def _add_memory_headers(self, response: HttpResponse, memory_data: dict):
        """Add memory monitoring headers to the response"""
        try:
            # Core memory headers
            response[f"{self.header_prefix}-Duration-Seconds"] = (
                f"{memory_data['duration_seconds']:.3f}"
            )
            response[f"{self.header_prefix}-Delta-MB"] = (
                f"{memory_data['memory_delta_rss_mb']:.2f}"
            )
            response[f"{self.header_prefix}-Before-MB"] = (
                f"{memory_data['memory_before_mb']:.2f}"
            )
            response[f"{self.header_prefix}-After-MB"] = (
                f"{memory_data['memory_after_mb']:.2f}"
            )
            response[f"{self.header_prefix}-Peak-MB"] = (
                f"{memory_data['peak_memory_mb']:.2f}"
            )

            # Detailed headers if enabled
            if self.detailed_tracking:
                response[f"{self.header_prefix}-VMS-Delta-MB"] = (
                    f"{memory_data['memory_delta_vms_mb']:.2f}"
                )
                if memory_data["objects_created"] is not None:
                    response[f"{self.header_prefix}-Objects-Created"] = str(
                        memory_data["objects_created"]
                    )

            # System memory status
            system_memory = psutil.virtual_memory()
            response[f"{self.header_prefix}-System-Usage-Percent"] = (
                f"{system_memory.percent:.1f}"
            )

            # Memory monitoring status
            response[f"{self.header_prefix}-Monitoring-Enabled"] = "true"

        except Exception as e:
            logger.warning(f"Error adding memory headers: {e}")

    def _check_memory_concerns(
        self, memory_delta_mb: float, peak_memory_mb: float, request: HttpRequest
    ):
        """Check for memory usage concerns and log warnings"""
        try:
            # Check for high memory usage in single request
            high_usage_threshold = getattr(
                settings, "RSR_MEMORY_HIGH_USAGE_THRESHOLD_MB", 50.0
            )
            if memory_delta_mb > high_usage_threshold:
                logger.warning(
                    f"High memory usage detected: {memory_delta_mb:.2f}MB delta "
                    f"for {request.method} {request.path}"
                )

                # Record as potential leak if very high
                if memory_delta_mb > high_usage_threshold * 2:
                    get_rsr_metrics().record_memory_leak("request_high_usage", "high")

            # Check system memory pressure
            system_memory = psutil.virtual_memory()
            if system_memory.percent > 90:
                logger.warning(
                    f"System memory pressure: {system_memory.percent:.1f}% used"
                )

            # Check for potential memory leaks in long-running requests
            duration = getattr(request, "_rsr_memory_start", {}).get("timestamp", 0)
            if duration > 0:
                request_duration = time.time() - duration
                if (
                    request_duration > 10.0 and memory_delta_mb > 10.0
                ):  # 10+ seconds, 10+ MB
                    logger.warning(
                        f"Potential memory leak in long request: {request_duration:.1f}s, "
                        f"{memory_delta_mb:.2f}MB for {request.method} {request.path}"
                    )
                    get_rsr_metrics().record_memory_leak("long_request", "medium")

        except Exception as e:
            logger.warning(f"Error checking memory concerns: {e}")


class RSRCacheMetricsMiddleware(MiddlewareMixin):
    """
    Lightweight middleware specifically for cache metrics updates.

    This middleware focuses on updating cache-related metrics and can be used
    independently or alongside the main memory monitoring middleware.
    """

    def __init__(self, get_response=None):
        super().__init__(get_response)
        self.enabled = getattr(settings, "RSR_CACHE_METRICS_ENABLED", True)
        self.update_frequency = getattr(
            settings, "RSR_CACHE_METRICS_FREQUENCY", 60
        )  # 1 minute
        self._last_update = 0

    def process_request(self, request: HttpRequest) -> Optional[HttpResponse]:
        """Update cache metrics periodically"""
        if not self.enabled:
            return None

        try:
            current_time = time.time()
            if current_time - self._last_update > self.update_frequency:
                get_rsr_metrics().update_cache_metrics()
                get_rsr_metrics().update_deletion_tracker_metrics()
                self._last_update = current_time

        except Exception as e:
            logger.warning(f"Error updating cache metrics: {e}")

        return None


def get_current_memory_usage() -> dict:
    """
    Utility function to get current memory usage information.

    Returns:
        dict: Memory usage information including RSS, VMS, and system memory
    """
    try:
        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()
        system_memory = psutil.virtual_memory()

        return {
            "process_rss_mb": memory_info.rss / 1024 / 1024,
            "process_vms_mb": memory_info.vms / 1024 / 1024,
            "system_total_mb": system_memory.total / 1024 / 1024,
            "system_available_mb": system_memory.available / 1024 / 1024,
            "system_used_percent": system_memory.percent,
            "objects_count": len(gc.get_objects()),
        }

    except Exception as e:
        logger.warning(f"Error getting memory usage: {e}")
        return {}


def force_metrics_update():
    """
    Force an immediate update of all RSR metrics.

    Useful for management commands or when immediate metrics refresh is needed.
    """
    try:
        update_all_metrics()
        logger.info("RSR metrics forcefully updated")
    except Exception as e:
        logger.error(f"Error forcing metrics update: {e}")
        raise
