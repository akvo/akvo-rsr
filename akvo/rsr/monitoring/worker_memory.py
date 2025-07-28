# -*- coding: utf-8 -*-
"""
Worker memory monitoring for Django-Q background processes.

This module provides memory monitoring capabilities for worker containers
that don't have HTTP request/response cycles. It can be used by:
1. Django-Q probe system (HTTP metrics endpoint)
2. Task wrappers (pre/post task measurement)
3. Background monitoring threads (periodic sampling)
"""

import gc
import os
import psutil
import tracemalloc
import threading
import time
from django.conf import settings
from prometheus_client import Gauge, Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST


class WorkerMemoryMonitor:
    """
    Memory monitoring class specifically designed for worker containers.

    Provides the same memory leak detection capabilities as the middleware
    but adapted for background processes and periodic sampling.
    """

    # Class-level metrics to avoid duplicate registration
    _metrics_initialized = False
    _memory_usage_gauge = None
    _memory_growth_counter = None
    _object_count_gauge = None
    _gc_collections_counter = None
    _memory_allocation_histogram = None
    _worker_task_memory_gauge = None
    _worker_task_counter = None

    # Thread-safe lock for metric updates
    _metrics_lock = threading.Lock()

    def __init__(self, container_name=None):
        """Initialize worker memory monitor."""
        self.enabled = getattr(settings, 'ENABLE_MEMORY_PROFILING', True)

        if not self.enabled:
            return

        # Initialize psutil process
        self.process = psutil.Process()

        # Get container name and settings
        self.container_name = container_name or os.environ.get('CONTAINER_NAME', 'rsr-worker')
        self.sample_rate = getattr(settings, 'MEMORY_PROFILING_SAMPLE_RATE', 1.0)
        self.growth_threshold_mb = getattr(settings, 'MEMORY_GROWTH_THRESHOLD_MB', 10)

        # Initialize metrics (thread-safe)
        self._init_metrics()

        # Initialize tracemalloc if not already started
        if not tracemalloc.is_tracing():
            tracemalloc.start()

        # Store baseline memory for growth detection
        self._baseline_memory = self._get_current_memory()
        self._last_gc_stats = self._get_gc_stats()

    @classmethod
    def _init_metrics(cls):
        """Initialize Prometheus metrics for worker memory monitoring (thread-safe)."""
        with cls._metrics_lock:
            if cls._metrics_initialized:
                return

            # Reuse existing metrics from middleware for consistency
            cls._memory_usage_gauge = Gauge(
                'memory_usage_bytes',
                'Current memory usage in bytes',
                ['container', 'component'],
                namespace='django'
            )

            cls._memory_growth_counter = Counter(
                'memory_growth_events_total',
                'Number of memory growth events detected',
                ['container', 'threshold'],
                namespace='django'
            )

            cls._object_count_gauge = Gauge(
                'python_objects_total',
                'Number of Python objects in memory',
                ['container', 'object_type'],
                namespace='django'
            )

            cls._gc_collections_counter = Counter(
                'gc_collections_total',
                'Number of garbage collection runs',
                ['container', 'generation'],
                namespace='django'
            )

            cls._memory_allocation_histogram = Histogram(
                'allocation_bytes',
                'Memory allocation size distribution',
                ['container', 'component'],
                namespace='django',
                buckets=(1024, 10 * 1024, 100 * 1024, 1024 * 1024, 10 * 1024 * 1024, 100 * 1024 * 1024, float('inf'))
            )

            # Worker-specific metrics
            cls._worker_task_memory_gauge = Gauge(
                'worker_task_memory_bytes',
                'Memory usage during task execution',
                ['container', 'task_name', 'phase'],
                namespace='django'
            )

            cls._worker_task_counter = Counter(
                'worker_tasks_total',
                'Number of worker tasks processed',
                ['container', 'task_name', 'status'],
                namespace='django'
            )

            cls._metrics_initialized = True

    def collect_memory_metrics(self):
        """
        Collect comprehensive memory metrics for the worker process.

        Returns:
            dict: Dictionary containing memory metrics
        """
        if not self.enabled:
            return {}

        try:
            # Current memory usage
            memory_info = self.process.memory_info()
            current_memory = memory_info.rss

            # Memory growth since baseline
            memory_growth = current_memory - self._baseline_memory

            # Update metrics
            self._update_memory_metrics(current_memory, memory_growth)
            self._check_memory_growth(memory_growth)
            self._update_object_counts()
            self._update_gc_metrics()

            # Return metrics summary
            return {
                'memory_usage_bytes': current_memory,
                'memory_growth_bytes': memory_growth,
                'memory_usage_mb': current_memory / (1024 * 1024),
                'memory_growth_mb': memory_growth / (1024 * 1024),
                'container_name': self.container_name,
                'metrics_collected': True
            }

        except Exception as e:
            # Don't let metric collection break the worker
            return {
                'error': str(e),
                'metrics_collected': False
            }

    def measure_task_memory(self, task_name, phase='execution'):
        """
        Measure memory usage for a specific task.

        Args:
            task_name (str): Name of the task being measured
            phase (str): Phase of task execution ('start', 'end', 'execution')

        Returns:
            dict: Memory measurement data
        """
        if not self.enabled:
            return {}

        try:
            current_memory = self._get_current_memory()

            # Update task-specific metrics
            self._worker_task_memory_gauge.labels(
                container=self.container_name,
                task_name=task_name,
                phase=phase
            ).set(current_memory)

            return {
                'task_name': task_name,
                'phase': phase,
                'memory_bytes': current_memory,
                'memory_mb': current_memory / (1024 * 1024),
                'container_name': self.container_name
            }

        except Exception as e:
            return {
                'error': str(e),
                'task_name': task_name,
                'phase': phase
            }

    def record_task_completion(self, task_name, status='success'):
        """
        Record task completion for monitoring.

        Args:
            task_name (str): Name of the completed task
            status (str): Task completion status ('success', 'failure', 'timeout')
        """
        if not self.enabled:
            return

        try:
            self._worker_task_counter.labels(
                container=self.container_name,
                task_name=task_name,
                status=status
            ).inc()
        except Exception:
            # Don't let metric recording break the task
            pass

    def export_prometheus_metrics(self):
        """
        Export all metrics in Prometheus format.

        Returns:
            str: Prometheus-formatted metrics
        """
        if not self.enabled:
            return "# Memory profiling disabled\n"

        try:
            # Collect current metrics
            self.collect_memory_metrics()

            # Generate Prometheus output
            return generate_latest()
        except Exception as e:
            return f"# Error generating metrics: {str(e)}\n"

    def get_metrics_content_type(self):
        """Get the content type for Prometheus metrics."""
        return CONTENT_TYPE_LATEST

    def _get_current_memory(self):
        """Get current memory usage in bytes."""
        try:
            return self.process.memory_info().rss
        except Exception:
            return 0

    def _get_gc_stats(self):
        """Get current garbage collection statistics."""
        try:
            return gc.get_stats()
        except Exception:
            return []

    def _update_memory_metrics(self, current_memory, memory_growth):
        """Update memory-related metrics."""
        try:
            # Update memory usage gauge
            self._memory_usage_gauge.labels(
                container=self.container_name,
                component='worker'
            ).set(current_memory)

            # Record memory allocation in histogram
            if memory_growth > 0:
                self._memory_allocation_histogram.labels(
                    container=self.container_name,
                    component='worker'
                ).observe(memory_growth)
        except Exception:
            # Don't let metric updates break the worker
            pass

    def _check_memory_growth(self, memory_growth_bytes):
        """Check if memory growth exceeds thresholds and record events."""
        try:
            memory_growth_mb = memory_growth_bytes / (1024 * 1024)

            # Check various thresholds
            thresholds = [
                (self.growth_threshold_mb, f'{self.growth_threshold_mb}mb'),
                (50, '50mb'),
                (100, '100mb')
            ]

            for threshold_mb, threshold_label in thresholds:
                if memory_growth_mb > threshold_mb:
                    self._memory_growth_counter.labels(
                        container=self.container_name,
                        threshold=threshold_label
                    ).inc()
        except Exception:
            # Don't let threshold checking break the worker
            pass

    def _update_object_counts(self):
        """Update Python object count metrics."""
        try:
            # Get object counts by type
            object_counts = {}

            # Count common object types that might indicate leaks
            for obj in gc.get_objects():
                obj_type = type(obj).__name__
                if obj_type in ['dict', 'list', 'tuple', 'str', 'function', 'method']:
                    object_counts[obj_type] = object_counts.get(obj_type, 0) + 1

            # Update gauges
            for obj_type, count in object_counts.items():
                self._object_count_gauge.labels(
                    container=self.container_name,
                    object_type=obj_type
                ).set(count)

        except Exception:
            # Don't let object counting break the worker
            pass

    def _update_gc_metrics(self):
        """Update garbage collection metrics."""
        try:
            current_gc_stats = self._get_gc_stats()

            for generation, stats in enumerate(current_gc_stats):
                collections = stats.get('collections', 0)

                # Only increment if collections increased
                if generation < len(self._last_gc_stats):
                    last_collections = self._last_gc_stats[generation].get('collections', 0)
                    if collections > last_collections:
                        increment = collections - last_collections
                        for _ in range(increment):
                            self._gc_collections_counter.labels(
                                container=self.container_name,
                                generation=str(generation)
                            ).inc()

            self._last_gc_stats = current_gc_stats
        except Exception:
            # Don't let GC metrics break the worker
            pass


class PeriodicMemoryMonitor:
    """
    Periodic memory monitoring that runs in a background thread.

    This provides continuous memory monitoring independent of task execution.
    """

    def __init__(self, interval=30, container_name=None):
        """
        Initialize periodic memory monitor.

        Args:
            interval (int): Monitoring interval in seconds
            container_name (str): Container name for metrics labeling
        """
        self.interval = interval
        self.monitor = WorkerMemoryMonitor(container_name)
        self.running = False
        self.thread = None

    def start(self):
        """Start periodic monitoring in background thread."""
        if self.running or not self.monitor.enabled:
            return

        self.running = True
        self.thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self.thread.start()

    def stop(self):
        """Stop periodic monitoring."""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)

    def _monitor_loop(self):
        """Main monitoring loop."""
        while self.running:
            try:
                self.monitor.collect_memory_metrics()
                time.sleep(self.interval)
            except Exception:
                # Don't let monitoring errors break the loop
                time.sleep(self.interval)
