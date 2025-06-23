"""
Test utilities for memory monitoring tests.

Provides common fixtures, mocks, and utilities for testing memory monitoring components.
"""

import gc
import threading
import time
from contextlib import contextmanager
from unittest.mock import Mock, patch, MagicMock
from pathlib import Path
import tempfile

from django.test import TestCase, override_settings
from django.core.cache import cache


class MemoryMonitoringTestCase(TestCase):
    """Base test case for memory monitoring tests with common utilities."""
    
    def setUp(self):
        """Set up test fixtures."""
        super().setUp()
        # Clear cache before each test
        cache.clear()
        
        # Force garbage collection for consistent memory state
        gc.collect()
        
        # Store initial object count for memory leak detection tests
        self.initial_object_count = len(gc.get_objects())
        
    def tearDown(self):
        """Clean up after tests."""
        # Clear cache after each test
        cache.clear()
        
        # Force garbage collection
        gc.collect()
        
        super().tearDown()
    
    def create_memory_leak_scenario(self, count=100):
        """Create a controlled memory leak scenario for testing."""
        leaked_objects = []
        for i in range(count):
            # Create objects that won't be garbage collected
            obj = {'data': f'test_data_{i}' * 100, 'refs': []}
            obj['refs'].append(obj)  # Create circular reference
            leaked_objects.append(obj)
        return leaked_objects
    
    def get_object_count_change(self):
        """Get the change in object count since test setup."""
        gc.collect()
        current_count = len(gc.get_objects())
        return current_count - self.initial_object_count
    
    @contextmanager
    def temporary_directory(self):
        """Context manager for temporary directory creation."""
        with tempfile.TemporaryDirectory() as temp_dir:
            yield Path(temp_dir)
    
    def mock_memory_info(self, rss_mb=100, vms_mb=200):
        """Create a mock memory info object."""
        mock_info = Mock()
        mock_info.rss = rss_mb * 1024 * 1024
        mock_info.vms = vms_mb * 1024 * 1024
        return mock_info
    
    def mock_process(self, memory_info=None):
        """Create a mock process object."""
        if memory_info is None:
            memory_info = self.mock_memory_info()
        
        mock_process = Mock()
        mock_process.memory_info.return_value = memory_info
        return mock_process


class MockPrometheusMetrics:
    """Mock Prometheus metrics for testing."""
    
    def __init__(self):
        self.memory_usage = Mock()
        self.memory_peak_usage = Mock()
        self.request_memory_usage = Mock()
        self.cache_hits = Mock()
        self.cache_misses = Mock()
        self.cache_operations = Mock()
        self.memory_leaks_detected = Mock()
        self.model_instance_count = Mock()
        self.object_growth_rate = Mock()
        self.deletion_tracker_size = Mock()
        self.deletion_tracker_operations = Mock()
        self.project_hierarchy_depth = Mock()
        self.project_descendants_processed = Mock()
        
        # Mock labels method for all metrics
        for attr_name in dir(self):
            attr = getattr(self, attr_name)
            if hasattr(attr, 'labels'):
                attr.labels.return_value = attr
    
    @property
    def record_memory_usage(self):
        """Mock memory usage recording."""
        if not hasattr(self, '_record_memory_usage_mock'):
            self._record_memory_usage_mock = Mock()
        return self._record_memory_usage_mock
    
    @property
    def record_request_memory(self):
        """Mock request memory recording."""
        if not hasattr(self, '_record_request_memory_mock'):
            self._record_request_memory_mock = Mock()
        return self._record_request_memory_mock
    
    @property
    def record_cache_operation(self):
        """Mock cache operation recording."""
        if not hasattr(self, '_record_cache_operation_mock'):
            self._record_cache_operation_mock = Mock()
        return self._record_cache_operation_mock
    
    @property
    def record_memory_leak(self):
        """Mock memory leak recording."""
        if not hasattr(self, '_record_memory_leak_mock'):
            self._record_memory_leak_mock = Mock()
        return self._record_memory_leak_mock
    
    # Make these proper Mock objects instead of methods
    @property
    def update_cache_metrics(self):
        """Mock cache metrics update."""
        if not hasattr(self, '_update_cache_metrics_mock'):
            self._update_cache_metrics_mock = Mock()
        return self._update_cache_metrics_mock
    
    @property
    def update_deletion_tracker_metrics(self):
        """Mock deletion tracker metrics update."""
        if not hasattr(self, '_update_deletion_tracker_metrics_mock'):
            self._update_deletion_tracker_metrics_mock = Mock()
        return self._update_deletion_tracker_metrics_mock


class MemoryMonitoringTestSettings:
    """Test settings container for memory monitoring tests."""
    RSR_MEMORY_MONITORING_ENABLED = True
    RSR_LEAK_DETECTION_ENABLED = True
    RSR_PROFILING_ENABLED = False  # Disabled by default for tests
    RSR_MEMORY_DETAILED_TRACKING = True
    RSR_LEAK_CHECK_INTERVAL = 1  # Fast interval for tests
    RSR_LEAK_GROWTH_THRESHOLD = 0.1  # Low threshold for tests
    RSR_LEAK_MEMORY_THRESHOLD_MB = 10  # Low threshold for tests


def with_memory_monitoring_settings(cls):
    """Class decorator to apply memory monitoring test settings."""
    return override_settings(
        RSR_MEMORY_MONITORING_ENABLED=True,
        RSR_LEAK_DETECTION_ENABLED=True,
        RSR_PROFILING_ENABLED=False,
        RSR_MEMORY_DETAILED_TRACKING=True,
        RSR_LEAK_CHECK_INTERVAL=1,
        RSR_LEAK_GROWTH_THRESHOLD=0.1,
        RSR_LEAK_MEMORY_THRESHOLD_MB=10,
        RSR_CACHE_METRICS_ENABLED=True,
        RSR_CACHE_METRICS_UPDATE_FREQUENCY=60,
        RSR_PROMETHEUS_METRICS_ENABLED=True,
        RSR_PROFILING_OUTPUT_DIR='/tmp/test_profiling',
        RSR_MAX_PROFILE_SIZE_MB=50,
        RSR_PROFILING_CLEANUP_DAYS=1,
        RSR_PROFILING_REQUEST_PROBABILITY=0.01,
    )(cls)


class MockMemrayProfiler:
    """Mock memray profiler for testing."""
    
    def __init__(self, file_name, native_traces=False, follow_fork=True):
        self.file_name = file_name
        self.native_traces = native_traces
        self.follow_fork = follow_fork
        self.active = False
    
    def __enter__(self):
        self.active = True
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.active = False
        # Create a mock profile file
        Path(self.file_name).touch()


def mock_memray_available():
    """Mock memray availability."""
    with patch('akvo.rsr.memory_monitoring.profiling.memray', create=True):
        yield


def mock_memray_tracker():
    """Mock memray Tracker class."""
    with patch('akvo.rsr.memory_monitoring.profiling.memray', create=True) as mock_memray:
        mock_memray.Tracker = MockMemrayProfiler
        return patch('akvo.rsr.memory_monitoring.profiling.memray.Tracker', MockMemrayProfiler)


class ThreadSafeTestCase(TestCase):
    """Test case for thread-safe testing."""
    
    def setUp(self):
        super().setUp()
        self.threads = []
        self.thread_results = {}
        self.thread_errors = {}
    
    def tearDown(self):
        # Wait for all threads to complete
        for thread in self.threads:
            thread.join(timeout=5)
        super().tearDown()
    
    def run_in_thread(self, target, name=None, *args, **kwargs):
        """Run a function in a separate thread and collect results."""
        if name is None:
            name = f"thread_{len(self.threads)}"
        
        def wrapper():
            try:
                result = target(*args, **kwargs)
                self.thread_results[name] = result
            except Exception as e:
                self.thread_errors[name] = e
        
        thread = threading.Thread(target=wrapper, name=name)
        self.threads.append(thread)
        thread.start()
        return thread
    
    def wait_for_threads(self, timeout=5):
        """Wait for all threads to complete."""
        for thread in self.threads:
            thread.join(timeout=timeout)
        
        # Check for thread errors
        if self.thread_errors:
            error_msgs = [f"{name}: {error}" for name, error in self.thread_errors.items()]
            self.fail(f"Thread errors occurred: {'; '.join(error_msgs)}")


def create_test_models(count=10):
    """Create test model instances for testing."""
    from akvo.rsr.models import Project, Organisation
    
    # Create test organization
    org = Organisation.objects.create(
        name="Test Organization",
        long_name="Test Organization for Memory Testing"
    )
    
    projects = []
    for i in range(count):
        project = Project.objects.create(
            title=f"Test Project {i}",
            subtitle=f"Test project for memory monitoring {i}",
        )
        projects.append(project)
    
    return org, projects


def simulate_memory_pressure():
    """Simulate memory pressure for testing."""
    # Create temporary objects to increase memory usage
    temp_objects = []
    for i in range(1000):
        temp_objects.append({
            'id': i,
            'data': 'x' * 1000,  # 1KB per object
            'nested': {'more_data': 'y' * 500}
        })
    return temp_objects


@contextmanager
def patch_memory_usage(rss_mb=100, vms_mb=200):
    """Context manager to patch memory usage for testing."""
    mock_info = Mock()
    mock_info.rss = rss_mb * 1024 * 1024
    mock_info.vms = vms_mb * 1024 * 1024
    
    with patch('psutil.Process') as mock_process_class:
        mock_process = Mock()
        mock_process.memory_info.return_value = mock_info
        mock_process_class.return_value = mock_process
        yield mock_process


@contextmanager
def suppress_logging():
    """Context manager to suppress logging during tests."""
    import logging
    logging.disable(logging.CRITICAL)
    try:
        yield
    finally:
        logging.disable(logging.NOTSET)


def wait_for_condition(condition_func, timeout=5, interval=0.1):
    """Wait for a condition to become true."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        if condition_func():
            return True
        time.sleep(interval)
    return False