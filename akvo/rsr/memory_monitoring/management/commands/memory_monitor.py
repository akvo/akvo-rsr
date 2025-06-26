"""
Management command for RSR memory monitoring operations.
"""

import logging
import time

from django.conf import settings
from django.core.management.base import BaseCommand

from akvo.rsr.memory_monitoring.middleware import (
    force_metrics_update,
    get_current_memory_usage,
)

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """
    Management command for RSR memory monitoring.

    Provides utilities for:
    - Manual metrics updates
    - Memory usage reporting
    - Monitoring system status checks
    """

    help = "RSR memory monitoring utilities"

    def add_arguments(self, parser):
        parser.add_argument(
            "--update-metrics",
            action="store_true",
            help="Force update all memory metrics",
        )
        parser.add_argument(
            "--show-usage",
            action="store_true",
            help="Display current memory usage",
        )
        parser.add_argument(
            "--monitor",
            type=int,
            metavar="SECONDS",
            help="Continuously monitor memory for specified seconds",
        )
        parser.add_argument(
            "--check-config",
            action="store_true",
            help="Check memory monitoring configuration",
        )

    def handle(self, *args, **options):
        """Execute the requested memory monitoring operation."""

        if options["check_config"]:
            self.check_configuration()

        if options["show_usage"]:
            self.show_memory_usage()

        if options["update_metrics"]:
            self.update_metrics()

        if options["monitor"]:
            self.continuous_monitor(options["monitor"])

    def check_configuration(self):
        """Check and display memory monitoring configuration."""
        self.stdout.write(self.style.SUCCESS("RSR Memory Monitoring Configuration:"))

        config_items = [
            (
                "RSR_MEMORY_MONITORING_ENABLED",
                getattr(settings, "RSR_MEMORY_MONITORING_ENABLED", False),
            ),
            (
                "RSR_MEMORY_DETAILED_TRACKING",
                getattr(settings, "RSR_MEMORY_DETAILED_TRACKING", False),
            ),
            (
                "RSR_MEMORY_HEADER_PREFIX",
                getattr(settings, "RSR_MEMORY_HEADER_PREFIX", "X-RSR-Memory"),
            ),
            (
                "RSR_METRICS_UPDATE_INTERVAL",
                getattr(settings, "RSR_METRICS_UPDATE_INTERVAL", 300),
            ),
            (
                "RSR_MEMORY_HIGH_USAGE_THRESHOLD_MB",
                getattr(settings, "RSR_MEMORY_HIGH_USAGE_THRESHOLD_MB", 50.0),
            ),
            (
                "RSR_CACHE_METRICS_ENABLED",
                getattr(settings, "RSR_CACHE_METRICS_ENABLED", True),
            ),
        ]

        for name, value in config_items:
            self.stdout.write(f"  {name}: {value}")

        # Check middleware installation
        middleware = getattr(settings, "MIDDLEWARE", [])
        prometheus_middleware = [m for m in middleware if "prometheus" in m.lower()]
        rsr_middleware = [m for m in middleware if "memory_monitoring" in m]

        self.stdout.write("\nMiddleware Status:")
        self.stdout.write(
            f"  Prometheus middleware: {len(prometheus_middleware)} installed"
        )
        for m in prometheus_middleware:
            self.stdout.write(f"    - {m}")

        self.stdout.write(f"  RSR memory middleware: {len(rsr_middleware)} installed")
        for m in rsr_middleware:
            self.stdout.write(f"    - {m}")

    def show_memory_usage(self):
        """Display current memory usage information."""
        self.stdout.write(self.style.SUCCESS("Current Memory Usage:"))

        memory_info = get_current_memory_usage()

        if memory_info:
            self.stdout.write(
                f"  Process RSS: {memory_info.get('process_rss_mb', 0):.2f} MB"
            )
            self.stdout.write(
                f"  Process VMS: {memory_info.get('process_vms_mb', 0):.2f} MB"
            )
            self.stdout.write(
                f"  System Total: {memory_info.get('system_total_mb', 0):.2f} MB"
            )
            self.stdout.write(
                f"  System Available: {memory_info.get('system_available_mb', 0):.2f} MB"
            )
            self.stdout.write(
                f"  System Usage: {memory_info.get('system_used_percent', 0):.1f}%"
            )
            self.stdout.write(
                f"  Python Objects: {memory_info.get('objects_count', 0):,}"
            )
        else:
            self.stdout.write(self.style.ERROR("Failed to retrieve memory information"))

    def update_metrics(self):
        """Force update all memory metrics."""
        self.stdout.write("Updating memory metrics...")

        try:
            force_metrics_update()
            self.stdout.write(self.style.SUCCESS("Memory metrics updated successfully"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to update metrics: {e}"))

    def continuous_monitor(self, duration_seconds):
        """Continuously monitor memory for specified duration."""
        self.stdout.write(f"Monitoring memory for {duration_seconds} seconds...")

        start_time = time.time()
        end_time = start_time + duration_seconds
        interval = min(
            10, duration_seconds // 10
        )  # Update every 10 seconds or 1/10th of duration

        try:
            while time.time() < end_time:
                current_time = time.time()
                elapsed = current_time - start_time

                memory_info = get_current_memory_usage()
                if memory_info:
                    self.stdout.write(
                        f"[{elapsed:6.1f}s] RSS: {memory_info.get('process_rss_mb', 0):6.2f}MB, "
                        f"System: {memory_info.get('system_used_percent', 0):5.1f}%, "
                        f"Objects: {memory_info.get('objects_count', 0):,}"
                    )

                time.sleep(interval)

        except KeyboardInterrupt:
            self.stdout.write("\nMonitoring interrupted by user")

        self.stdout.write(self.style.SUCCESS("Monitoring completed"))
