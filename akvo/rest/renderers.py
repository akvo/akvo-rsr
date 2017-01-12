# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.utils import six
from django.utils.xmlutils import SimplerXMLGenerator

from six import string_types

from django.utils.six import StringIO
from django.utils.encoding import smart_text

from rest_framework.renderers import BaseRenderer, BrowsableAPIRenderer, JSONRenderer
from rest_framework_xml.renderers import XMLRenderer


def _rename_fields(results):
    """
    For Tastypie, the 'created_at' and 'last_modified_at' fields need to be called 'time' and
    'time_last_updated'.

    In addition, some foreign key fields should be converted to show the API link instead of only
    the ID.
    """
    id_to_api = {
        'project': '/api/v1/project/{0}/',
        'user': '/api/v1/user/{0}/',
        'primary_location': '/api/v1/project_location/{0}/',
        'primary_organisation': '/api/v1/organisation/{0}/',
        'partners': '/api/v1/organisation/{0}/',
        'sync_owner': '/api/v1/organisation/{0}/',
        'keywords': '/api/v1/keyword/{0}/',
        'categories': '/api/v1/category/{0}/',
    }

    for result in results:
        if 'created_at' in result.keys():
            result['time'] = result.pop('created_at')
        if 'last_modified_at' in result.keys():
            result['time_last_updated'] = result.pop('last_modified_at')
        if 'validations' in result.keys():
            result.pop('validations')

        for object_id in id_to_api.keys():
            if object_id in result.keys():
                if isinstance(result[object_id], list):
                    result_list, new_list = result.pop(object_id), []
                    for list_item in result_list:
                        if isinstance(list_item, string_types) and '/api/v1/' in list_item:
                            new_list.append(list_item)
                        else:
                            new_list.append(id_to_api[object_id].format(str(list_item)))
                    result[object_id] = new_list
                else:
                    if not (isinstance(result[object_id], string_types) and
                            '/api/v1' in result[object_id]):
                        result[object_id] = id_to_api[object_id].format(str(result.pop(object_id)))
    return results


def _remove_domain(request, link):
    """
    For Tastypie the 'next' and 'previous' meta fields do now show the domain.
    """
    if link:
        protocol = 'https' if request.is_secure() else 'http'
        return link.replace('{0}://{1}'.format(protocol, request.META['HTTP_HOST']), '')
    return link


def _convert_data_for_tastypie(request, view, data):
    """
    Converts the paginated data from DRF format to old Tastypie format.
    """
    response_data = dict()
    response_data['meta'] = {
        'limit': view.get_paginate_by(),
        'total_count': data.get('count'),
        'offset': data.get('offset'),
        'next': _remove_domain(request, data.get('next')),
        'previous': _remove_domain(request, data.get('previous')),
    }
    response_data['objects'] = _rename_fields(data.pop('results'))
    return response_data


class CustomHTMLRenderer(BrowsableAPIRenderer):
    """
    Custom HTML renderer for keeping Tastypie support.
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        In case a request is called on /api/v1/, we now redirect the call to DRF instead of
        Tastypie. The differences between DRF and Tastypie are:

        - Different names and values for several fields (see _rename_fields).

        On paginated results:
          - An additional 'meta' object containing the limit, next, previous and total_count;
          - Next and previous links do not show the domain;
          - The key of results is 'objects' instead of 'results';
        """
        request = renderer_context.get('request')

        if '/api/v1/' in request.path:
            if all(k in data.keys() for k in ['count', 'next', 'previous', 'offset', 'results']):
                # Paginated result
                data = _convert_data_for_tastypie(request, renderer_context['view'], data)
            else:
                # Non-paginated result
                data = _rename_fields([data])[0]
        elif isinstance(data, dict) and 'offset' in data.keys():
            data.pop('offset')

        return super(CustomHTMLRenderer, self).render(data, accepted_media_type, renderer_context)


class CustomJSONRenderer(JSONRenderer):
    """
    Custom JSON renderer for keeping Tastypie support.
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        In case a request is called on /api/v1/, we now redirect the call to DRF instead of
        Tastypie. The differences between DRF and Tastypie are:

        - Different names and values for several fields (see _rename_fields).

        On paginated results:
          - An additional 'meta' object containing the limit, next, previous and total_count;
          - Next and previous links do not show the domain;
          - The key of results is 'objects' instead of 'results';
        """
        request = renderer_context.get('request')

        if '/api/v1/' in request.path:
            if all(k in data.keys() for k in ['count', 'next', 'previous', 'offset', 'results']):
                # Paginated result
                data = _convert_data_for_tastypie(request, renderer_context['view'], data)
            else:
                # Non-paginated result
                data = _rename_fields([data])[0]
        elif isinstance(data, dict) and 'offset' in data.keys():
            data.pop('offset')

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

        - Different names and values for several fields (see _rename_fields).

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

            if all(k in data.keys() for k in ['count', 'next', 'previous', 'offset', 'results']):
                # Paginated result
                xml.startElement("response", {})
                data = _convert_data_for_tastypie(request, renderer_context['view'], data)
                self._to_xml(xml, data)
                xml.endElement("response")
            else:
                # Non-paginated result
                xml.startElement("object", {})
                self._to_xml(xml, _rename_fields([data])[0])
                xml.endElement("object")

            xml.endDocument()
            return stream.getvalue()
        elif isinstance(data, dict) and 'offset' in data.keys():
            data.pop('offset')

        return XMLRenderer().render(data, accepted_media_type, renderer_context)
