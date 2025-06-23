"""
Management command for RSR memory monitoring system operations.

This command provides utilities for managing the hybrid memory monitoring system,
including leak detection, profiling, metrics collection, and system health checks.
"""

import json
import os
import sys
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

from akvo.rsr.memory_monitoring.leak_detection import check_for_memory_leaks, get_memory_summary
from akvo.rsr.memory_monitoring.profiling import (
    start_automated_profiling,
    stop_automated_profiling,
    cleanup_old_profiles,
    get_memory_profiler
)
from akvo.rsr.memory_monitoring.prometheus_metrics import update_all_metrics, get_rsr_metrics


class Command(BaseCommand):
    help = 'RSR hybrid memory monitoring system operations'

    def add_arguments(self, parser):
        parser.add_argument(
            'action',
            choices=[
                'check-leaks',
                'memory-summary', 
                'start-profiling',
                'stop-profiling',
                'cleanup-profiles',
                'update-metrics',
                'health-check',
                'status'
            ],
            help='Action to perform'
        )
        
        # Arguments for profiling
        parser.add_argument(
            '--duration',
            type=int,
            default=10,
            help='Duration in minutes for background profiling (default: 10)'
        )
        parser.add_argument(
            '--profile-id',
            type=str,
            help='Profile ID for stopping background profiling'
        )
        
        # Output formatting
        parser.add_argument(
            '--format',
            choices=['text', 'json'],
            default='text',
            help='Output format (default: text)'
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Verbose output'
        )

    def handle(self, *args, **options):
        action = options['action']
        output_format = options['format']
        verbose = options['verbose']

        try:
            if action == 'check-leaks':
                result = self.check_leaks(verbose)
            elif action == 'memory-summary':
                result = self.memory_summary(verbose)
            elif action == 'start-profiling':
                result = self.start_profiling(options['duration'], verbose)
            elif action == 'stop-profiling':
                result = self.stop_profiling(options['profile_id'], verbose)
            elif action == 'cleanup-profiles':
                result = self.cleanup_profiles(verbose)
            elif action == 'update-metrics':
                result = self.update_metrics(verbose)
            elif action == 'health-check':
                result = self.health_check(verbose)
            elif action == 'status':
                result = self.status(verbose)
            else:
                raise CommandError(f"Unknown action: {action}")

            # Output result
            if output_format == 'json':
                self.stdout.write(json.dumps(result, indent=2, default=str))
            else:
                self.output_text_result(result, action)

        except Exception as e:
            if verbose:
                import traceback
                self.stderr.write(traceback.format_exc())
            raise CommandError(f"Error executing {action}: {str(e)}")

    def check_leaks(self, verbose):
        """Run memory leak detection."""
        if verbose:
            self.stdout.write("Running memory leak detection...")
        
        if not getattr(settings, 'RSR_LEAK_DETECTION_ENABLED', True):
            return {'error': 'Memory leak detection is disabled', 'enabled': False}
        
        results = check_for_memory_leaks()
        
        if verbose:
            leak_count = len(results.get('leak_indicators', []))
            self.stdout.write(f"Found {leak_count} potential leak indicators")
        
        return results

    def memory_summary(self, verbose):
        """Get current memory summary."""
        if verbose:
            self.stdout.write("Generating memory summary...")
        
        try:
            summary = get_memory_summary()
            
            if verbose:
                obj_count = summary.get('total_objects', 0)
                self.stdout.write(f"Total objects tracked: {obj_count}")
            
            return summary
        except Exception as e:
            return {'error': f"Failed to get memory summary: {str(e)}"}

    def start_profiling(self, duration, verbose):
        """Start background memory profiling."""
        if verbose:
            self.stdout.write(f"Starting background profiling for {duration} minutes...")
        
        if not getattr(settings, 'RSR_PROFILING_ENABLED', False):
            return {'error': 'Memory profiling is disabled', 'enabled': False}
        
        try:
            profile_id = start_automated_profiling(duration_minutes=duration)
            
            if profile_id:
                if verbose:
                    self.stdout.write(f"Started profiling with ID: {profile_id}")
                return {
                    'success': True,
                    'profile_id': profile_id,
                    'duration_minutes': duration,
                    'message': f'Background profiling started for {duration} minutes'
                }
            else:
                return {'error': 'Failed to start profiling (memray not available?)'}
        except Exception as e:
            return {'error': f"Failed to start profiling: {str(e)}"}

    def stop_profiling(self, profile_id, verbose):
        """Stop background memory profiling."""
        if not profile_id:
            # List active profilers
            profiler = get_memory_profiler()
            active = profiler.list_active_profilers()
            return {
                'active_profilers': active,
                'message': 'Specify --profile-id to stop a profiler'
            }
        
        if verbose:
            self.stdout.write(f"Stopping profiling: {profile_id}")
        
        try:
            profile_path = stop_automated_profiling(profile_id)
            
            if profile_path:
                if verbose:
                    self.stdout.write(f"Profiling stopped. Profile saved to: {profile_path}")
                return {
                    'success': True,
                    'profile_id': profile_id,
                    'profile_path': str(profile_path),
                    'message': f'Profiling stopped and saved to {profile_path}'
                }
            else:
                return {'error': f'Profile ID not found or already stopped: {profile_id}'}
        except Exception as e:
            return {'error': f"Failed to stop profiling: {str(e)}"}

    def cleanup_profiles(self, verbose):
        """Clean up old profile files."""
        if verbose:
            self.stdout.write("Cleaning up old profile files...")
        
        try:
            cleaned_count = cleanup_old_profiles()
            
            if verbose:
                self.stdout.write(f"Cleaned up {cleaned_count} old profile files")
            
            return {
                'success': True,
                'cleaned_count': cleaned_count,
                'message': f'Cleaned up {cleaned_count} old profile files'
            }
        except Exception as e:
            return {'error': f"Failed to cleanup profiles: {str(e)}"}

    def update_metrics(self, verbose):
        """Update all memory monitoring metrics."""
        if verbose:
            self.stdout.write("Updating all memory monitoring metrics...")
        
        try:
            update_all_metrics()
            
            if verbose:
                self.stdout.write("All metrics updated successfully")
            
            return {
                'success': True,
                'message': 'All memory monitoring metrics updated'
            }
        except Exception as e:
            return {'error': f"Failed to update metrics: {str(e)}"}

    def health_check(self, verbose):
        """Perform health check of memory monitoring system."""
        if verbose:
            self.stdout.write("Performing memory monitoring health check...")
        
        health = {
            'memory_monitoring_enabled': getattr(settings, 'RSR_MEMORY_MONITORING_ENABLED', False),
            'leak_detection_enabled': getattr(settings, 'RSR_LEAK_DETECTION_ENABLED', False),
            'profiling_enabled': getattr(settings, 'RSR_PROFILING_ENABLED', False),
            'prometheus_enabled': getattr(settings, 'RSR_PROMETHEUS_METRICS_ENABLED', False),
            'components': {}
        }
        
        # Test metrics system
        try:
            metrics = get_rsr_metrics()
            health['components']['prometheus_metrics'] = 'ok'
        except Exception as e:
            health['components']['prometheus_metrics'] = f'error: {str(e)}'
        
        # Test leak detection
        if health['leak_detection_enabled']:
            try:
                # Quick leak check
                results = check_for_memory_leaks()
                health['components']['leak_detection'] = 'ok'
                health['leak_indicators_count'] = len(results.get('leak_indicators', []))
            except Exception as e:
                health['components']['leak_detection'] = f'error: {str(e)}'
        else:
            health['components']['leak_detection'] = 'disabled'
        
        # Test profiling
        if health['profiling_enabled']:
            try:
                profiler = get_memory_profiler()
                active_profilers = profiler.list_active_profilers()
                health['components']['profiling'] = 'ok'
                health['active_profilers_count'] = len(active_profilers)
            except Exception as e:
                health['components']['profiling'] = f'error: {str(e)}'
        else:
            health['components']['profiling'] = 'disabled'
        
        # Overall health status
        errors = [v for v in health['components'].values() if v.startswith('error:')]
        health['overall_status'] = 'healthy' if not errors else 'degraded'
        
        if verbose:
            status = health['overall_status']
            self.stdout.write(f"Health check complete. Status: {status}")
        
        return health

    def status(self, verbose):
        """Get current status of memory monitoring system."""
        if verbose:
            self.stdout.write("Getting memory monitoring system status...")
        
        status = {
            'configuration': {
                'memory_monitoring': getattr(settings, 'RSR_MEMORY_MONITORING_ENABLED', False),
                'detailed_tracking': getattr(settings, 'RSR_MEMORY_DETAILED_TRACKING', False),
                'leak_detection': getattr(settings, 'RSR_LEAK_DETECTION_ENABLED', False),
                'profiling': getattr(settings, 'RSR_PROFILING_ENABLED', False),
                'prometheus': getattr(settings, 'RSR_PROMETHEUS_METRICS_ENABLED', False),
            },
            'intervals': {
                'metrics_update': getattr(settings, 'RSR_MEMORY_METRICS_UPDATE_INTERVAL', 300),
                'leak_check': getattr(settings, 'RSR_LEAK_CHECK_INTERVAL', 300),
                'cache_metrics': getattr(settings, 'RSR_CACHE_METRICS_UPDATE_FREQUENCY', 60),
            },
            'thresholds': {
                'memory_growth': getattr(settings, 'RSR_LEAK_GROWTH_THRESHOLD', 0.2),
                'memory_limit_mb': getattr(settings, 'RSR_LEAK_MEMORY_THRESHOLD_MB', 100),
                'model_growth': getattr(settings, 'RSR_LEAK_MODEL_GROWTH_THRESHOLD', 1.0),
            }
        }
        
        # Add runtime information
        try:
            profiler = get_memory_profiler()
            active_profilers = profiler.list_active_profilers()
            status['runtime'] = {
                'active_profilers': len(active_profilers),
                'profiler_details': active_profilers
            }
        except Exception:
            status['runtime'] = {'active_profilers': 0, 'profiler_details': []}
        
        return status

    def output_text_result(self, result, action):
        """Output result in human-readable text format."""
        if isinstance(result, dict) and 'error' in result:
            self.stderr.write(self.style.ERROR(f"Error: {result['error']}"))
            return
        
        if action == 'check-leaks':
            if result.get('skipped'):
                self.stdout.write(f"Leak check skipped: {result.get('reason', 'unknown')}")
                return
            
            leak_indicators = result.get('leak_indicators', [])
            if leak_indicators:
                self.stdout.write(self.style.WARNING(f"Found {len(leak_indicators)} leak indicators:"))
                for indicator in leak_indicators:
                    severity = indicator.get('severity', 'unknown')
                    desc = indicator.get('description', 'Unknown issue')
                    self.stdout.write(f"  [{severity.upper()}] {desc}")
            else:
                self.stdout.write(self.style.SUCCESS("No memory leaks detected"))
            
            recommendations = result.get('recommendations', [])
            if recommendations:
                self.stdout.write("\nRecommendations:")
                for rec in recommendations:
                    self.stdout.write(f"  • {rec}")
        
        elif action == 'memory-summary':
            total_objects = result.get('total_objects', 0)
            self.stdout.write(f"Total tracked objects: {total_objects:,}")
            
            if 'summary' in result:
                self.stdout.write("\nMemory summary:")
                self.stdout.write(result['summary'])
        
        elif action == 'health-check':
            overall = result.get('overall_status', 'unknown')
            if overall == 'healthy':
                self.stdout.write(self.style.SUCCESS(f"System status: {overall}"))
            else:
                self.stdout.write(self.style.WARNING(f"System status: {overall}"))
            
            components = result.get('components', {})
            self.stdout.write("\nComponent status:")
            for component, status in components.items():
                if status == 'ok':
                    self.stdout.write(f"  {component}: {self.style.SUCCESS(status)}")
                elif status == 'disabled':
                    self.stdout.write(f"  {component}: {status}")
                else:
                    self.stdout.write(f"  {component}: {self.style.ERROR(status)}")
        
        elif action == 'status':
            config = result.get('configuration', {})
            self.stdout.write("Configuration:")
            for key, value in config.items():
                status = self.style.SUCCESS('enabled') if value else 'disabled'
                self.stdout.write(f"  {key}: {status}")
            
            runtime = result.get('runtime', {})
            active_count = runtime.get('active_profilers', 0)
            self.stdout.write(f"\nActive profilers: {active_count}")
        
        else:
            # Default output for other actions
            if isinstance(result, dict):
                if result.get('success'):
                    msg = result.get('message', 'Operation completed successfully')
                    self.stdout.write(self.style.SUCCESS(msg))
                else:
                    self.stdout.write(str(result))
            else:
                self.stdout.write(str(result))