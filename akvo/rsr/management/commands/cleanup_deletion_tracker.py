# -*- coding: utf-8 -*-

"""
Management command to cleanup stale entries from the project deletion tracker.

This command provides manual cleanup capabilities for the ProjectDeletionTracker
to prevent memory leaks in case automatic cleanup fails or needs to be forced.
"""

from django.core.management.base import BaseCommand

from akvo.rsr.models.project import DELETION_SET


class Command(BaseCommand):
    help = 'Cleanup stale entries from the project deletion tracker to prevent memory leaks'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be cleaned up without actually cleaning',
        )
        parser.add_argument(
            '--stats',
            action='store_true',
            help='Show current deletion tracker statistics',
        )

    def handle(self, *args, **options):
        if options['stats']:
            self.show_stats()
            return

        if options['dry_run']:
            self.dry_run_cleanup()
        else:
            self.cleanup()

    def show_stats(self):
        """Show current deletion tracker statistics"""
        # Access private attributes for debugging/stats purposes
        with DELETION_SET._lock:
            deletion_count = len(DELETION_SET._deletion_set)
            timestamp_count = len(DELETION_SET._timestamps)
            
        self.stdout.write(
            self.style.SUCCESS(
                f"Deletion tracker stats:\n"
                f"  Active deletions: {deletion_count}\n"
                f"  Tracked timestamps: {timestamp_count}\n"
                f"  Cleanup threshold: {DELETION_SET._cleanup_threshold}s\n"
                f"  Last cleanup: {DELETION_SET._last_cleanup}"
            )
        )

    def dry_run_cleanup(self):
        """Show what would be cleaned up without actually doing it"""
        import time
        
        with DELETION_SET._lock:
            current_time = time.time()
            stale_ids = [
                project_id for project_id, timestamp in DELETION_SET._timestamps.items()
                if current_time - timestamp > DELETION_SET._cleanup_threshold
            ]
            
        if stale_ids:
            self.stdout.write(
                self.style.WARNING(
                    f"Would clean up {len(stale_ids)} stale deletion tracker entries:\n"
                    f"  Project IDs: {', '.join(map(str, stale_ids))}"
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS("No stale entries found - deletion tracker is clean")
            )

    def cleanup(self):
        """Perform actual cleanup of stale entries"""
        cleaned_count = DELETION_SET.force_cleanup()
        
        if cleaned_count > 0:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully cleaned up {cleaned_count} stale deletion tracker entries"
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS("No stale entries found - deletion tracker is clean")
            )