# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.utils import six

from rest_framework.exceptions import ParseError
from rest_framework.parsers import JSONParser
from rest_framework_xml.parsers import XMLParser
from rest_framework_xml.compat import etree

from akvo.rsr.models import Organisation, Country

from ..serializers import OrganisationSerializer
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

        #id = find_text(tree, 'org_id')
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
    parser_classes = (AkvoOrganisationParser, JSONParser,)
