# -*- coding: utf-8 -*-
"""
Akvo RSR middleware package.
"""

# Import and re-export functions from core middleware for backward compatibility
from .core import (
    _is_rsr_host,
    _is_naked_app_host,
    _partner_site,
    _build_api_link,
    HostDispatchMiddleware,
    ExceptionLoggingMiddleware,
    RSRVersionHeaderMiddleware,
    APIRedirectMiddleware,
    RSRLockdownMiddleware,
    RequestTokenMiddleware,
)

__all__ = [
    '_is_rsr_host',
    '_is_naked_app_host',
    '_partner_site',
    '_build_api_link',
    'HostDispatchMiddleware',
    'ExceptionLoggingMiddleware',
    'RSRVersionHeaderMiddleware',
    'APIRedirectMiddleware',
    'RSRLockdownMiddleware',
    'RequestTokenMiddleware',
]