# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.db.models import Q
from django.utils import six
from rest_framework.decorators import api_view
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework_xml.parsers import XMLParser
from rest_framework_xml.compat import etree

from akvo.rest.views.utils import int_or_none, get_qs_elements_for_page
from akvo.rsr.filters import location_choices, get_m49_filter
from akvo.rsr.models import Organisation, Country
from ..serializers import OrganisationSerializer, OrganisationDirectorySerializer
from ..viewsets import BaseRSRViewSet


class AkvoOrganisationParser(XMLParser):
    def parse(self, stream, media_type=None, parser_context=None):
        assert etree, 'XMLParser requires defusedxml to be installed'

        parser_context = parser_context or {}
        encoding = parser_context.get('encoding', settings.DEFAULT_CHARSET)
        parser = etree.DefusedXMLParser(encoding=encoding)
        try:
            tree = etree.parse(stream, parser=parser, forbid_dtd=True)
        except (etree.ParseError, ValueError) as exc:
            raise ParseError('XML parse error - %s' % six.text_type(exc))
        return self.organisation_data_from_etree(tree.getroot())

    def organisation_data_from_etree(self, tree):
        def find_text(tree, str):
            element = tree.find(str)
            if element is None:
                return ''
            return element.text.strip() if element.text else ""

        def location_data(location_tree):
            if location_tree is None:
                return []
            iso_code = find_text(location_tree, 'iso_code').lower()
            country, created = Country.objects.get_or_create(**Country.fields_from_iso_code(iso_code))
            country = country.id
            latitude = find_text(location_tree, 'latitude') or 0
            longitude = find_text(location_tree, 'longitude') or 0
            primary = True
            return [dict(latitude=latitude, longitude=longitude, country=country, primary=primary)]

        long_name = find_text(tree, 'name')
        name = long_name[:25]
        description = find_text(tree, 'description')
        url = find_text(tree, 'url')
        iati_type = find_text(tree, 'iati_organisation_type')
        new_organisation_type = int(iati_type) if iati_type else 22
        organisation_type = Organisation.org_type_from_iati_type(new_organisation_type)
        locations = location_data(tree.find('location/object'))
        return dict(
            name=name, long_name=long_name, description=description, url=url,
            organisation_type=organisation_type, new_organisation_type=new_organisation_type,
            locations=locations
        )


class OrganisationViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisations to be viewed or edited.
    """
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    parser_classes = [AkvoOrganisationParser] + api_settings.DEFAULT_PARSER_CLASSES


@api_view(['GET'])
def organisation_directory(request):
    """REST view for the update directory."""

    page = request.rsr_page
    all_organisations = Organisation.objects.all() if not page else page.partners()

    # Filter updates based on query parameters
    filter_, text_filter = _create_filters_query(request)
    organisations = (
        all_organisations.filter(filter_).distinct() if filter_ is not None else all_organisations
    )
    organisations_text_filtered = (
        organisations.filter(text_filter) if text_filter is not None else organisations
    )
    if organisations_text_filtered.exists():
        organisations = organisations_text_filtered

    # Get the relevant data for typeaheads based on filtered organisations (minus
    # text filtering, if no organisations were found)
    locations = [
        {'id': choice[0], 'name': choice[1]}
        for choice in location_choices(organisations)
    ]

    count = organisations_text_filtered.count()
    display_organisations = get_qs_elements_for_page(organisations_text_filtered, request, count)

    # Get related objects of page at once
    response = {
        'project_count': organisations_text_filtered.count(),
        'projects': OrganisationDirectorySerializer(display_organisations, many=True).data,
        'location': locations,
        'page_size_default': settings.PROJECT_DIRECTORY_PAGE_SIZES[0],
    }
    return Response(response)


def _create_filters_query(request):
    """Returns a Q object expression based on query parameters."""
    location_param = int_or_none(request.GET.get('location'))
    title_or_subtitle_param = request.GET.get('title_or_subtitle')

    location_filter = (
        get_m49_filter(location_param, use_recipient_country=False) if location_param else None
    )
    title_filter = (
        Q(name__icontains=title_or_subtitle_param) |
        Q(long_name__icontains=title_or_subtitle_param)
    ) if title_or_subtitle_param else None
    all_filters = [
        location_filter,
    ]
    filters = filter(None, all_filters)
    return reduce(lambda x, y: x & y, filters) if filters else None, title_filter
