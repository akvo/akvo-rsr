# -*- coding: utf-8 -*-
"""
Memory leak detection middleware for Akvo RSR.

This middleware integrates with django-prometheus to provide comprehensive
memory leak detection capabilities in production environments.
"""

import base64
import gc
import os
import tracemalloc

import psutil
from django.conf import settings
from django.http import HttpResponse
from prometheus_client import Counter, Gauge, Histogram


class MemoryLeakDetectionMiddleware:
    """
    Modern Django middleware for detecting memory leaks.

    Integrates with django-prometheus to export memory metrics to Prometheus.
    Tracks memory usage per request and detects potential memory leaks.
    """

    # Class-level metrics to avoid duplicate registration issues during testing
    _metrics_initialized = False
    _memory_usage_gauge = None
    _memory_growth_counter = None
    _object_count_gauge = None
    _gc_collections_counter = None
    _memory_allocation_histogram = None

    def __init__(self, get_response):
        self.get_response = get_response

        # Only initialize if memory profiling is enabled
        if not getattr(settings, 'ENABLE_MEMORY_PROFILING', True):
            self.enabled = False
            return

        self.enabled = True

        # Initialize psutil process
        self.process = psutil.Process()

        # Get container name and other settings
        self.container_name = os.environ.get('CONTAINER_NAME', 'unknown')
        self.sample_rate = getattr(settings, 'MEMORY_PROFILING_SAMPLE_RATE', 1.0)
        self.growth_threshold_mb = getattr(settings, 'MEMORY_GROWTH_THRESHOLD_MB', 10)

        # Metrics authentication settings
        self.metrics_auth_username = getattr(settings, 'METRICS_AUTH_USERNAME', None)
        self.metrics_auth_password = getattr(settings, 'METRICS_AUTH_PASSWORD', None)

        # Initialize memory metrics (only once across all instances)
        self._init_metrics()

        # Initialize tracemalloc
        if not tracemalloc.is_tracing():
            tracemalloc.start()

    def __call__(self, request):
        """Process the request and response."""
        if not self.enabled:
            return self.get_response(request)

        # Check for metrics endpoint authentication
        if request.path == '/metrics':
            auth_response = self._check_metrics_auth(request)
            if auth_response:
                return auth_response

        # Sample requests based on configured rate
        import random
        if random.random() > self.sample_rate:
            return self.get_response(request)

        # Pre-request memory measurement
        gc.collect()
        memory_info = self.process.memory_info()
        memory_before = memory_info.rss

        # Capture tracemalloc snapshot if available
        tracemalloc_before = None
        if tracemalloc.is_tracing():
            tracemalloc_before = tracemalloc.take_snapshot()

        # Process the request
        response = self.get_response(request)

        # Post-request memory analysis
        memory_info = self.process.memory_info()
        memory_after = memory_info.rss
        memory_diff = memory_after - memory_before

        # Get view name for labeling
        view_name = self._get_view_name(request)

        # Update metrics
        self._update_memory_metrics(memory_after, memory_diff, view_name)
        self._check_memory_growth(memory_diff)
        self._update_object_counts()
        self._update_gc_metrics()

        # Analyze tracemalloc data if available
        if tracemalloc_before and tracemalloc.is_tracing():
            self._analyze_tracemalloc(tracemalloc_before, view_name)

        return response

    def _check_metrics_auth(self, request):
        """
        Check basic authentication for /metrics endpoint.
        Returns HttpResponse if authentication fails, None if successful.
        Authentication is always required for /metrics endpoint.
        """
        # Return 500 error if credentials are not configured
        if not self.metrics_auth_username or not self.metrics_auth_password:
            return self._auth_misconfigured_response()

        # Get authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if not auth_header.startswith('Basic '):
            return self._auth_required_response()

        # Decode credentials
        try:
            encoded_credentials = auth_header[6:]  # Remove 'Basic ' prefix
            decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
            username, password = decoded_credentials.split(':', 1)
        except (ValueError, UnicodeDecodeError):
            return self._auth_required_response()

        # Validate credentials
        if username == self.metrics_auth_username and password == self.metrics_auth_password:
            return None  # Authentication successful

        return self._auth_required_response()

    def _auth_required_response(self):
        """Return 401 Unauthorized response with WWW-Authenticate header."""
        response = HttpResponse('Unauthorized', status=401)
        response['WWW-Authenticate'] = 'Basic realm="Metrics"'
        return response

    def _auth_misconfigured_response(self):
        """Return 500 Internal Server Error when metrics auth is not configured."""
        return HttpResponse('Metrics authentication not configured', status=500)

    @classmethod
    def _init_metrics(cls):
        """Initialize Prometheus metrics for memory monitoring (class-level)."""
        if cls._metrics_initialized:
            return

        # Current memory usage gauge
        cls._memory_usage_gauge = Gauge(
            'memory_usage_bytes',
            'Current memory usage in bytes',
            ['container', 'view_name'],
            namespace='django'
        )

        # Memory growth event counter
        cls._memory_growth_counter = Counter(
            'memory_growth_events_total',
            'Number of memory growth events detected',
            ['container', 'threshold'],
            namespace='django'
        )

        # Python object count gauge
        cls._object_count_gauge = Gauge(
            'python_objects_total',
            'Number of Python objects in memory',
            ['container', 'object_type'],
            namespace='django'
        )

        # Garbage collection metrics
        cls._gc_collections_counter = Counter(
            'gc_collections_total',
            'Number of garbage collection runs',
            ['container', 'generation'],
            namespace='django'
        )

        # Memory allocation histogram
        cls._memory_allocation_histogram = Histogram(
            'allocation_bytes',
            'Memory allocation size distribution',
            ['container', 'view_name'],
            namespace='django',
            buckets=(1024, 10 * 1024, 100 * 1024, 1024 * 1024, 10 * 1024 * 1024, 100 * 1024 * 1024, float('inf'))
        )

        cls._metrics_initialized = True

    def _get_view_name(self, request):
        """Extract view name from request for metrics labeling."""
        try:
            if hasattr(request, 'resolver_match') and request.resolver_match:
                return request.resolver_match.view_name or 'unknown'
            return 'unknown'
        except Exception:
            return 'unknown'

    def _update_memory_metrics(self, memory_after, memory_diff, view_name):
        """Update memory-related metrics."""
        # Update memory usage gauge
        self._memory_usage_gauge.labels(
            container=self.container_name,
            view_name=view_name
        ).set(memory_after)

        # Record memory allocation in histogram
        if memory_diff > 0:
            self._memory_allocation_histogram.labels(
                container=self.container_name,
                view_name=view_name
            ).observe(memory_diff)

    def _check_memory_growth(self, memory_diff_bytes):
        """Check if memory growth exceeds thresholds and record events."""
        memory_diff_mb = memory_diff_bytes / (1024 * 1024)

        # Check various thresholds
        thresholds = [
            (self.growth_threshold_mb, f'{self.growth_threshold_mb}mb'),
            (50, '50mb'),
            (100, '100mb')
        ]

        for threshold_mb, threshold_label in thresholds:
            if memory_diff_mb > threshold_mb:
                self._memory_growth_counter.labels(
                    container=self.container_name,
                    threshold=threshold_label
                ).inc()

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
            # Don't let object counting break the request
            pass

    def _update_gc_metrics(self):
        """Update garbage collection metrics."""
        try:
            gc_stats = gc.get_stats()
            for generation, stats in enumerate(gc_stats):
                collections = stats.get('collections', 0)
                self._gc_collections_counter.labels(
                    container=self.container_name,
                    generation=str(generation)
                ).inc(collections)
        except Exception:
            # Don't let GC metrics break the request
            pass

    def _analyze_tracemalloc(self, snapshot_before, view_name):
        """Analyze tracemalloc data to detect memory allocation patterns."""
        try:
            snapshot_after = tracemalloc.take_snapshot()
            top_stats = snapshot_after.compare_to(snapshot_before, 'lineno')

            # Look for significant memory allocations
            for stat in top_stats[:10]:  # Top 10 allocations
                if stat.size_diff > 1024 * 1024:  # > 1MB difference
                    # Could log or create metrics for specific allocation patterns
                    pass

        except Exception:
            # Don't let tracemalloc analysis break the request
            pass
