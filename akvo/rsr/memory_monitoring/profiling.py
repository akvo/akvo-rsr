"""
Deep Memory Profiling with memray integration

This module provides Django-specific memory profiling capabilities using memray
for detailed memory analysis and debugging. Designed for production-safe profiling
with minimal overhead and comprehensive reporting.
"""

import logging
import threading
import time
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, List

from django.conf import settings

logger = logging.getLogger(__name__)

# Global profiling state
_profiling_lock = threading.Lock()
_active_profilers = {}


class RSRMemoryProfiler:
    """
    Production-safe memory profiler using memray for deep analysis.

    Provides context managers and utilities for profiling specific operations,
    requests, or entire application segments with minimal overhead.
    """

    def __init__(self):
        self.enabled = getattr(settings, 'RSR_PROFILING_ENABLED', False)
        self.output_dir = Path(getattr(settings, 'RSR_PROFILING_OUTPUT_DIR', '/tmp/rsr_profiling'))
        self.max_profile_size_mb = getattr(settings, 'RSR_MAX_PROFILE_SIZE_MB', 100)
        self.auto_cleanup_days = getattr(settings, 'RSR_PROFILING_CLEANUP_DAYS', 7)

        # Ensure output directory exists
        self.output_dir.mkdir(parents=True, exist_ok=True)

        if self.enabled:
            logger.info(f"RSR memory profiler initialized, output dir: {self.output_dir}")

    def is_memray_available(self) -> bool:
        """Check if memray is available for profiling."""
        try:
            import memray  # noqa: F401
            return True
        except ImportError:
            logger.warning("memray not available for deep memory profiling")
            return False

    @contextmanager
    def profile_context(self,
                        profile_name: str,
                        native_traces: bool = False,
                        follow_fork: bool = True):
        """
        Context manager for profiling a specific code block.

        Args:
            profile_name: Name for the profile file
            native_traces: Whether to include native stack traces
            follow_fork: Whether to follow forked processes
        """
        if not self.enabled or not self.is_memray_available():
            yield
            return

        import memray

        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        profile_path = self.output_dir / f"{profile_name}_{timestamp}.bin"

        try:
            logger.info(f"Starting memray profiling: {profile_path}")

            with memray.Tracker(
                file_name=str(profile_path),
                native_traces=native_traces,
                follow_fork=follow_fork
            ):
                yield profile_path

            logger.info(f"Memray profiling completed: {profile_path}")

            # Check file size and warn if too large
            if profile_path.exists():
                size_mb = profile_path.stat().st_size / 1024 / 1024
                if size_mb > self.max_profile_size_mb:
                    logger.warning(f"Large profile file generated: {size_mb:.1f}MB at {profile_path}")

        except Exception as e:
            logger.error(f"Error during memray profiling: {e}")
            yield None

    def profile_request(self, request_id: str, include_native: bool = False):
        """
        Profile a specific request with automatic cleanup.

        Returns a context manager for profiling.
        """
        return self.profile_context(
            profile_name=f"request_{request_id}",
            native_traces=include_native,
            follow_fork=False
        )

    def profile_operation(self, operation_name: str, include_native: bool = False):
        """
        Profile a specific operation (e.g., "project_aggregation", "data_import").

        Returns a context manager for profiling.
        """
        return self.profile_context(
            profile_name=f"operation_{operation_name}",
            native_traces=include_native,
            follow_fork=True
        )

    def start_background_profiling(self, duration_seconds: int = 300) -> Optional[str]:
        """
        Start background profiling for a specified duration.

        Args:
            duration_seconds: How long to profile (default 5 minutes)

        Returns:
            Profile ID for stopping or None if failed to start
        """
        if not self.enabled or not self.is_memray_available():
            return None

        import memray

        profile_id = f"background_{int(time.time())}"

        with _profiling_lock:
            if profile_id in _active_profilers:
                logger.warning(f"Profile {profile_id} already active")
                return None

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        profile_path = self.output_dir / f"background_{timestamp}.bin"

        try:
            tracker = memray.Tracker(
                file_name=str(profile_path),
                native_traces=False,
                follow_fork=True
            )
            tracker.__enter__()

            with _profiling_lock:
                _active_profilers[profile_id] = {
                    'tracker': tracker,
                    'path': profile_path,
                    'start_time': time.time(),
                    'duration': duration_seconds
                }

            # Schedule automatic stop
            def auto_stop():
                time.sleep(duration_seconds)
                self.stop_background_profiling(profile_id)

            threading.Thread(target=auto_stop, daemon=True).start()

            logger.info(f"Started background profiling: {profile_id} for {duration_seconds}s")
            return profile_id

        except Exception as e:
            logger.error(f"Failed to start background profiling: {e}")
            return None

    def stop_background_profiling(self, profile_id: str) -> Optional[Path]:
        """
        Stop background profiling and return the profile file path.

        Args:
            profile_id: ID returned by start_background_profiling

        Returns:
            Path to profile file or None if failed
        """
        with _profiling_lock:
            if profile_id not in _active_profilers:
                logger.warning(f"No active profiler with ID: {profile_id}")
                return None

            profiler_info = _active_profilers.pop(profile_id)

        try:
            tracker = profiler_info['tracker']
            profile_path = profiler_info['path']

            tracker.__exit__(None, None, None)

            logger.info(f"Stopped background profiling: {profile_id} -> {profile_path}")
            return profile_path

        except Exception as e:
            logger.error(f"Error stopping background profiling {profile_id}: {e}")
            return None

    def list_active_profilers(self) -> List[Dict[str, Any]]:
        """List all currently active background profilers."""
        with _profiling_lock:
            active = []
            for profile_id, info in _active_profilers.items():
                active.append({
                    'id': profile_id,
                    'path': str(info['path']),
                    'start_time': info['start_time'],
                    'duration': info['duration'],
                    'elapsed': time.time() - info['start_time']
                })
            return active

    def cleanup_old_profiles(self) -> int:
        """
        Clean up old profile files based on configured retention.

        Returns:
            Number of files cleaned up
        """
        if not self.output_dir.exists():
            return 0

        cutoff_time = time.time() - (self.auto_cleanup_days * 24 * 60 * 60)
        cleaned_count = 0

        try:
            for profile_file in self.output_dir.glob("*.bin"):
                if profile_file.stat().st_mtime < cutoff_time:
                    profile_file.unlink()
                    cleaned_count += 1
                    logger.debug(f"Cleaned up old profile: {profile_file}")

            if cleaned_count > 0:
                logger.info(f"Cleaned up {cleaned_count} old profile files")

        except Exception as e:
            logger.error(f"Error during profile cleanup: {e}")

        return cleaned_count

    def get_profile_stats(self) -> Dict[str, Any]:
        """Get statistics about stored profiles."""
        if not self.output_dir.exists():
            return {'total_files': 0, 'total_size_mb': 0}

        total_files = 0
        total_size_bytes = 0

        try:
            for profile_file in self.output_dir.glob("*.bin"):
                total_files += 1
                total_size_bytes += profile_file.stat().st_size
        except Exception as e:
            logger.error(f"Error getting profile stats: {e}")

        return {
            'total_files': total_files,
            'total_size_mb': total_size_bytes / 1024 / 1024,
            'output_dir': str(self.output_dir)
        }

    def generate_profile_report(self, profile_path: Path) -> Optional[Dict[str, Any]]:
        """
        Generate a summary report from a memray profile file.

        This provides basic statistics without requiring the full memray CLI.
        """
        if not profile_path.exists() or not self.is_memray_available():
            return None

        try:
            # Basic file information
            stat = profile_path.stat()

            report = {
                'profile_path': str(profile_path),
                'file_size_mb': stat.st_size / 1024 / 1024,
                'created_time': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                'modified_time': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'analysis_note': 'Use memray CLI tools for detailed analysis'
            }

            # Add CLI command suggestions
            report['cli_commands'] = {
                'flamegraph': f'memray flamegraph {profile_path}',
                'table': f'memray table {profile_path}',
                'tree': f'memray tree {profile_path}',
                'summary': f'memray summary {profile_path}'
            }

            return report

        except Exception as e:
            logger.error(f"Error generating profile report: {e}")
            return None


# Global profiler instance
_memory_profiler = None


def get_memory_profiler() -> RSRMemoryProfiler:
    """Get or create the global memory profiler instance."""
    global _memory_profiler
    if _memory_profiler is None:
        _memory_profiler = RSRMemoryProfiler()
    return _memory_profiler


def profile_operation(operation_name: str, include_native: bool = False):
    """
    Convenience decorator/context manager for profiling operations.

    Usage:
        # As context manager
        with profile_operation('data_import'):
            import_data()

        # As decorator
        @profile_operation('calculate_aggregates')
        def calculate_project_aggregates():
            pass
    """
    profiler = get_memory_profiler()

    def decorator(func):
        def wrapper(*args, **kwargs):
            with profiler.profile_operation(operation_name, include_native):
                return func(*args, **kwargs)
        return wrapper

    # Return decorator if used as @profile_operation
    if callable(operation_name):
        func = operation_name
        operation_name = func.__name__
        return decorator(func)

    # Return context manager if used as with statement
    return profiler.profile_operation(operation_name, include_native)


def profile_request_if_enabled(request_id: str, probability: float = 0.01):
    """
    Profile a request with a given probability (default 1%).

    This allows for statistical profiling in production with minimal overhead.
    """
    import random

    profiler = get_memory_profiler()

    if random.random() < probability:
        return profiler.profile_request(request_id, include_native=False)
    else:
        # Return a no-op context manager
        @contextmanager
        def noop():
            yield None
        return noop()


# Convenience functions for automated profiling
def start_automated_profiling(duration_minutes: int = 5) -> Optional[str]:
    """Start automated background profiling for debugging."""
    return get_memory_profiler().start_background_profiling(duration_minutes * 60)


def stop_automated_profiling(profile_id: str) -> Optional[Path]:
    """Stop automated profiling and return profile path."""
    return get_memory_profiler().stop_background_profiling(profile_id)


def cleanup_old_profiles() -> int:
    """Clean up old profile files."""
    return get_memory_profiler().cleanup_old_profiles()
