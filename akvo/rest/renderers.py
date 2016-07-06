# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.utils import six
from django.utils.xmlutils import SimplerXMLGenerator

from rest_framework.compat import StringIO, smart_text
from rest_framework.renderers import BaseRenderer, JSONRenderer, XMLRenderer


def _rename_to_time_fields(results):
    """
    For Tastypie, the 'created_at' and 'last_modified_at' fields need to be called 'time' and
    'time_last_updated'.
    """
    for result in results:
        if 'created_at' in result.keys():
            result['time'] = result.pop('created_at')
        if 'last_modified_at' in result.keys():
            result['time_last_updated'] = result.pop('last_modified_at')
    return results


def _remove_domain(request, link):
    """
    For Tastypie the 'next' and 'previous' meta fields do now show the domain.
    """
    if link:
        protocol = 'https' if request.is_secure() else 'http'
        return link.replace('{0}://{1}'.format(protocol, request.META['HTTP_HOST']), '')
    return link


class CustomJSONRenderer(JSONRenderer):
    """
    Custom JSON renderer for keeping Tastypie support.
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        In case a request is called on /api/v1/, we now redirect the call to DRF instead of
        Tastypie. The differences between DRF and Tastypie are:

        - 'created_at' is named 'time';
        - 'last_modified_at' is named 'time_last_updated'.

        On paginated results:
          - An additional 'meta' object containing the limit, next, previous and total_count;
          - Next and previous links do not show the domain;
          - The key of results is 'objects' instead of 'results';
        """
        request = renderer_context.get('request')

        if '/api/v1/' in request.path:
            if all(k in data.keys() for k in ['count', 'next', 'previous', 'results']):
                # Paginated result
                response_data = dict()
                response_data['meta'] = {
                    'limit': renderer_context['view'].get_paginate_by(),
                    'total_count': data.get('count'),
                    'next': _remove_domain(request, data.get('next')),
                    'previous': _remove_domain(request, data.get('previous')),
                }
                response_data['objects'] = _rename_to_time_fields(data.pop('results'))
                data = response_data
            else:
                # Non-paginated result
                data = _rename_to_time_fields([data])[0]

        return super(CustomJSONRenderer, self).render(data, accepted_media_type, renderer_context)


class CustomXMLRenderer(BaseRenderer):
    """
    Custom XML renderer for keeping Tastypie support.
    """
    media_type = 'application/xml'
    format = 'xml'
    charset = 'utf-8'

    def _to_xml(self, xml, data):
        if isinstance(data, (list, tuple)):
            for item in data:
                xml.startElement("object", {})
                self._to_xml(xml, item)
                xml.endElement("object")

        elif isinstance(data, dict):
            for key, value in six.iteritems(data):
                xml.startElement(key, {})
                self._to_xml(xml, value)
                xml.endElement(key)

        elif data is None:
            # Don't output any value
            pass

        else:
            xml.characters(smart_text(data))

    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        In case a request is called on /api/v1/, we now redirect the call to DRF instead of
        Tastypie. The differences between DRF and Tastypie are:

        - 'created_at' is named 'time';
        - 'last_modified_at' is named 'time_last_updated'.

        On paginated results:
          - An additional 'meta' object containing the limit, next, previous and total_count;
          - Next and previous links do not show the domain;
          - The root tag name is 'response';
          - The tag name of the results is 'objects';
          - The tag name for each result is 'object'.

        On non-paginated results:
          - The tag name of the result is 'object'.
        """
        request = renderer_context.get('request')

        if '/api/v1/' in request.path:
            if data is None:
                return ''

            stream = StringIO()
            xml = SimplerXMLGenerator(stream, self.charset)
            xml.startDocument()

            if all(k in data.keys() for k in ['count', 'next', 'previous', 'results']):
                # Paginated result
                xml.startElement("response", {})
                response_data = dict()
                response_data['meta'] = {
                    'limit': renderer_context['view'].get_paginate_by(),
                    'total_count': data.get('count'),
                    'next': _remove_domain(request, data.get('next')),
                    'previous': _remove_domain(request, data.get('previous')),
                }
                response_data['objects'] = _rename_to_time_fields(data.pop('results'))
                self._to_xml(xml, response_data)
                xml.endElement("response")
            else:
                # Non-paginated result
                xml.startElement("object", {})
                self._to_xml(xml, _rename_to_time_fields([data])[0])
                xml.endElement("object")

            xml.endDocument()
            return stream.getvalue()

        return XMLRenderer().render(data, accepted_media_type, renderer_context)
