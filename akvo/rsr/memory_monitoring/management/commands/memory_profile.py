"""
Management command for RSR memory profiling with memray integration.
"""

import json
import logging
from pathlib import Path
from django.core.management.base import BaseCommand

from akvo.rsr.memory_monitoring.profiling import get_memory_profiler

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """
    Management command for deep memory profiling and analysis.

    Provides utilities for:
    - Starting/stopping background profiling
    - Listing active profilers
    - Cleaning up old profile files
    - Generating profile reports
    - Managing profiling configuration
    """

    help = 'RSR memory profiling with memray for deep analysis'

    def add_arguments(self, parser):
        parser.add_argument(
            '--start-background',
            type=int,
            metavar='DURATION_MINUTES',
            help='Start background profiling for specified duration in minutes',
        )
        parser.add_argument(
            '--stop-background',
            type=str,
            metavar='PROFILE_ID',
            help='Stop background profiling with given ID',
        )
        parser.add_argument(
            '--list-active',
            action='store_true',
            help='List all active background profilers',
        )
        parser.add_argument(
            '--cleanup',
            action='store_true',
            help='Clean up old profile files based on retention settings',
        )
        parser.add_argument(
            '--stats',
            action='store_true',
            help='Show profiling statistics and storage usage',
        )
        parser.add_argument(
            '--report',
            type=str,
            metavar='PROFILE_FILE',
            help='Generate report for specific profile file',
        )
        parser.add_argument(
            '--json-output',
            action='store_true',
            help='Output results in JSON format',
        )
        parser.add_argument(
            '--include-native',
            action='store_true',
            help='Include native stack traces (more overhead)',
        )

    def handle(self, *args, **options):
        """Execute the requested memory profiling operation."""

        profiler = get_memory_profiler()

        if not profiler.enabled:
            self.stdout.write(
                self.style.WARNING("Memory profiling is disabled in settings")
            )
            return

        if not profiler.is_memray_available():
            self.stdout.write(
                self.style.ERROR("memray is not available. Install with: pip install memray")
            )
            return

        if options['start_background']:
            self.start_background_profiling(profiler, options)

        elif options['stop_background']:
            self.stop_background_profiling(profiler, options)

        elif options['list_active']:
            self.list_active_profilers(profiler, options)

        elif options['cleanup']:
            self.cleanup_profiles(profiler, options)

        elif options['stats']:
            self.show_profiling_stats(profiler, options)

        elif options['report']:
            self.generate_profile_report(profiler, options)

        else:
            self.stdout.write("No action specified. Use --help to see available options.")

    def start_background_profiling(self, profiler, options):
        """Start background profiling for specified duration."""
        duration_minutes = options['start_background']

        self.stdout.write(f"Starting background profiling for {duration_minutes} minutes...")

        try:
            profile_id = profiler.start_background_profiling(duration_minutes * 60)

            if profile_id:
                result = {
                    'status': 'started',
                    'profile_id': profile_id,
                    'duration_minutes': duration_minutes,
                    'message': f'Background profiling started with ID: {profile_id}'
                }

                if options['json_output']:
                    self.stdout.write(json.dumps(result, indent=2))
                else:
                    self.stdout.write(
                        self.style.SUCCESS(f"✅ Background profiling started with ID: {profile_id}")
                    )
                    self.stdout.write(f"   Duration: {duration_minutes} minutes")
                    self.stdout.write(f"   Stop with: python manage.py memory_profile --stop-background {profile_id}")
            else:
                self.stdout.write(
                    self.style.ERROR("Failed to start background profiling")
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error starting background profiling: {e}")
            )

    def stop_background_profiling(self, profiler, options):
        """Stop background profiling with given ID."""
        profile_id = options['stop_background']

        self.stdout.write(f"Stopping background profiling: {profile_id}...")

        try:
            profile_path = profiler.stop_background_profiling(profile_id)

            if profile_path:
                result = {
                    'status': 'stopped',
                    'profile_id': profile_id,
                    'profile_path': str(profile_path),
                    'message': f'Profile saved to: {profile_path}'
                }

                if options['json_output']:
                    self.stdout.write(json.dumps(result, indent=2))
                else:
                    self.stdout.write(
                        self.style.SUCCESS(f"✅ Background profiling stopped: {profile_id}")
                    )
                    self.stdout.write(f"   Profile saved to: {profile_path}")
                    self.stdout.write("\nAnalysis commands:")
                    self.stdout.write(f"   memray flamegraph {profile_path}")
                    self.stdout.write(f"   memray table {profile_path}")
                    self.stdout.write(f"   memray summary {profile_path}")
            else:
                self.stdout.write(
                    self.style.ERROR(f"Failed to stop profiling or profiler not found: {profile_id}")
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error stopping background profiling: {e}")
            )

    def list_active_profilers(self, profiler, options):
        """List all active background profilers."""
        try:
            active_profilers = profiler.list_active_profilers()

            if options['json_output']:
                self.stdout.write(json.dumps({'active_profilers': active_profilers}, indent=2))
                return

            if not active_profilers:
                self.stdout.write(self.style.SUCCESS("No active background profilers"))
                return

            self.stdout.write(f"📊 Active Background Profilers ({len(active_profilers)}):")

            for prof in active_profilers:
                elapsed_minutes = prof['elapsed'] / 60
                duration_minutes = prof['duration'] / 60

                self.stdout.write(f"\n  ID: {prof['id']}")
                self.stdout.write(f"  Profile: {prof['path']}")
                self.stdout.write(f"  Duration: {duration_minutes:.1f} minutes")
                self.stdout.write(f"  Elapsed: {elapsed_minutes:.1f} minutes")

                if elapsed_minutes >= duration_minutes:
                    self.stdout.write(self.style.WARNING("  Status: Should have auto-stopped"))
                else:
                    remaining = duration_minutes - elapsed_minutes
                    self.stdout.write(f"  Remaining: {remaining:.1f} minutes")

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error listing active profilers: {e}")
            )

    def cleanup_profiles(self, profiler, options):
        """Clean up old profile files."""
        self.stdout.write("Cleaning up old profile files...")

        try:
            cleaned_count = profiler.cleanup_old_profiles()

            result = {
                'status': 'completed',
                'files_cleaned': cleaned_count,
                'message': f'Cleaned up {cleaned_count} old profile files'
            }

            if options['json_output']:
                self.stdout.write(json.dumps(result, indent=2))
            else:
                if cleaned_count > 0:
                    self.stdout.write(
                        self.style.SUCCESS(f"✅ Cleaned up {cleaned_count} old profile files")
                    )
                else:
                    self.stdout.write("No old profile files to clean up")

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error during cleanup: {e}")
            )

    def show_profiling_stats(self, profiler, options):
        """Show profiling statistics and storage usage."""
        try:
            stats = profiler.get_profile_stats()
            active_profilers = profiler.list_active_profilers()

            full_stats = {
                'storage': stats,
                'active_profilers': len(active_profilers),
                'profiling_enabled': profiler.enabled,
                'memray_available': profiler.is_memray_available()
            }

            if options['json_output']:
                self.stdout.write(json.dumps(full_stats, indent=2))
                return

            self.stdout.write(self.style.SUCCESS("📊 RSR Memory Profiling Statistics:"))

            # Storage stats
            self.stdout.write("\n  Storage:")
            self.stdout.write(f"    Profile files: {stats['total_files']}")
            self.stdout.write(f"    Total size: {stats['total_size_mb']:.1f} MB")
            self.stdout.write(f"    Output directory: {stats['output_dir']}")

            # Configuration
            self.stdout.write("\n  Configuration:")
            self.stdout.write(f"    Profiling enabled: {profiler.enabled}")
            self.stdout.write(f"    memray available: {profiler.is_memray_available()}")
            self.stdout.write(f"    Max profile size: {profiler.max_profile_size_mb} MB")
            self.stdout.write(f"    Cleanup after: {profiler.auto_cleanup_days} days")

            # Active profilers
            self.stdout.write(f"\n  Active Profilers: {len(active_profilers)}")

            if stats['total_files'] > 0:
                self.stdout.write("\n💡 Analysis suggestions:")
                self.stdout.write(f"    List profiles: ls -la {stats['output_dir']}")
                self.stdout.write(f"    Analyze latest: memray flamegraph {stats['output_dir']}/*.bin")

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error getting profiling stats: {e}")
            )

    def generate_profile_report(self, profiler, options):
        """Generate report for specific profile file."""
        profile_file = options['report']
        profile_path = Path(profile_file)

        if not profile_path.is_absolute():
            # Try relative to profiling output directory
            profile_path = profiler.output_dir / profile_file

        if not profile_path.exists():
            self.stdout.write(
                self.style.ERROR(f"Profile file not found: {profile_path}")
            )
            return

        try:
            report = profiler.generate_profile_report(profile_path)

            if not report:
                self.stdout.write(
                    self.style.ERROR("Failed to generate profile report")
                )
                return

            if options['json_output']:
                self.stdout.write(json.dumps(report, indent=2))
                return

            self.stdout.write(self.style.SUCCESS(f"📊 Profile Report: {profile_path.name}"))

            self.stdout.write("\n  File Information:")
            self.stdout.write(f"    Path: {report['profile_path']}")
            self.stdout.write(f"    Size: {report['file_size_mb']:.1f} MB")
            self.stdout.write(f"    Created: {report['created_time']}")
            self.stdout.write(f"    Modified: {report['modified_time']}")

            self.stdout.write("\n  Analysis Commands:")
            for cmd_name, cmd in report['cli_commands'].items():
                self.stdout.write(f"    {cmd_name}: {cmd}")

            self.stdout.write(f"\n  Note: {report['analysis_note']}")

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error generating profile report: {e}")
            )
