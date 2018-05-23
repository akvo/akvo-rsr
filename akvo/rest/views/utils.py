# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.core.cache import cache
from django.utils.cache import get_cache_key, _generate_cache_header_key


def get_cached_data(request, key_prefix, data, serializer):
    """Function to get serialized data from the cache based on the request."""
    cache_header_key = _generate_cache_header_key(key_prefix, request)
    if cache.get(cache_header_key) is None:
        cache.set(cache_header_key, [], None)

    cache_key = get_cache_key(request, key_prefix)
    cached_data = cache.get(cache_key, None)
    cache_used = True
    if not cached_data and data is not None:
        cache_used = False
        cached_data = serializer(data, many=True).data
        cache.set(cache_key, cached_data)

    return cached_data, cache_used


def set_cached_data(request, key_prefix, data):
    """Function to save data to the cache based on the request."""

    cache_header_key = _generate_cache_header_key(key_prefix, request)
    if cache.get(cache_header_key) is None:
        cache.set(cache_header_key, [], None)

    cache_key = get_cache_key(request, key_prefix)
    cache.set(cache_key, data)


def get_qs_elements_for_page(qs, request):
    """Return queryset elements to be shown on the current page"""
    limit = int_or_none(request.GET.get('limit')) or settings.PROJECT_DIRECTORY_PAGE_SIZES[0]
    limit = min(limit, settings.PROJECT_DIRECTORY_PAGE_SIZES[-1])
    max_page_number = 1 + qs.count() / limit
    page_number = min(max_page_number, int_or_none(request.GET.get('page')) or 1)
    start = (page_number - 1) * limit
    end = page_number * limit
    return qs[start:end]


def int_or_none(value):
    """Return int or None given a value."""
    try:
        return int(value)
    except:
        return None
