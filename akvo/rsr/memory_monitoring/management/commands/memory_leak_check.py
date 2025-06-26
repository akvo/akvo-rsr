"""
Management command for RSR memory leak detection and analysis.
"""

import json
import logging
from django.core.management.base import BaseCommand

from akvo.rsr.memory_monitoring.leak_detection import get_leak_detector

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """
    Management command for memory leak detection and analysis.

    Provides utilities for:
    - Running comprehensive leak detection
    - Getting memory usage summaries
    - Analyzing object growth patterns
    - Resetting tracking data
    """

    help = 'RSR memory leak detection and analysis utilities'

    def add_arguments(self, parser):
        parser.add_argument(
            '--check-leaks',
            action='store_true',
            help='Run comprehensive memory leak detection',
        )
        parser.add_argument(
            '--memory-summary',
            action='store_true',
            help='Display current memory usage summary',
        )
        parser.add_argument(
            '--reset-tracking',
            action='store_true',
            help='Reset all leak detection tracking data',
        )
        parser.add_argument(
            '--json-output',
            action='store_true',
            help='Output results in JSON format',
        )
        parser.add_argument(
            '--detailed',
            action='store_true',
            help='Show detailed analysis information',
        )

    def handle(self, *args, **options):
        """Execute the requested memory leak detection operation."""

        leak_detector = get_leak_detector()

        if not leak_detector.enabled:
            self.stdout.write(
                self.style.WARNING("Memory leak detection is disabled in settings")
            )
            return

        if options['reset_tracking']:
            self.reset_tracking(leak_detector)

        if options['memory_summary']:
            self.show_memory_summary(leak_detector, options)

        if options['check_leaks']:
            self.check_memory_leaks(leak_detector, options)

        if not any([options['check_leaks'], options['memory_summary'], options['reset_tracking']]):
            self.stdout.write("No action specified. Use --help to see available options.")

    def check_memory_leaks(self, leak_detector, options):
        """Run comprehensive memory leak detection."""
        self.stdout.write("Running memory leak detection...")

        try:
            results = leak_detector.check_for_leaks()

            if options['json_output']:
                self.stdout.write(json.dumps(results, indent=2, default=str))
                return

            # Display human-readable results
            self._display_leak_results(results, options['detailed'])

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error during leak detection: {e}")
            )

    def show_memory_summary(self, leak_detector, options):
        """Display current memory usage summary."""
        self.stdout.write("Getting memory usage summary...")

        try:
            summary = leak_detector.get_memory_summary()

            if options['json_output']:
                self.stdout.write(json.dumps(summary, indent=2, default=str))
                return

            # Display human-readable summary
            self._display_memory_summary(summary, options['detailed'])

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error getting memory summary: {e}")
            )

    def reset_tracking(self, leak_detector):
        """Reset all tracking data."""
        self.stdout.write("Resetting leak detection tracking data...")

        try:
            leak_detector.reset_tracking()
            self.stdout.write(
                self.style.SUCCESS("Leak detection tracking data reset successfully")
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error resetting tracking data: {e}")
            )

    def _display_leak_results(self, results, detailed=False):
        """Display leak detection results in human-readable format."""
        if 'error' in results:
            self.stdout.write(self.style.ERROR(f"Error: {results['error']}"))
            return

        if 'skipped' in results:
            self.stdout.write(self.style.WARNING("Leak check skipped (interval not reached)"))
            return

        # Display overview
        leak_indicators = results.get('leak_indicators', [])
        if leak_indicators:
            self.stdout.write(
                self.style.WARNING(f"🚨 {len(leak_indicators)} memory leak indicators found:")
            )

            for i, indicator in enumerate(leak_indicators, 1):
                severity_style = {
                    'high': self.style.ERROR,
                    'medium': self.style.WARNING,
                    'low': self.style.NOTICE
                }.get(indicator['severity'], self.style.NOTICE)

                self.stdout.write(
                    f"  {i}. {severity_style(indicator['severity'].upper())}: {indicator['description']}"
                )
        else:
            self.stdout.write(self.style.SUCCESS("✅ No memory leak indicators detected"))

        # Display recommendations
        recommendations = results.get('recommendations', [])
        if recommendations:
            self.stdout.write("\n💡 Recommendations:")
            for i, rec in enumerate(recommendations, 1):
                self.stdout.write(f"  {i}. {rec}")

        # Display detailed analysis if requested
        if detailed:
            self._display_detailed_analysis(results)

    def _display_detailed_analysis(self, results):
        """Display detailed analysis information."""
        self.stdout.write("\n📊 Detailed Analysis:")

        # Memory analysis
        memory_analysis = results.get('memory_analysis', {})
        if memory_analysis and 'error' not in memory_analysis:
            self.stdout.write("\n  Memory Growth:")
            self.stdout.write(f"    Current: {memory_analysis.get('current_memory_mb', 0):.1f} MB")
            self.stdout.write(f"    Growth Rate: {memory_analysis.get('growth_rate', 0):.2%}")
            self.stdout.write(f"    Trend: {memory_analysis.get('trend', 'unknown')}")

        # Model analysis
        model_analysis = results.get('model_analysis', {})
        growth_analysis = model_analysis.get('growth_analysis', {})
        if growth_analysis:
            self.stdout.write("\n  Model Instance Growth:")
            for model_name, growth_data in growth_analysis.items():
                self.stdout.write(
                    f"    {model_name}: {growth_data['count']} instances "
                    f"({growth_data['growth_rate']:+.1%})"
                )

        # Object analysis
        object_analysis = results.get('object_analysis', {})
        if object_analysis and 'error' not in object_analysis:
            self.stdout.write("\n  Object Analysis:")
            self.stdout.write(f"    Total Objects: {object_analysis.get('total_objects', 0):,}")

            top_objects = object_analysis.get('top_object_types', [])[:5]
            if top_objects:
                self.stdout.write("    Top Object Types:")
                for obj in top_objects:
                    self.stdout.write(
                        f"      {obj['type']}: {obj['count']:,} objects, {obj['size_mb']:.1f} MB"
                    )

    def _display_memory_summary(self, summary, detailed=False):
        """Display memory summary in human-readable format."""
        if 'error' in summary:
            self.stdout.write(self.style.ERROR(f"Error: {summary['error']}"))
            return

        self.stdout.write(self.style.SUCCESS("📊 Memory Usage Summary:"))

        total_objects = summary.get('total_objects', 0)
        self.stdout.write(f"  Total Objects: {total_objects:,}")

        # Display object summary
        summary_text = summary.get('summary', '')
        if summary_text:
            self.stdout.write("\n  Top Object Types:")
            for line in summary_text.split('\n')[:10]:  # Show top 10
                if line.strip():
                    self.stdout.write(f"    {line}")

        # Display tracker stats if detailed
        if detailed:
            tracker_stats = summary.get('tracker_stats', {})
            if tracker_stats:
                self.stdout.write("\n  Class Tracker Statistics:")
                for class_obj, stats in tracker_stats.items():
                    class_name = getattr(class_obj, '__name__', str(class_obj))
                    count = stats.get('n', 0)
                    self.stdout.write(f"    {class_name}: {count} instances")
