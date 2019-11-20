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
