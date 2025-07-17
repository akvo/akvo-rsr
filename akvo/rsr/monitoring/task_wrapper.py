# -*- coding: utf-8 -*-
"""
Django-Q task wrapper for memory monitoring.

This module provides a decorator for Django-Q tasks to add memory monitoring
capabilities. It tracks memory usage before and after task execution.
"""

import functools
import time
from .worker_memory import WorkerMemoryMonitor


class MemoryMonitoredTask:
    """
    Decorator for Django-Q tasks to add memory monitoring.

    Usage:
        @memory_monitored_task
        def my_background_task():
            # Task implementation
            pass
    """

    def __init__(self, task_func=None, *, container_name=None, track_allocation=True):
        """
        Initialize the task wrapper.

        Args:
            task_func: The function to wrap (used when called as @memory_monitored_task)
            container_name: Override container name for metrics
            track_allocation: Whether to track memory allocation during task execution
        """
        self.task_func = task_func
        self.container_name = container_name
        self.track_allocation = track_allocation
        self.monitor = WorkerMemoryMonitor(container_name)

    def __call__(self, *args, **kwargs):
        """
        Handle both decorator usage patterns:
        1. @memory_monitored_task (direct decoration)
        2. @memory_monitored_task() (decorator factory)
        """
        if self.task_func is None:
            # Called as @memory_monitored_task() - return actual decorator
            def decorator(func):
                return MemoryMonitoredTask(func, container_name=self.container_name, track_allocation=self.track_allocation)
            return decorator
        else:
            # Called as @memory_monitored_task - execute wrapped function
            return self._execute_with_monitoring(*args, **kwargs)

    def _execute_with_monitoring(self, *args, **kwargs):
        """
        Execute the wrapped task with memory monitoring.

        Args:
            *args: Task arguments
            **kwargs: Task keyword arguments

        Returns:
            Task result
        """
        if not self.monitor.enabled:
            # If monitoring is disabled, just execute the task normally
            return self.task_func(*args, **kwargs)

        task_name = self._get_task_name()

        try:
            # Pre-task memory measurement
            start_time = time.time()
            pre_memory = self.monitor.measure_task_memory(task_name, 'start')

            # Execute the task
            result = self.task_func(*args, **kwargs)

            # Post-task memory measurement
            end_time = time.time()
            post_memory = self.monitor.measure_task_memory(task_name, 'end')

            # Calculate memory difference
            if pre_memory.get('memory_bytes') and post_memory.get('memory_bytes'):
                memory_diff = post_memory['memory_bytes'] - pre_memory['memory_bytes']
                execution_time = end_time - start_time

                # Log significant memory usage (optional)
                if memory_diff > 10 * 1024 * 1024:  # > 10MB
                    self._log_memory_usage(task_name, memory_diff, execution_time)

            # Record successful completion
            self.monitor.record_task_completion(task_name, 'success')

            return result

        except Exception as e:
            # Record failed completion
            self.monitor.record_task_completion(task_name, 'failure')

            # Re-raise the exception
            raise e

    def _get_task_name(self):
        """Get a descriptive name for the task."""
        if hasattr(self.task_func, '__name__'):
            return self.task_func.__name__
        elif hasattr(self.task_func, '__class__'):
            return self.task_func.__class__.__name__
        else:
            return 'unknown_task'

    def _log_memory_usage(self, task_name, memory_diff, execution_time):
        """
        Log significant memory usage for analysis.

        Args:
            task_name (str): Name of the task
            memory_diff (int): Memory difference in bytes
            execution_time (float): Task execution time in seconds
        """
        memory_mb = memory_diff / (1024 * 1024)

        # Import logging here to avoid circular imports
        import logging
        logger = logging.getLogger(__name__)

        logger.info(
            f"Task {task_name} used {memory_mb:.2f}MB memory in {execution_time:.2f}s"
        )

    def __get__(self, instance, owner):
        """Support for decorating instance methods."""
        if instance is None:
            return self
        return functools.partial(self.__call__, instance)


def memory_monitored_task(task_func=None, *, container_name=None, track_allocation=True):
    """
    Decorator function for memory monitoring Django-Q tasks.

    Can be used in two ways:
    1. @memory_monitored_task - Simple decoration
    2. @memory_monitored_task(container_name='custom', track_allocation=False) - With options

    Args:
        task_func: The function to wrap (internal use)
        container_name: Override container name for metrics
        track_allocation: Whether to track memory allocation during task execution

    Returns:
        Decorated function with memory monitoring
    """
    return MemoryMonitoredTask(task_func, container_name=container_name, track_allocation=track_allocation)


class TaskMemoryProfiler:
    """
    Context manager for detailed task memory profiling.

    Usage:
        with TaskMemoryProfiler('my_task') as profiler:
            # Task implementation
            pass
    """

    def __init__(self, task_name, container_name=None):
        """
        Initialize task memory profiler.

        Args:
            task_name (str): Name of the task being profiled
            container_name (str): Container name for metrics
        """
        self.task_name = task_name
        self.monitor = WorkerMemoryMonitor(container_name)
        self.start_metrics = None
        self.end_metrics = None

    def __enter__(self):
        """Enter context manager - start profiling."""
        if self.monitor.enabled:
            self.start_metrics = self.monitor.measure_task_memory(self.task_name, 'start')
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Exit context manager - end profiling."""
        if self.monitor.enabled:
            self.end_metrics = self.monitor.measure_task_memory(self.task_name, 'end')

            # Record completion status
            if exc_type is None:
                self.monitor.record_task_completion(self.task_name, 'success')
            else:
                self.monitor.record_task_completion(self.task_name, 'failure')

    def get_memory_usage(self):
        """
        Get memory usage information.

        Returns:
            dict: Memory usage statistics
        """
        if not self.monitor.enabled or not self.start_metrics or not self.end_metrics:
            return {}

        start_memory = self.start_metrics.get('memory_bytes', 0)
        end_memory = self.end_metrics.get('memory_bytes', 0)

        return {
            'task_name': self.task_name,
            'start_memory_mb': start_memory / (1024 * 1024),
            'end_memory_mb': end_memory / (1024 * 1024),
            'memory_diff_mb': (end_memory - start_memory) / (1024 * 1024),
            'memory_diff_bytes': end_memory - start_memory
        }
