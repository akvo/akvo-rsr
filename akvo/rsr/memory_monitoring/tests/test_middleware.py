"""
Tests for RSR memory monitoring middleware.

Tests the middleware module including memory tracking per request,
metrics updates, and integration with the monitoring system.
"""

import time
from unittest.mock import Mock, patch

from django.http import HttpResponse
from django.test import RequestFactory, override_settings

from akvo.rsr.memory_monitoring.middleware import (
    RSRCacheMetricsMiddleware, RSRMemoryMonitoringMiddleware,
    force_metrics_update, get_current_memory_usage)

from .test_utils import (MemoryMonitoringTestCase, MockPrometheusMetrics,
                         with_memory_monitoring_settings)


@with_memory_monitoring_settings
class RSRMemoryMonitoringMiddlewareTest(MemoryMonitoringTestCase):
    """Test RSRMemoryMonitoringMiddleware functionality."""

    def setUp(self):
        super().setUp()
        self.factory = RequestFactory()

        # Mock dependencies
        self.psutil_patcher = patch('akvo.rsr.memory_monitoring.middleware.psutil')
        self.mock_psutil = self.psutil_patcher.start()

        self.metrics_patcher = patch('akvo.rsr.memory_monitoring.middleware.get_rsr_metrics')
        self.mock_get_metrics = self.metrics_patcher.start()
        self.mock_metrics = MockPrometheusMetrics()
        self.mock_get_metrics.return_value = self.mock_metrics

        self.leak_detector_patcher = patch('akvo.rsr.memory_monitoring.middleware.get_leak_detector')
        self.mock_get_leak_detector = self.leak_detector_patcher.start()
        self.mock_leak_detector = Mock()
        self.mock_get_leak_detector.return_value = self.mock_leak_detector

        self.update_metrics_patcher = patch('akvo.rsr.memory_monitoring.middleware.update_all_metrics')
        self.mock_update_metrics = self.update_metrics_patcher.start()

        # Set up mock process and memory info
        self.mock_process = Mock()
        self.mock_psutil.Process.return_value = self.mock_process

        self.middleware = RSRMemoryMonitoringMiddleware(get_response=Mock())

    def tearDown(self):
        self.psutil_patcher.stop()
        self.metrics_patcher.stop()
        self.leak_detector_patcher.stop()
        self.update_metrics_patcher.stop()
        super().tearDown()

    def test_middleware_initialization(self):
        """Test middleware initialization with settings."""
        self.assertTrue(self.middleware.enabled)
        self.assertTrue(self.middleware.detailed_tracking)
        self.assertEqual(self.middleware.header_prefix, 'X-RSR-Memory')
        self.assertEqual(self.middleware.metrics_update_interval, 300)

    @override_settings(RSR_MEMORY_MONITORING_ENABLED=False)
    def test_middleware_disabled(self):
        """Test middleware behavior when disabled."""
        middleware = RSRMemoryMonitoringMiddleware(get_response=Mock())
        self.assertFalse(middleware.enabled)

    def test_process_request_memory_tracking(self):
        """Test request processing and memory state capture."""
        # Mock memory info
        mock_memory_info = Mock()
        mock_memory_info.rss = 100 * 1024 * 1024  # 100MB
        mock_memory_info.vms = 200 * 1024 * 1024  # 200MB
        self.mock_process.memory_info.return_value = mock_memory_info

        # Mock gc.get_objects for detailed tracking
        with patch('akvo.rsr.memory_monitoring.middleware.gc.get_objects') as mock_get_objects:
            mock_get_objects.return_value = ['obj'] * 1000

            request = self.factory.get('/test/')
            result = self.middleware.process_request(request)

            # Should return None (continue processing)
            self.assertIsNone(result)

            # Should store memory state in request
            self.assertTrue(hasattr(request, '_rsr_memory_start'))
            memory_start = request._rsr_memory_start

            self.assertIn('timestamp', memory_start)
            self.assertIn('rss_mb', memory_start)
            self.assertIn('vms_mb', memory_start)
            self.assertIn('objects_before', memory_start)

            self.assertEqual(memory_start['rss_mb'], 100.0)
            self.assertEqual(memory_start['vms_mb'], 200.0)
            self.assertEqual(memory_start['objects_before'], 1000)

    def test_process_request_disabled(self):
        """Test process_request when middleware is disabled."""
        middleware = RSRMemoryMonitoringMiddleware(get_response=Mock())
        middleware.enabled = False

        request = self.factory.get('/test/')
        result = middleware.process_request(request)

        self.assertIsNone(result)
        self.assertFalse(hasattr(request, '_rsr_memory_start'))

    def test_process_request_metrics_update(self):
        """Test periodic metrics update during request processing."""
        # Set up timing to trigger metrics update
        self.middleware._last_metrics_update = 0  # Force update

        mock_memory_info = Mock()
        mock_memory_info.rss = 100 * 1024 * 1024
        mock_memory_info.vms = 200 * 1024 * 1024
        self.mock_process.memory_info.return_value = mock_memory_info

        # Mock leak detection results
        self.mock_leak_detector.check_for_leaks.return_value = {
            'leak_indicators': [
                {'description': 'Test leak detected', 'severity': 'medium'}
            ]
        }

        request = self.factory.get('/test/')

        with patch('akvo.rsr.memory_monitoring.middleware.time.time', return_value=1000):
            self.middleware.process_request(request)

        # Should trigger metrics update
        self.mock_update_metrics.assert_called_once()
        self.mock_leak_detector.check_for_leaks.assert_called_once()

    def test_process_response_memory_calculation(self):
        """Test response processing and memory usage calculation."""
        # Set up request with initial memory state
        request = self.factory.get('/test/')
        request._rsr_memory_start = {
            'timestamp': time.time() - 1,  # 1 second ago
            'rss_mb': 100.0,
            'vms_mb': 200.0,
            'objects_before': 1000
        }

        # Mock current memory info (increased usage)
        mock_memory_info = Mock()
        mock_memory_info.rss = 110 * 1024 * 1024  # 110MB (10MB increase)
        mock_memory_info.vms = 220 * 1024 * 1024  # 220MB (20MB increase)
        self.mock_process.memory_info.return_value = mock_memory_info

        with patch('akvo.rsr.memory_monitoring.middleware.gc.get_objects') as mock_get_objects:
            mock_get_objects.return_value = ['obj'] * 1100  # 100 objects created

            response = HttpResponse('Test response')
            result = self.middleware.process_response(request, response)

            # Should return the response
            self.assertEqual(result, response)

            # Should record request memory usage
            self.mock_metrics.record_request_memory.assert_called_once()
            args = self.mock_metrics.record_request_memory.call_args[1]
            self.assertEqual(args['memory_before_mb'], 100.0)
            self.assertEqual(args['memory_after_mb'], 110.0)
            self.assertEqual(args['peak_memory_mb'], 110.0)

    def test_process_response_memory_headers(self):
        """Test memory monitoring headers are added to response."""
        request = self.factory.get('/test/')
        request._rsr_memory_start = {
            'timestamp': time.time() - 0.5,
            'rss_mb': 100.0,
            'vms_mb': 200.0,
            'objects_before': 1000
        }

        mock_memory_info = Mock()
        mock_memory_info.rss = 105 * 1024 * 1024  # 5MB increase
        mock_memory_info.vms = 210 * 1024 * 1024  # 10MB increase
        self.mock_process.memory_info.return_value = mock_memory_info

        # Mock system memory
        mock_virtual_memory = Mock()
        mock_virtual_memory.percent = 75.5
        self.mock_psutil.virtual_memory.return_value = mock_virtual_memory

        with patch('akvo.rsr.memory_monitoring.middleware.gc.get_objects') as mock_get_objects:
            mock_get_objects.return_value = ['obj'] * 1050

            response = HttpResponse('Test response')
            result = self.middleware.process_response(request, response)

            # Check memory headers
            self.assertIn('X-RSR-Memory-Duration-Seconds', result)
            self.assertIn('X-RSR-Memory-Delta-MB', result)
            self.assertIn('X-RSR-Memory-Before-MB', result)
            self.assertIn('X-RSR-Memory-After-MB', result)
            self.assertIn('X-RSR-Memory-Peak-MB', result)
            self.assertIn('X-RSR-Memory-System-Usage-Percent', result)
            self.assertIn('X-RSR-Memory-Monitoring-Enabled', result)

            # Check header values
            self.assertEqual(result['X-RSR-Memory-Delta-MB'], '5.00')
            self.assertEqual(result['X-RSR-Memory-Before-MB'], '100.00')
            self.assertEqual(result['X-RSR-Memory-After-MB'], '105.00')
            self.assertEqual(result['X-RSR-Memory-System-Usage-Percent'], '75.5')
            self.assertEqual(result['X-RSR-Memory-Monitoring-Enabled'], 'true')

    def test_process_response_detailed_tracking_headers(self):
        """Test detailed tracking headers when enabled."""
        request = self.factory.get('/test/')
        request._rsr_memory_start = {
            'timestamp': time.time() - 0.5,
            'rss_mb': 100.0,
            'vms_mb': 200.0,
            'objects_before': 1000
        }

        mock_memory_info = Mock()
        mock_memory_info.rss = 105 * 1024 * 1024
        mock_memory_info.vms = 215 * 1024 * 1024  # 15MB VMS increase
        self.mock_process.memory_info.return_value = mock_memory_info

        mock_virtual_memory = Mock()
        mock_virtual_memory.percent = 80.0
        self.mock_psutil.virtual_memory.return_value = mock_virtual_memory

        with patch('akvo.rsr.memory_monitoring.middleware.gc.get_objects') as mock_get_objects:
            mock_get_objects.return_value = ['obj'] * 1100  # 100 objects created

            response = HttpResponse('Test response')
            result = self.middleware.process_response(request, response)

            # Should have detailed tracking headers
            self.assertIn('X-RSR-Memory-VMS-Delta-MB', result)
            self.assertIn('X-RSR-Memory-Objects-Created', result)

            self.assertEqual(result['X-RSR-Memory-VMS-Delta-MB'], '15.00')
            self.assertEqual(result['X-RSR-Memory-Objects-Created'], '100')

    def test_process_response_no_memory_start(self):
        """Test response processing when no memory start data exists."""
        request = self.factory.get('/test/')
        # No _rsr_memory_start attribute

        response = HttpResponse('Test response')
        result = self.middleware.process_response(request, response)

        # Should return response without processing
        self.assertEqual(result, response)
        self.mock_metrics.record_request_memory.assert_not_called()

    def test_check_memory_concerns_high_usage(self):
        """Test memory concern detection for high usage."""
        request = self.factory.get('/test/')
        request._rsr_memory_start = {'timestamp': time.time()}

        # Simulate very high memory usage (110MB delta, above 100MB threshold which is 50MB * 2)
        self.middleware._check_memory_concerns(110.0, 160.0, request)

        # Should record memory leak for high usage
        self.mock_metrics.record_memory_leak.assert_called()
        call_args = self.mock_metrics.record_memory_leak.call_args
        self.assertEqual(call_args[0][0], 'request_high_usage')
        self.assertEqual(call_args[0][1], 'high')

    def test_check_memory_concerns_long_request(self):
        """Test memory concern detection for long-running requests."""
        request = self.factory.get('/test/')
        request._rsr_memory_start = {'timestamp': time.time() - 15}  # 15 seconds ago

        # Mock system memory pressure
        mock_virtual_memory = Mock()
        mock_virtual_memory.percent = 85.0  # Below 90% threshold
        self.mock_psutil.virtual_memory.return_value = mock_virtual_memory

        # Simulate long request with significant memory usage
        self.middleware._check_memory_concerns(15.0, 115.0, request)

        # Should record memory leak for long request
        self.mock_metrics.record_memory_leak.assert_called()
        call_args = self.mock_metrics.record_memory_leak.call_args
        self.assertIn('long_request', call_args[0])
        self.assertIn('medium', call_args[0])

    def test_error_handling_in_middleware(self):
        """Test error handling in middleware methods."""
        request = self.factory.get('/test/')

        # Mock psutil to raise exception
        self.mock_psutil.Process.side_effect = Exception("Process error")

        # Should handle exceptions gracefully
        result = self.middleware.process_request(request)
        self.assertIsNone(result)

        # Should not have memory start data due to error
        self.assertFalse(hasattr(request, '_rsr_memory_start'))


@with_memory_monitoring_settings
class RSRCacheMetricsMiddlewareTest(MemoryMonitoringTestCase):
    """Test RSRCacheMetricsMiddleware functionality."""

    def setUp(self):
        super().setUp()
        self.factory = RequestFactory()

        self.metrics_patcher = patch('akvo.rsr.memory_monitoring.middleware.get_rsr_metrics')
        self.mock_get_metrics = self.metrics_patcher.start()
        self.mock_metrics = MockPrometheusMetrics()
        self.mock_get_metrics.return_value = self.mock_metrics

        self.middleware = RSRCacheMetricsMiddleware(get_response=Mock())

    def tearDown(self):
        self.metrics_patcher.stop()
        super().tearDown()

    def test_cache_middleware_initialization(self):
        """Test cache middleware initialization."""
        self.assertTrue(self.middleware.enabled)
        self.assertEqual(self.middleware.update_frequency, 60)

    def test_cache_metrics_update(self):
        """Test cache metrics update during request processing."""
        # Set up timing to trigger update
        self.middleware._last_update = 0  # Force update

        request = self.factory.get('/test/')

        with patch('akvo.rsr.memory_monitoring.middleware.time.time', return_value=1000):
            result = self.middleware.process_request(request)

        self.assertIsNone(result)

        # Should trigger cache metrics update
        self.mock_metrics.update_cache_metrics.assert_called_once()
        self.mock_metrics.update_deletion_tracker_metrics.assert_called_once()

    def test_cache_metrics_interval_enforcement(self):
        """Test cache metrics update interval enforcement."""
        # Set recent update time
        self.middleware._last_update = time.time()

        request = self.factory.get('/test/')
        result = self.middleware.process_request(request)

        self.assertIsNone(result)

        # Should not trigger update due to interval
        self.mock_metrics.update_cache_metrics.assert_not_called()

    @override_settings(RSR_CACHE_METRICS_ENABLED=False)
    def test_cache_middleware_disabled(self):
        """Test cache middleware when disabled."""
        middleware = RSRCacheMetricsMiddleware(get_response=Mock())
        self.assertFalse(middleware.enabled)

        request = self.factory.get('/test/')
        result = middleware.process_request(request)

        self.assertIsNone(result)
        self.mock_metrics.update_cache_metrics.assert_not_called()


class MemoryUtilityFunctionsTest(MemoryMonitoringTestCase):
    """Test memory monitoring utility functions."""

    def setUp(self):
        super().setUp()
        self.psutil_patcher = patch('akvo.rsr.memory_monitoring.middleware.psutil')
        self.mock_psutil = self.psutil_patcher.start()

    def tearDown(self):
        self.psutil_patcher.stop()
        super().tearDown()

    def test_get_current_memory_usage(self):
        """Test get_current_memory_usage utility function."""
        # Mock process and memory info
        mock_process = Mock()
        mock_memory_info = Mock()
        mock_memory_info.rss = 150 * 1024 * 1024  # 150MB
        mock_memory_info.vms = 300 * 1024 * 1024  # 300MB
        mock_process.memory_info.return_value = mock_memory_info
        self.mock_psutil.Process.return_value = mock_process

        # Mock system memory
        mock_virtual_memory = Mock()
        mock_virtual_memory.total = 8 * 1024 * 1024 * 1024  # 8GB
        mock_virtual_memory.available = 4 * 1024 * 1024 * 1024  # 4GB
        mock_virtual_memory.percent = 50.0
        self.mock_psutil.virtual_memory.return_value = mock_virtual_memory

        with patch('akvo.rsr.memory_monitoring.middleware.gc.get_objects') as mock_get_objects:
            mock_get_objects.return_value = ['obj'] * 2000

            result = get_current_memory_usage()

            self.assertIn('process_rss_mb', result)
            self.assertIn('process_vms_mb', result)
            self.assertIn('system_total_mb', result)
            self.assertIn('system_available_mb', result)
            self.assertIn('system_used_percent', result)
            self.assertIn('objects_count', result)

            self.assertEqual(result['process_rss_mb'], 150.0)
            self.assertEqual(result['process_vms_mb'], 300.0)
            self.assertEqual(result['system_total_mb'], 8192.0)  # 8GB in MB
            self.assertEqual(result['system_available_mb'], 4096.0)  # 4GB in MB
            self.assertEqual(result['system_used_percent'], 50.0)
            self.assertEqual(result['objects_count'], 2000)

    def test_get_current_memory_usage_error_handling(self):
        """Test get_current_memory_usage error handling."""
        # Mock psutil to raise exception
        self.mock_psutil.Process.side_effect = Exception("Process error")

        result = get_current_memory_usage()

        # Should return empty dict on error
        self.assertEqual(result, {})

    def test_force_metrics_update(self):
        """Test force_metrics_update utility function."""
        with patch('akvo.rsr.memory_monitoring.middleware.update_all_metrics') as mock_update:
            force_metrics_update()
            mock_update.assert_called_once()

    def test_force_metrics_update_error_handling(self):
        """Test force_metrics_update error handling."""
        with patch('akvo.rsr.memory_monitoring.middleware.update_all_metrics') as mock_update:
            mock_update.side_effect = Exception("Update error")

            # Should raise the exception
            with self.assertRaises(Exception):
                force_metrics_update()


@with_memory_monitoring_settings
class MiddlewareIntegrationTest(MemoryMonitoringTestCase):
    """Test middleware integration with real Django components."""

    def setUp(self):
        super().setUp()
        self.factory = RequestFactory()

        # Use real middleware but mock external dependencies
        self.psutil_patcher = patch('akvo.rsr.memory_monitoring.middleware.psutil')
        self.mock_psutil = self.psutil_patcher.start()

        self.metrics_patcher = patch('akvo.rsr.memory_monitoring.middleware.get_rsr_metrics')
        self.mock_get_metrics = self.metrics_patcher.start()
        self.mock_metrics = MockPrometheusMetrics()
        self.mock_get_metrics.return_value = self.mock_metrics

        # Mock dependencies for realistic behavior
        mock_process = Mock()
        mock_memory_info = Mock()
        mock_memory_info.rss = 100 * 1024 * 1024
        mock_memory_info.vms = 200 * 1024 * 1024
        mock_process.memory_info.return_value = mock_memory_info
        self.mock_psutil.Process.return_value = mock_process

        mock_virtual_memory = Mock()
        mock_virtual_memory.percent = 70.0
        self.mock_psutil.virtual_memory.return_value = mock_virtual_memory

        self.middleware = RSRMemoryMonitoringMiddleware(get_response=Mock())

    def tearDown(self):
        self.psutil_patcher.stop()
        self.metrics_patcher.stop()
        super().tearDown()

    def test_full_request_cycle(self):
        """Test complete request processing cycle."""
        with patch('akvo.rsr.memory_monitoring.middleware.gc.get_objects') as mock_get_objects:
            mock_get_objects.return_value = ['obj'] * 1000

            # Process request
            request = self.factory.get('/api/projects/')
            request.META['HTTP_USER_AGENT'] = 'Test Agent'

            result = self.middleware.process_request(request)
            self.assertIsNone(result)
            self.assertTrue(hasattr(request, '_rsr_memory_start'))

            # Simulate some processing time
            time.sleep(0.01)

            # Process response
            response = HttpResponse('{"projects": []}', content_type='application/json')
            result = self.middleware.process_response(request, response)

            self.assertEqual(result, response)

            # Verify metrics were recorded
            self.mock_metrics.record_request_memory.assert_called_once()

            # Verify headers were added
            self.assertIn('X-RSR-Memory-Duration-Seconds', result)
            self.assertIn('X-RSR-Memory-Monitoring-Enabled', result)

    def test_middleware_with_exception_in_view(self):
        """Test middleware behavior when view raises exception."""
        with patch('akvo.rsr.memory_monitoring.middleware.gc.get_objects') as mock_get_objects:
            mock_get_objects.return_value = ['obj'] * 1000

            request = self.factory.get('/api/error/')

            # Process request normally
            result = self.middleware.process_request(request)
            self.assertIsNone(result)

            # Simulate exception response (500 error)
            response = HttpResponse('Internal Server Error', status=500)
            result = self.middleware.process_response(request, response)

            # Should still process response normally
            self.assertEqual(result, response)
            self.assertEqual(result.status_code, 500)

            # Should still record metrics
            self.mock_metrics.record_request_memory.assert_called_once()

    def test_middleware_performance_overhead(self):
        """Test middleware performance overhead."""
        with patch('akvo.rsr.memory_monitoring.middleware.gc.get_objects') as mock_get_objects:
            mock_get_objects.return_value = ['obj'] * 1000

            # Measure time for multiple request cycles
            start_time = time.time()

            for i in range(10):
                request = self.factory.get(f'/test/{i}/')
                self.middleware.process_request(request)
                response = HttpResponse(f'Response {i}')
                self.middleware.process_response(request, response)

            end_time = time.time()
            duration = end_time - start_time

            # Should complete quickly (less than 100ms for 10 requests)
            self.assertLess(duration, 0.1, "Middleware overhead is too high")

            # Should have recorded metrics for all requests
            self.assertEqual(self.mock_metrics.record_request_memory.call_count, 10)
