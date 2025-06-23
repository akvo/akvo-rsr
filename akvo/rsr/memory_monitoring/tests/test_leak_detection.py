"""
Tests for RSR memory leak detection system.

Tests the leak_detection module including the RSRLeakDetector class,
memory growth analysis, and Django model tracking.
"""

import time
from unittest.mock import Mock, patch, call

from akvo.rsr.memory_monitoring.leak_detection import (
    RSRLeakDetector,
    get_leak_detector,
    check_for_memory_leaks,
    get_memory_summary
)
from .test_utils import (
    MemoryMonitoringTestCase,
    with_memory_monitoring_settings,
    create_test_models
)


@with_memory_monitoring_settings
class RSRLeakDetectorTest(MemoryMonitoringTestCase):
    """Test RSRLeakDetector class functionality."""

    def setUp(self):
        super().setUp()
        # Mock pympler components
        self.pympler_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.tracker')
        self.mock_tracker = self.pympler_patcher.start()

        self.muppy_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.muppy')
        self.mock_muppy = self.muppy_patcher.start()

        self.summary_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.summary')
        self.mock_summary = self.summary_patcher.start()

        self.classtracker_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.ClassTracker')
        self.mock_classtracker = self.classtracker_patcher.start()

        # Mock prometheus metrics
        self.metrics_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.get_rsr_metrics')
        self.mock_get_metrics = self.metrics_patcher.start()
        self.mock_metrics = Mock()
        self.mock_get_metrics.return_value = self.mock_metrics

        # Set up mock return values
        self.mock_tracker.SummaryTracker.return_value = Mock()
        self.mock_classtracker.return_value = Mock()

        self.detector = RSRLeakDetector()

    def tearDown(self):
        self.pympler_patcher.stop()
        self.muppy_patcher.stop()
        self.summary_patcher.stop()
        self.classtracker_patcher.stop()
        self.metrics_patcher.stop()
        super().tearDown()

    def test_detector_initialization(self):
        """Test leak detector initialization."""
        self.assertTrue(self.detector.enabled)
        self.assertEqual(self.detector.check_interval, 1)  # From test settings
        self.assertEqual(self.detector.growth_threshold, 0.1)  # From test settings
        self.assertEqual(self.detector.memory_threshold_mb, 10)  # From test settings

        # Verify tracking components are initialized
        self.mock_tracker.SummaryTracker.assert_called_once()
        self.mock_classtracker.assert_called_once()

    def test_setup_model_tracking(self):
        """Test RSR model tracking setup."""
        # The setup should have been called during initialization
        # Verify that ClassTracker.track_class was called for RSR models
        self.mock_classtracker.return_value.track_class.assert_called()

        # Should be called at least once for each RSR model
        call_count = self.mock_classtracker.return_value.track_class.call_count
        self.assertGreater(call_count, 0)

    @patch('psutil.Process')
    def test_analyze_memory_growth(self, mock_process_class):
        """Test memory growth analysis."""
        # Mock memory info
        mock_process = Mock()
        mock_info = Mock()
        mock_info.rss = 100 * 1024 * 1024  # 100MB
        mock_info.vms = 200 * 1024 * 1024  # 200MB
        mock_process.memory_info.return_value = mock_info
        mock_process_class.return_value = mock_process

        # Test memory growth analysis
        result = self.detector._analyze_memory_growth()

        self.assertIn('current_memory_mb', result)
        self.assertIn('growth_rate', result)
        self.assertIn('trend', result)
        self.assertEqual(result['current_memory_mb'], 100.0)

    def test_analyze_model_instances(self):
        """Test Django model instance analysis."""
        # Mock gc.get_objects to return test objects
        with patch('akvo.rsr.memory_monitoring.leak_detection.gc.get_objects') as mock_get_objects:
            # Create mock objects that look like Django models
            mock_project = Mock()
            mock_project._meta.app_label = 'rsr'
            mock_project._meta.model_name = 'project'

            mock_org = Mock()
            mock_org._meta.app_label = 'rsr'
            mock_org._meta.model_name = 'organisation'

            mock_other = Mock()
            mock_other._meta.app_label = 'other'
            mock_other._meta.model_name = 'other_model'

            # Include non-model objects to test filtering
            mock_get_objects.return_value = [
                mock_project, mock_project,  # 2 projects
                mock_org,  # 1 organization
                mock_other,  # 1 other (should be ignored)
                "string",  # Non-model object
                123,  # Non-model object
            ]

            result = self.detector._analyze_model_instances()

            self.assertIn('current_counts', result)
            self.assertIn('growth_analysis', result)

            # Should count RSR models only
            current_counts = result['current_counts']
            self.assertEqual(current_counts.get('project', 0), 2)
            self.assertEqual(current_counts.get('organisation', 0), 1)
            self.assertNotIn('other_model', current_counts)

    def test_analyze_object_growth(self):
        """Test general object growth analysis."""
        # Mock muppy functions
        mock_objects = ['obj1', 'obj2', 'obj3'] * 100  # 300 objects
        self.mock_muppy.get_objects.return_value = mock_objects

        # Mock summary data: [type, count, total_size]
        mock_summary_data = [
            [str, 150, 15000],  # 150 strings, 15KB
            [dict, 100, 50000],  # 100 dicts, 50KB
            [list, 50, 10000],   # 50 lists, 10KB
        ]
        self.mock_summary.summarize.return_value = mock_summary_data

        result = self.detector._analyze_object_growth()

        self.assertIn('total_objects', result)
        self.assertIn('top_object_types', result)
        self.assertEqual(result['total_objects'], 300)

        # Verify top object types are properly formatted
        top_objects = result['top_object_types']
        self.assertEqual(len(top_objects), 3)

        first_obj = top_objects[0]
        self.assertIn('type', first_obj)
        self.assertIn('count', first_obj)
        self.assertIn('size_mb', first_obj)
        self.assertIn('avg_size_bytes', first_obj)

    @patch('akvo.rsr.memory_monitoring.leak_detection.time.time')
    def test_check_for_leaks_interval(self, mock_time):
        """Test leak check interval enforcement."""
        # Mock time to control intervals
        mock_time.return_value = 1000

        # First check should run
        self.detector._last_check = 0
        result1 = self.detector.check_for_leaks()
        self.assertNotIn('skipped', result1)

        # Immediate second check should be skipped
        result2 = self.detector.check_for_leaks()
        self.assertIn('skipped', result2)
        self.assertEqual(result2['reason'], 'interval_not_reached')

        # Check after interval should run
        mock_time.return_value = 1002  # 2 seconds later
        result3 = self.detector.check_for_leaks()
        self.assertNotIn('skipped', result3)

    def test_detect_leaks_memory_growth(self):
        """Test memory leak detection based on growth rate."""
        results = {
            'memory_analysis': {
                'growth_rate': 0.2,  # 20% growth, above 10% threshold
                'current_memory_mb': 15.0  # Above 10MB threshold
            },
            'model_analysis': {'growth_analysis': {}},
            'object_analysis': {'top_object_types': []}
        }

        self.detector._detect_leaks(results)

        leak_indicators = results['leak_indicators']
        recommendations = results['recommendations']

        # Should detect memory growth leak
        self.assertGreater(len(leak_indicators), 0)
        growth_indicators = [i for i in leak_indicators if i['type'] == 'memory_growth']
        self.assertEqual(len(growth_indicators), 1)

        # Should detect high memory usage
        memory_indicators = [i for i in leak_indicators if i['type'] == 'high_memory_usage']
        self.assertEqual(len(memory_indicators), 1)

        # Should have recommendations
        self.assertGreater(len(recommendations), 0)

    def test_detect_leaks_model_growth(self):
        """Test leak detection based on model instance growth."""
        results = {
            'memory_analysis': {'growth_rate': 0.05, 'current_memory_mb': 5.0},
            'model_analysis': {
                'growth_analysis': {
                    'project': {'growth_rate': 1.5, 'count': 150},  # 150% growth
                    'organisation': {'growth_rate': 0.5, 'count': 50}  # 50% growth
                }
            },
            'object_analysis': {'top_object_types': []}
        }

        self.detector._detect_leaks(results)

        leak_indicators = results['leak_indicators']

        # Should detect model instance growth leak for project (above 100% threshold)
        model_indicators = [i for i in leak_indicators if i['type'] == 'model_instance_growth']
        self.assertEqual(len(model_indicators), 1)
        self.assertEqual(model_indicators[0]['model'], 'project')

    def test_update_metrics(self):
        """Test metrics update from leak detection results."""
        results = {
            'leak_indicators': [
                {'type': 'memory_growth', 'severity': 'high'},
                {'type': 'model_instance_growth', 'severity': 'medium'}
            ],
            'object_analysis': {'total_objects': 1000},
            'model_analysis': {
                'current_counts': {
                    'project': 50,
                    'organisation': 10
                }
            }
        }

        self.detector._update_metrics(results)

        # Verify memory leaks are recorded
        self.mock_metrics.record_memory_leak.assert_has_calls([
            call(object_type='memory_growth', severity='high'),
            call(object_type='model_instance_growth', severity='medium')
        ])

        # Verify object growth rate is updated
        self.mock_metrics.object_growth_rate.labels.assert_called_with(object_type='total')
        self.mock_metrics.object_growth_rate.labels().set.assert_called_with(1000)

        # Verify model instance counts are updated
        self.mock_metrics.model_instance_count.labels.assert_any_call(model_name='project')
        self.mock_metrics.model_instance_count.labels.assert_any_call(model_name='organisation')

    def test_get_memory_summary(self):
        """Test memory summary generation."""
        # Mock muppy functions for memory summary
        mock_objects = ['obj'] * 500
        self.mock_muppy.get_objects.return_value = mock_objects

        mock_summary_data = [
            [str, 200, 20000],
            [dict, 150, 75000],
        ]
        self.mock_summary.summarize.return_value = mock_summary_data
        self.mock_summary.format_.return_value = "Formatted summary"

        # Mock tracker stats
        mock_tracker_stats = {
            'project': Mock(n=50),
            'organisation': Mock(n=10)
        }
        self.detector.class_tracker.stats = mock_tracker_stats

        result = self.detector.get_memory_summary()

        self.assertIn('total_objects', result)
        self.assertIn('summary', result)
        self.assertIn('tracker_stats', result)
        self.assertEqual(result['total_objects'], 500)
        self.assertEqual(result['summary'], "Formatted summary")

    def test_reset_tracking(self):
        """Test tracking data reset."""
        # Add some data to tracking structures
        self.detector.memory_history.append({'timestamp': time.time(), 'memory_mb': 100})
        self.detector.model_count_history['project'].append({'timestamp': time.time(), 'count': 50})
        self.detector._last_check = time.time()

        # Reset tracking
        self.detector.reset_tracking()

        # Verify data is cleared
        self.assertEqual(len(self.detector.memory_history), 0)
        self.assertEqual(len(self.detector.model_count_history), 0)
        self.assertEqual(self.detector._last_check, 0)
        self.detector.class_tracker.clear.assert_called_once()


@with_memory_monitoring_settings
class LeakDetectorGlobalTest(MemoryMonitoringTestCase):
    """Test global leak detector functions."""

    def setUp(self):
        super().setUp()
        # Clear global detector
        import akvo.rsr.memory_monitoring.leak_detection as leak_module
        leak_module._leak_detector = None

        # Mock pympler
        self.pympler_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.tracker')
        self.mock_tracker = self.pympler_patcher.start()
        self.mock_tracker.SummaryTracker.return_value = Mock()

        self.classtracker_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.ClassTracker')
        self.mock_classtracker = self.classtracker_patcher.start()
        self.mock_classtracker.return_value = Mock()

    def tearDown(self):
        self.pympler_patcher.stop()
        self.classtracker_patcher.stop()
        super().tearDown()

    def test_get_leak_detector_singleton(self):
        """Test that get_leak_detector returns a singleton."""
        detector1 = get_leak_detector()
        detector2 = get_leak_detector()

        self.assertIs(detector1, detector2)
        self.assertIsInstance(detector1, RSRLeakDetector)

    def test_check_for_memory_leaks_convenience(self):
        """Test convenience function for leak checking."""
        with patch('akvo.rsr.memory_monitoring.leak_detection.get_leak_detector') as mock_get:
            mock_detector = Mock()
            mock_detector.check_for_leaks.return_value = {'test': 'result'}
            mock_get.return_value = mock_detector

            result = check_for_memory_leaks()

            self.assertEqual(result, {'test': 'result'})
            mock_detector.check_for_leaks.assert_called_once()

    def test_get_memory_summary_convenience(self):
        """Test convenience function for memory summary."""
        with patch('akvo.rsr.memory_monitoring.leak_detection.get_leak_detector') as mock_get:
            mock_detector = Mock()
            mock_detector.get_memory_summary.return_value = {'summary': 'data'}
            mock_get.return_value = mock_detector

            result = get_memory_summary()

            self.assertEqual(result, {'summary': 'data'})
            mock_detector.get_memory_summary.assert_called_once()


@with_memory_monitoring_settings
class LeakDetectionIntegrationTest(MemoryMonitoringTestCase):
    """Test leak detection with real Django models and scenarios."""

    def setUp(self):
        super().setUp()
        # Use real leak detector but mock expensive operations
        self.pympler_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.tracker')
        self.mock_tracker = self.pympler_patcher.start()
        self.mock_tracker.SummaryTracker.return_value = Mock()

        self.classtracker_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.ClassTracker')
        self.mock_classtracker = self.classtracker_patcher.start()
        self.mock_classtracker.return_value = Mock()

        self.muppy_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.muppy')
        self.mock_muppy = self.muppy_patcher.start()

        self.summary_patcher = patch('akvo.rsr.memory_monitoring.leak_detection.summary')
        self.mock_summary = self.summary_patcher.start()

        self.detector = RSRLeakDetector()

    def tearDown(self):
        self.pympler_patcher.stop()
        self.classtracker_patcher.stop()
        self.muppy_patcher.stop()
        self.summary_patcher.stop()
        super().tearDown()

    def test_leak_detection_with_model_creation(self):
        """Test leak detection with actual model creation."""
        # Mock object analysis to return consistent results
        self.mock_muppy.get_objects.return_value = ['obj'] * 100
        self.mock_summary.summarize.return_value = [[str, 50, 5000]]

        with patch('psutil.Process') as mock_process_class:
            mock_process = Mock()
            mock_info = Mock()
            mock_info.rss = 50 * 1024 * 1024  # 50MB
            mock_info.vms = 100 * 1024 * 1024  # 100MB
            mock_process.memory_info.return_value = mock_info
            mock_process_class.return_value = mock_process

            # Create models
            org, projects = create_test_models(count=3)

            # Run leak detection
            result = self.detector.check_for_leaks()

            # Should not have any leaks with normal model creation
            self.assertIn('leak_indicators', result)
            self.assertIn('recommendations', result)
            self.assertIn('memory_analysis', result)
            self.assertIn('model_analysis', result)

            # Clean up
            for project in projects:
                project.delete()
            org.delete()

    def test_memory_growth_detection(self):
        """Test detection of actual memory growth patterns."""
        # Simulate memory growth by adding history
        self.detector.memory_history.clear()

        # Add history showing growth
        base_time = time.time()
        self.detector.memory_history.extend([
            {'timestamp': base_time - 300, 'memory_mb': 50.0, 'vms_mb': 100.0},
            {'timestamp': base_time - 200, 'memory_mb': 60.0, 'vms_mb': 120.0},
            {'timestamp': base_time - 100, 'memory_mb': 75.0, 'vms_mb': 150.0},
            {'timestamp': base_time, 'memory_mb': 95.0, 'vms_mb': 190.0},
        ])

        # Analyze memory growth
        result = self.detector._analyze_memory_growth()

        # Should detect significant growth (90% increase)
        self.assertGreater(result['growth_rate'], 0.5)
        self.assertEqual(result['trend'], 'growing')

    def test_error_handling_in_analysis(self):
        """Test error handling in analysis methods."""
        # Mock methods to raise exceptions
        with patch('psutil.Process', side_effect=Exception("Test error")):
            result = self.detector._analyze_memory_growth()
            self.assertIn('error', result)

        with patch('gc.get_objects', side_effect=Exception("Test error")):
            result = self.detector._analyze_model_instances()
            self.assertIn('error', result)

        # Mock muppy to raise exception
        self.mock_muppy.get_objects.side_effect = Exception("Test error")
        result = self.detector._analyze_object_growth()
        self.assertIn('error', result)
