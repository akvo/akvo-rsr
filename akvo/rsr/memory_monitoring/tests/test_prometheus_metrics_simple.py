"""
Simplified tests for RSR Prometheus metrics integration.

Tests the prometheus_metrics module with focus on actual functionality.
"""

from unittest.mock import Mock, patch
from django.test import TestCase

from akvo.rsr.memory_monitoring.prometheus_metrics import (
    RSRMemoryMetrics,
    get_rsr_metrics,
    register_rsr_metrics,
    update_all_metrics
)
from .test_utils import (
    MemoryMonitoringTestCase,
    with_memory_monitoring_settings
)


@with_memory_monitoring_settings
class RSRMemoryMetricsBasicTest(MemoryMonitoringTestCase):
    """Test basic RSRMemoryMetrics functionality."""
    
    def setUp(self):
        super().setUp()
        # Mock prometheus_client components to avoid actual metric registration
        self.counter_patcher = patch('akvo.rsr.memory_monitoring.prometheus_metrics.Counter')
        self.gauge_patcher = patch('akvo.rsr.memory_monitoring.prometheus_metrics.Gauge')
        self.histogram_patcher = patch('akvo.rsr.memory_monitoring.prometheus_metrics.Histogram')
        self.info_patcher = patch('akvo.rsr.memory_monitoring.prometheus_metrics.Info')
        
        self.mock_counter = self.counter_patcher.start()
        self.mock_gauge = self.gauge_patcher.start()
        self.mock_histogram = self.histogram_patcher.start()
        self.mock_info = self.info_patcher.start()
        
        # Set up mock return values
        self.mock_counter.return_value = Mock()
        self.mock_gauge.return_value = Mock()
        self.mock_histogram.return_value = Mock()
        self.mock_info.return_value = Mock()
        
        self.metrics = RSRMemoryMetrics()
    
    def tearDown(self):
        self.counter_patcher.stop()
        self.gauge_patcher.stop()
        self.histogram_patcher.stop()
        self.info_patcher.stop()
        super().tearDown()
    
    def test_metrics_initialization(self):
        """Test that metrics are properly initialized."""
        # Verify all expected metrics are created
        expected_metrics = [
            'memory_usage_mb', 'memory_growth_rate', 'model_instance_count',
            'cache_memory_usage', 'cache_utilization_percent', 'deletion_tracker_size',
            'deletion_tracker_cleanup_count', 'request_memory_delta', 'request_memory_peak',
            'memory_leak_detected', 'object_growth_rate', 'system_memory_available_mb',
            'system_memory_usage_percent', 'project_hierarchy_depth', 'aggregation_memory_usage',
            'monitoring_info'
        ]
        
        for metric_name in expected_metrics:
            self.assertTrue(hasattr(self.metrics, metric_name), f'Missing metric: {metric_name}')
    
    def test_record_request_memory(self):
        """Test request memory recording."""
        self.metrics.record_request_memory(
            memory_before_mb=50.0,
            memory_after_mb=55.0,
            peak_memory_mb=60.0
        )
        
        # Verify histogram observe is called
        self.mock_histogram.return_value.observe.assert_called()
    
    def test_record_memory_leak(self):
        """Test memory leak recording."""
        self.metrics.record_memory_leak('django_model', 'high')
        
        # Verify counter labels and inc are called
        self.mock_counter.return_value.labels.assert_called()
        self.mock_counter.return_value.labels().inc.assert_called()
    
    def test_update_memory_metrics(self):
        """Test memory metrics update."""
        with patch('akvo.rsr.memory_monitoring.prometheus_metrics.psutil') as mock_psutil:
            # Mock process and memory info
            mock_process = Mock()
            mock_memory_info = Mock()
            mock_memory_info.rss = 100 * 1024 * 1024  # 100MB
            mock_memory_info.vms = 200 * 1024 * 1024  # 200MB
            mock_process.memory_info.return_value = mock_memory_info
            self.metrics._process = mock_process
            
            # Mock system memory
            mock_virtual_memory = Mock()
            mock_virtual_memory.available = 4 * 1024 * 1024 * 1024  # 4GB
            mock_virtual_memory.percent = 50.0
            mock_psutil.virtual_memory.return_value = mock_virtual_memory
            
            self.metrics.update_memory_metrics()
            
            # Should complete without errors
            self.assertTrue(True)
    
    def test_update_model_instance_metrics(self):
        """Test model instance metrics update."""
        with patch('akvo.rsr.memory_monitoring.prometheus_metrics.gc.get_objects') as mock_get_objects:
            # Mock some objects that look like Django models
            mock_obj = Mock()
            mock_obj._meta.app_label = 'rsr'
            mock_obj._meta.model_name = 'project'
            mock_get_objects.return_value = [mock_obj, mock_obj]  # 2 projects
            
            self.metrics.update_model_instance_metrics()
            
            # Should complete without errors
            self.assertTrue(True)


@with_memory_monitoring_settings
class MetricsGlobalFunctionsTest(MemoryMonitoringTestCase):
    """Test global functions for metrics management."""
    
    def setUp(self):
        super().setUp()
        # Clear global metrics
        import akvo.rsr.memory_monitoring.prometheus_metrics as metrics_module
        metrics_module.rsr_metrics = None
        
        # Mock prometheus components
        self.counter_patcher = patch('akvo.rsr.memory_monitoring.prometheus_metrics.Counter')
        self.gauge_patcher = patch('akvo.rsr.memory_monitoring.prometheus_metrics.Gauge')
        self.histogram_patcher = patch('akvo.rsr.memory_monitoring.prometheus_metrics.Histogram')
        self.info_patcher = patch('akvo.rsr.memory_monitoring.prometheus_metrics.Info')
        
        self.counter_patcher.start()
        self.gauge_patcher.start()
        self.histogram_patcher.start()
        self.info_patcher.start()
    
    def tearDown(self):
        self.counter_patcher.stop()
        self.gauge_patcher.stop()
        self.histogram_patcher.stop()
        self.info_patcher.stop()
        super().tearDown()
    
    def test_get_rsr_metrics_singleton(self):
        """Test that get_rsr_metrics returns a singleton."""
        metrics1 = get_rsr_metrics()
        metrics2 = get_rsr_metrics()
        
        self.assertIs(metrics1, metrics2)
        self.assertIsInstance(metrics1, RSRMemoryMetrics)
    
    def test_register_rsr_metrics(self):
        """Test metrics registration function."""
        result = register_rsr_metrics()
        
        self.assertIsInstance(result, RSRMemoryMetrics)
    
    def test_update_all_metrics(self):
        """Test update_all_metrics function."""
        with patch('akvo.rsr.memory_monitoring.prometheus_metrics.psutil'):
            with patch('akvo.rsr.memory_monitoring.prometheus_metrics.gc.get_objects'):
                # Should complete without errors
                update_all_metrics()
                self.assertTrue(True)