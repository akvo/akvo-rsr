"""
Django app configuration for RSR memory monitoring.
"""

import logging

from django.apps import AppConfig

logger = logging.getLogger(__name__)


class MemoryMonitoringConfig(AppConfig):
    """
    App configuration for RSR memory monitoring.

    Handles initialization of Prometheus metrics and monitoring setup.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "akvo.rsr.memory_monitoring"
    verbose_name = "RSR Memory Monitoring"

    def ready(self):
        """Initialize memory monitoring when Django starts up."""
        try:
            from .prometheus_metrics import register_rsr_metrics

            # Register RSR-specific metrics
            register_rsr_metrics()

            logger.info("RSR memory monitoring initialized successfully")

        except Exception as e:
            logger.warning(f"Failed to initialize RSR memory monitoring: {e}")
