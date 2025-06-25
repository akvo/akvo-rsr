"""
Enhanced Memory Leak Detection using pympler

This module provides Django-specific memory leak detection capabilities
using pympler's tracking and analysis features, specifically designed for
RSR's memory usage patterns.
"""

import gc
import logging
import time
from collections import defaultdict, deque
from typing import Any, Dict

from django.conf import settings
from pympler import muppy, summary, tracker
from pympler.classtracker import ClassTracker

from .prometheus_metrics import get_rsr_metrics

logger = logging.getLogger(__name__)


class RSRLeakDetector:
    """
    Enhanced memory leak detector for RSR applications.

    Uses pympler to track Django model instances, request objects,
    and other RSR-specific memory patterns that could indicate leaks.
    """

    def __init__(self):
        # Initialize immediately - settings checks are dynamic
        self._initialize_components()

    def _is_enabled(self) -> bool:
        """Check if leak detection is enabled via Django settings."""
        return getattr(settings, 'RSR_LEAK_DETECTION_ENABLED', True)

    def _initialize_components(self):
        """Initialize leak detection components."""
        # Always initialize basic attributes for test compatibility
        self.enabled = self._is_enabled()
        self.check_interval = getattr(settings, 'RSR_LEAK_CHECK_INTERVAL', 300)  # 5 minutes
        self.growth_threshold = getattr(settings, 'RSR_LEAK_GROWTH_THRESHOLD', 1.5)  # 50% growth
        self.memory_threshold_mb = getattr(settings, 'RSR_LEAK_MEMORY_THRESHOLD_MB', 100.0)

        # Always initialize data structures for test compatibility
        self.memory_history = deque(maxlen=50)  # Keep last 50 measurements
        self.model_count_history = defaultdict(lambda: deque(maxlen=20))
        self._last_check = 0

        if self.enabled:
            # Initialize tracking components only if enabled
            self.tracker = tracker.SummaryTracker()
            self.class_tracker = ClassTracker()

            # Track RSR-specific model classes
            self._setup_model_tracking()

            logger.info("RSR leak detector initialized with pympler tracking")
        else:
            # Initialize minimal tracking components for tests
            self.tracker = None
            self.class_tracker = ClassTracker()  # Still create for tests
            logger.info("RSR leak detector disabled via settings")

        self._initialized = True

    def _setup_model_tracking(self):
        """Set up tracking for critical RSR model classes."""
        try:
            # Import RSR models for tracking
            from akvo.rsr.models import (Indicator, IndicatorPeriod,
                                         IndicatorPeriodData, Organisation,
                                         Project, Result, User)

            # Track critical RSR models that tend to accumulate
            critical_models = [
                Project, Organisation, Result, Indicator,
                IndicatorPeriod, IndicatorPeriodData, User
            ]

            for model_class in critical_models:
                self.class_tracker.track_class(model_class)
                logger.debug(f"Tracking RSR model: {model_class.__name__}")

        except Exception as e:
            logger.warning(f"Error setting up model tracking: {e}")

    def check_for_leaks(self) -> Dict[str, Any]:
        """
        Perform comprehensive leak detection check.

        Returns:
            dict: Detection results with leak indicators and recommendations
        """
        # Components already initialized in __init__

        if not self.enabled:
            return {'enabled': False, 'reason': 'disabled_via_settings'}

        current_time = time.time()
        if current_time - self._last_check < self.check_interval:
            return {'skipped': True, 'reason': 'interval_not_reached'}

        try:
            logger.debug("Starting RSR memory leak detection check")

            results = {
                'timestamp': current_time,
                'memory_analysis': self._analyze_memory_growth(),
                'model_analysis': self._analyze_model_instances(),
                'object_analysis': self._analyze_object_growth(),
                'leak_indicators': [],
                'recommendations': []
            }

            # Detect potential leaks based on analysis
            self._detect_leaks(results)

            # Update metrics with findings
            self._update_metrics(results)

            self._last_check = current_time

            if results['leak_indicators']:
                logger.warning(f"Memory leak indicators detected: {len(results['leak_indicators'])}")

            return results

        except Exception as e:
            logger.error(f"Error during leak detection: {e}")
            return {'error': str(e), 'timestamp': current_time}

    def _analyze_memory_growth(self) -> Dict[str, Any]:
        """Analyze overall memory growth patterns."""
        try:
            import os

            import psutil

            process = psutil.Process(os.getpid())
            memory_info = process.memory_info()
            current_memory_mb = memory_info.rss / 1024 / 1024

            # Record current memory
            self.memory_history.append({
                'timestamp': time.time(),
                'memory_mb': current_memory_mb,
                'vms_mb': memory_info.vms / 1024 / 1024
            })

            analysis = {
                'current_memory_mb': current_memory_mb,
                'growth_rate': 0.0,
                'trend': 'stable'
            }

            # Calculate growth rate if we have history
            if len(self.memory_history) >= 2:
                old_memory = self.memory_history[0]['memory_mb']
                new_memory = self.memory_history[-1]['memory_mb']

                if old_memory > 0:
                    growth_rate = (new_memory - old_memory) / old_memory
                    analysis['growth_rate'] = growth_rate

                    if growth_rate > 0.1:  # 10% growth
                        analysis['trend'] = 'growing'
                    elif growth_rate < -0.1:  # 10% decrease
                        analysis['trend'] = 'decreasing'

            return analysis

        except Exception as e:
            logger.warning(f"Error analyzing memory growth: {e}")
            return {'error': str(e)}

    def _analyze_model_instances(self) -> Dict[str, Any]:
        """Analyze RSR model instance counts and growth."""
        try:
            # Use garbage collector to count model instances
            model_counts = {}

            # Get all objects and count RSR models
            all_objects = gc.get_objects()
            for obj in all_objects:
                try:
                    # Skip problematic object types that cause ASN.1 errors
                    obj_type = type(obj).__name__
                    if any(skip_type in obj_type.lower() for skip_type in ['asn1', 'schema', 'certificate', 'cryptography']):
                        continue

                    if (hasattr(obj, '_meta')
                            and hasattr(obj._meta, 'app_label')
                            and hasattr(obj._meta, 'model_name')):
                        if obj._meta.app_label == 'rsr':
                            model_name = obj._meta.model_name
                            model_counts[model_name] = model_counts.get(model_name, 0) + 1
                except (AttributeError, TypeError, ValueError):
                    # Skip objects that don't have proper Django model metadata
                    continue

            # Track historical counts for growth analysis
            current_time = time.time()
            for model_name, count in model_counts.items():
                self.model_count_history[model_name].append({
                    'timestamp': current_time,
                    'count': count
                })

            # Analyze growth patterns
            growth_analysis = {}
            for model_name, history in self.model_count_history.items():
                if len(history) >= 2:
                    old_count = history[0]['count']
                    new_count = history[-1]['count']

                    if old_count > 0:
                        growth_rate = (new_count - old_count) / old_count
                        growth_analysis[model_name] = {
                            'count': new_count,
                            'growth_rate': growth_rate,
                            'trend': 'growing' if growth_rate > 0.2 else 'stable'
                        }
                    else:
                        growth_analysis[model_name] = {
                            'count': new_count,
                            'growth_rate': 0.0,
                            'trend': 'stable'
                        }

            return {
                'current_counts': model_counts,
                'growth_analysis': growth_analysis
            }

        except Exception as e:
            logger.warning(f"Error analyzing model instances: {e}")
            return {'error': str(e)}

    def _analyze_object_growth(self) -> Dict[str, Any]:
        """Analyze general Python object growth using pympler."""
        try:
            # Get summary of all objects
            all_objects = muppy.get_objects()

            # Filter out problematic objects that cause ASN.1 schema errors
            filtered_objects = []
            for obj in all_objects:
                try:
                    # Skip objects that cause ASN.1 schema errors
                    obj_type = type(obj).__name__
                    if any(skip_type in obj_type.lower() for skip_type in ['asn1', 'schema', 'certificate', 'cryptography']):
                        continue
                    # Test if object can be safely analyzed
                    str(type(obj))  # This will fail for problematic objects
                    filtered_objects.append(obj)
                except (AttributeError, TypeError, ValueError):
                    # Skip objects that can't be safely analyzed
                    continue

            object_summary = summary.summarize(filtered_objects)

            # Focus on largest object types
            top_objects = object_summary[:10]  # Top 10 object types

            analysis = {
                'total_objects': len(filtered_objects),
                'top_object_types': []
            }

            for obj_summary in top_objects:
                # obj_summary format: [type, count, total_size]
                obj_type = str(obj_summary[0]) if obj_summary[0] else 'Unknown'
                count = obj_summary[1]
                size_bytes = obj_summary[2]

                analysis['top_object_types'].append({
                    'type': obj_type,
                    'count': count,
                    'size_mb': size_bytes / 1024 / 1024,
                    'avg_size_bytes': size_bytes / count if count > 0 else 0
                })

            return analysis

        except Exception as e:
            logger.warning(f"Error analyzing object growth: {e}")
            return {'error': str(e)}

    def _detect_leaks(self, results: Dict[str, Any]):
        """Detect potential memory leaks based on analysis results."""
        leak_indicators = []
        recommendations = []

        # Check memory growth
        memory_analysis = results.get('memory_analysis', {})
        if memory_analysis.get('growth_rate', 0) > self.growth_threshold:
            leak_indicators.append({
                'type': 'memory_growth',
                'severity': 'high',
                'description': f"Memory growth rate {memory_analysis['growth_rate']:.2%} exceeds threshold",
                'value': memory_analysis['growth_rate']
            })
            recommendations.append("Monitor memory usage patterns and check for unreleased objects")

        # Check model instance growth
        model_analysis = results.get('model_analysis', {})
        growth_analysis = model_analysis.get('growth_analysis', {})

        for model_name, growth_data in growth_analysis.items():
            if growth_data['growth_rate'] > 1.0:  # 100% growth
                leak_indicators.append({
                    'type': 'model_instance_growth',
                    'severity': 'medium',
                    'description': f"{model_name} instances grew by {growth_data['growth_rate']:.2%}",
                    'model': model_name,
                    'value': growth_data['growth_rate']
                })
                recommendations.append(f"Review {model_name} model usage and ensure proper cleanup")

        # Check absolute memory threshold
        current_memory = memory_analysis.get('current_memory_mb', 0)
        if current_memory > self.memory_threshold_mb:
            leak_indicators.append({
                'type': 'high_memory_usage',
                'severity': 'medium',
                'description': f"Memory usage {current_memory:.1f}MB exceeds threshold {self.memory_threshold_mb}MB",
                'value': current_memory
            })
            recommendations.append("Consider memory optimization and garbage collection")

        # Check for Django-specific patterns
        object_analysis = results.get('object_analysis', {})
        top_objects = object_analysis.get('top_object_types', [])

        for obj_data in top_objects[:3]:  # Check top 3 object types
            if obj_data['size_mb'] > 50:  # Objects using >50MB
                leak_indicators.append({
                    'type': 'large_object_type',
                    'severity': 'low',
                    'description': f"Object type '{obj_data['type']}' using {obj_data['size_mb']:.1f}MB",
                    'object_type': obj_data['type'],
                    'value': obj_data['size_mb']
                })

        results['leak_indicators'] = leak_indicators
        results['recommendations'] = recommendations

    def _update_metrics(self, results: Dict[str, Any]):
        """Update Prometheus metrics with leak detection results."""
        try:
            metrics = get_rsr_metrics()

            # Record leak indicators
            for indicator in results.get('leak_indicators', []):
                metrics.record_memory_leak(
                    object_type=indicator['type'],
                    severity=indicator['severity']
                )

            # Update object growth rates
            object_analysis = results.get('object_analysis', {})
            if 'total_objects' in object_analysis:
                metrics.object_growth_rate.labels(object_type='total').set(
                    object_analysis['total_objects']
                )

            # Update model instance counts
            model_analysis = results.get('model_analysis', {})
            current_counts = model_analysis.get('current_counts', {})
            for model_name, count in current_counts.items():
                metrics.model_instance_count.labels(model_name=model_name).set(count)

        except Exception as e:
            logger.warning(f"Error updating leak detection metrics: {e}")

    def get_memory_summary(self) -> Dict[str, Any]:
        """Get current memory usage summary for debugging."""
        # Components already initialized in __init__

        if not self.enabled:
            return {'enabled': False, 'reason': 'disabled_via_settings'}

        try:
            all_objects = muppy.get_objects()
            object_summary = summary.summarize(all_objects)

            return {
                'total_objects': len(all_objects),
                'summary': summary.format_(object_summary[:10]),
                'tracker_stats': self._format_tracker_stats()
            }

        except Exception as e:
            logger.warning(f"Error getting memory summary: {e}")
            return {'error': str(e)}

    def reset_tracking(self):
        """Reset all tracking data (useful for testing)."""
        try:
            # Components already initialized in __init__

            if self.enabled and hasattr(self, 'memory_history'):
                self.memory_history.clear()
                self.model_count_history.clear()
                self.class_tracker.clear()
                self._last_check = 0
                logger.info("RSR leak detector tracking data reset")
            else:
                logger.info("RSR leak detector reset skipped (disabled via settings)")

        except Exception as e:
            logger.warning(f"Error resetting leak detector: {e}")

    def _format_tracker_stats(self) -> Dict[str, Any]:
        """Format class tracker stats for serialization."""
        try:
            # Check if class tracker is available (only when enabled)
            if not hasattr(self, 'class_tracker') or not self.enabled:
                return {'message': 'tracking_disabled'}

            formatted_stats = {}
            for tracked_class, stats in self.class_tracker.stats.items():
                class_name = getattr(tracked_class, '__name__', str(tracked_class))
                if hasattr(stats, 'n'):
                    formatted_stats[class_name] = {'count': stats.n}
                else:
                    formatted_stats[class_name] = {'count': 0}
            return formatted_stats
        except Exception as e:
            logger.warning(f"Error formatting tracker stats: {e}")
            return {}


# Global leak detector instance
_leak_detector = None


def get_leak_detector() -> RSRLeakDetector:
    """Get or create the global leak detector instance."""
    global _leak_detector
    if _leak_detector is None:
        _leak_detector = RSRLeakDetector()
    return _leak_detector


def check_for_memory_leaks() -> Dict[str, Any]:
    """Convenience function to check for memory leaks."""
    return get_leak_detector().check_for_leaks()


def get_memory_summary() -> Dict[str, Any]:
    """Convenience function to get memory summary."""
    return get_leak_detector().get_memory_summary()
