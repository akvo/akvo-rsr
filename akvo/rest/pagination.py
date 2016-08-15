# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.utils.six.moves.urllib import parse as urlparse

from rest_framework import pagination, serializers
from rest_framework.templatetags.rest_framework import replace_query_param


def remove_query_param(url, key):
    """
    Given a URL and a key/val pair, remove an item in the query
    parameters of the URL, and return the new URL.
    """
    (scheme, netloc, path, query, fragment) = urlparse.urlsplit(url)
    query_dict = urlparse.parse_qs(query, keep_blank_values=True)
    query_dict.pop(key, None)
    query = urlparse.urlencode(sorted(list(query_dict.items())), doseq=True)
    return urlparse.urlunsplit((scheme, netloc, path, query, fragment))


class NextPageField(serializers.Field):
    """
    Field that returns a link to the next page in paginated results.
    """
    page_field = 'page'
    offset_field = 'offset'

    def to_native(self, value):
        request = self.context.get('request')

        if request and '/api/v1/' not in request.path:
            if not value.has_next():
                return None
            page = value.next_page_number()
            url = request and request.build_absolute_uri() or ''
            new_url = remove_query_param(url, self.offset_field)
            return replace_query_param(new_url, self.page_field, page)

        elif request:
            if not value.has_next():
                return None
            try:
                offset = int(request.GET.get('offset') or 0)
            except ValueError:
                offset = 0
            new_offset = offset + value.object_list.count()
            url = request and request.build_absolute_uri() or ''
            if new_offset > 0:
                return replace_query_param(url, self.offset_field, new_offset)
            else:
                return remove_query_param(url, self.offset_field)


class PreviousPageField(serializers.Field):
    """
    Field that returns a link to the next page in paginated results.
    """
    page_field = 'page'
    offset_field = 'offset'

    def to_native(self, value):
        request = self.context.get('request')

        if request and '/api/v1/' not in request.path:
            if not value.has_previous():
                return None
            page = value.previous_page_number()
            url = request and request.build_absolute_uri() or ''
            new_url = remove_query_param(url, self.offset_field)
            return replace_query_param(new_url, self.page_field, page)

        elif request:
            if not value.has_previous():
                return None
            try:
                offset = int(request.GET.get('offset') or 0)
            except ValueError:
                offset = 0
            new_offset = offset - value.object_list.count()
            url = request and request.build_absolute_uri() or ''
            if new_offset > 0:
                return replace_query_param(url, self.offset_field, new_offset)
            else:
                return remove_query_param(url, self.offset_field)


class OffsetPageField(serializers.Field):
    """
    Field that returns the offset.
    """
    def to_native(self, value):
        request = self.context.get('request')
        try:
            return int(request.GET.get('offset') or 0)
        except ValueError:
            return 0


class CustomPaginationSerializer(pagination.PaginationSerializer):
    offset = OffsetPageField(source='*')
    next = NextPageField(source='*')
    previous = PreviousPageField(source='*')

    def __init__(self, *args, **kwargs):
        super(CustomPaginationSerializer, self).__init__(*args, **kwargs)
