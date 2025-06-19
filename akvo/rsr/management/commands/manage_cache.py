"""
Management command for cache monitoring, cleanup, and statistics.
"""

import json
from django.core.management.base import BaseCommand
from django.utils import timezone

from akvo.rsr.cache_management import cache_manager


class Command(BaseCommand):
    help = 'Manage RSR caches - cleanup, stats, and monitoring'

    def add_arguments(self, parser):
        parser.add_argument(
            'action',
            choices=['stats', 'cleanup', 'clear', 'monitor'],
            help='Action to perform on caches'
        )
        parser.add_argument(
            '--cache-name',
            type=str,
            help='Specific cache name (optional)'
        )
        parser.add_argument(
            '--json',
            action='store_true',
            help='Output in JSON format'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes'
        )

    def handle(self, *args, **options):
        action = options['action']
        cache_name = options.get('cache_name')
        json_output = options.get('json', False)
        dry_run = options.get('dry_run', False)

        if action == 'stats':
            self.handle_stats(cache_name, json_output)
        elif action == 'cleanup':
            self.handle_cleanup(cache_name, dry_run)
        elif action == 'clear':
            self.handle_clear(cache_name, dry_run)
        elif action == 'monitor':
            self.handle_monitor(json_output)

    def handle_stats(self, cache_name, json_output):
        """Display cache statistics"""
        stats = cache_manager.get_global_stats()

        if cache_name:
            if cache_name in stats:
                stats = {cache_name: stats[cache_name]}
            else:
                self.stdout.write(
                    self.style.ERROR(f"Cache '{cache_name}' not found")
                )
                return

        if json_output:
            self.stdout.write(json.dumps(stats, indent=2))
        else:
            self._format_stats_output(stats)

    def handle_cleanup(self, cache_name, dry_run):
        """Cleanup expired cache entries"""
        if dry_run:
            self.stdout.write(
                self.style.WARNING("DRY RUN: Would cleanup expired cache entries")
            )
            return

        if cache_name:
            if cache_name in cache_manager._caches:
                count = cache_manager._caches[cache_name]._cleanup_expired()
                self.stdout.write(
                    self.style.SUCCESS(f"Cleaned {count} expired entries from '{cache_name}'")
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f"Cache '{cache_name}' not found")
                )
        else:
            cleanup_counts = cache_manager.cleanup_all()
            total_cleaned = sum(count for count in cleanup_counts.values() if count >= 0)
            self.stdout.write(
                self.style.SUCCESS(f"Cleaned {total_cleaned} expired entries across all caches")
            )

    def handle_clear(self, cache_name, dry_run):
        """Clear cache entries"""
        if dry_run:
            self.stdout.write(
                self.style.WARNING("DRY RUN: Would clear cache entries")
            )
            return

        if cache_name:
            if cache_name in cache_manager._caches:
                cache_manager._caches[cache_name].clear()
                self.stdout.write(
                    self.style.SUCCESS(f"Cleared cache '{cache_name}'")
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f"Cache '{cache_name}' not found")
                )
        else:
            cache_manager.clear_all()
            self.stdout.write(
                self.style.SUCCESS("Cleared all caches")
            )

    def handle_monitor(self, json_output):
        """Monitor cache health and provide recommendations"""
        stats = cache_manager.get_global_stats()

        issues = []
        recommendations = []

        # Analyze global stats
        global_stats = stats.get('_global', {})
        global_utilization = global_stats.get('global_utilization_percent', 0)

        if global_utilization > 90:
            issues.append("HIGH: Global cache utilization > 90%")
            recommendations.append("Consider increasing cache size limits")
        elif global_utilization > 75:
            issues.append("MEDIUM: Global cache utilization > 75%")

        # Analyze individual caches
        for name, cache_stats in stats.items():
            if name == '_global':
                continue

            utilization = cache_stats.get('utilization_percent', 0)
            expired_entries = cache_stats.get('expired_entries', 0)

            if utilization > 95:
                issues.append(f"HIGH: Cache '{name}' utilization > 95%")
            elif utilization > 80:
                issues.append(f"MEDIUM: Cache '{name}' utilization > 80%")

            if expired_entries > cache_stats.get('size', 0) * 0.1:
                issues.append(f"MEDIUM: Cache '{name}' has many expired entries")

        if json_output:
            monitor_data = {
                'timestamp': timezone.now().isoformat(),
                'stats': stats,
                'issues': issues,
                'recommendations': recommendations
            }
            self.stdout.write(json.dumps(monitor_data, indent=2))
        else:
            self._format_monitor_output(stats, issues, recommendations)

    def _format_stats_output(self, stats):
        """Format statistics for human-readable output"""
        self.stdout.write(self.style.SUCCESS("Cache Statistics"))
        self.stdout.write("=" * 50)

        global_stats = stats.get('_global')
        if global_stats:
            self.stdout.write(f"Total Caches: {global_stats['total_caches']}")
            self.stdout.write(f"Total Entries: {global_stats['total_entries']}")
            self.stdout.write(f"Global Utilization: {global_stats['global_utilization_percent']:.1f}%")
            self.stdout.write("")

        for name, cache_stats in stats.items():
            if name == '_global':
                continue

            self.stdout.write(f"Cache: {name}")
            self.stdout.write(f"  Size: {cache_stats['size']}/{cache_stats['max_size']}")
            self.stdout.write(f"  Utilization: {cache_stats['utilization_percent']:.1f}%")
            self.stdout.write(f"  TTL: {cache_stats['ttl_seconds']}s")
            self.stdout.write("")

    def _format_monitor_output(self, stats, issues, recommendations):
        """Format monitoring output for human-readable display"""
        self.stdout.write(self.style.SUCCESS("Cache Health Monitor"))
        self.stdout.write("=" * 50)

        if not issues:
            self.stdout.write(self.style.SUCCESS("All caches are healthy"))
        else:
            self.stdout.write("Issues Found:")
            for issue in issues:
                if issue.startswith('HIGH'):
                    self.stdout.write(self.style.ERROR(f"  {issue}"))
                else:
                    self.stdout.write(self.style.WARNING(f"  {issue}"))

        if recommendations:
            self.stdout.write("")
            self.stdout.write("Recommendations:")
            for rec in recommendations:
                self.stdout.write(f"  {rec}")
