# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from . import org_elements
from .iati_export import save_iati_xml

from datetime import datetime
from lxml import etree

from .utils import make_datetime_aware

ORG_ELEMENTS = [
    'organisation_identifier',
    'name',
    'reporting_org',
    'total_budget',
    'recipient_org_budget',
    'recipient_region_budget',
    'recipient_country_budget',
    'total_expenditure',
    'document_link',
]


class IatiOrgXML(object):

    def save_file(self, org_id, filename):
        """
        Export the etree to a file.

        :param org: String of Organisation id
        :param filename: String of the file name

        :return: File path
        """
        dir_path = f'db/org/{org_id}/iati-org/'
        return save_iati_xml(dir_path, filename, self.iati_organisations)

    def add_organisation(self, organisation):
        """
        Adds an organisation to the IATI organisation XML.

        :param organisation: Organisation object
        """
        organisation_element = etree.SubElement(self.iati_organisations, "iati-organisation")

        if last_modified_at := organisation.last_modified_at:
            last_modified_dt = make_datetime_aware(last_modified_at)
            organisation_element.attrib['last-updated-datetime'] = last_modified_dt.isoformat("T", "seconds")

        if organisation.language:
            organisation_element.attrib['{http://www.w3.org/XML/1998/namespace}lang'] = \
                organisation.language

        if organisation.currency:
            organisation_element.attrib['default-currency'] = organisation.currency

        for element in ORG_ELEMENTS:
            tree_elements = getattr(org_elements, element)(organisation, self.context)
            for tree_element in tree_elements:
                organisation_element.append(tree_element)

    def __init__(
            self,
            organisations,
            version='2.03',
            excluded_elements=None,
            context=None,
            utc_now: datetime = None,
    ):
        """
        Initialise the IATI XML object, creating a 'iati-organisations' etree Element as root.

        :param organisations: QuerySet of Organisations
        :param context: Dictionary of additional context that might be required by element handler
        :param version: String of IATI version
        :param excluded_elements: List of fieldnames that should be ignored when exporting
        :param utc_now: The current time in UTC. Useful to override in tests for a stable time
        """
        self.context = context or {}
        self.organisations = organisations
        self.version = version
        self.excluded_elements = excluded_elements
        # TODO: Add Akvo namespace and RSR specific fields
        self.iati_organisations = etree.Element("iati-organisations")
        self.iati_organisations.attrib['version'] = self.version

        utc_now = utc_now or datetime.utcnow()
        self.iati_organisations.attrib['generated-datetime'] = utc_now.isoformat("T", "seconds")

        for organisation in organisations:
            self.add_organisation(organisation)

    def stream_xml(self):
        """
        Stream XML generation with memory monitoring and cleanup.

        This method yields XML content in chunks to prevent memory accumulation
        during large IATI organization exports.

        :return: Generator yielding XML content chunks as strings
        """
        # Stream header
        yield from self._stream_organisations_header()

        # Stream each organization with memory cleanup
        for organisation in self.organisations:
            yield from self._stream_organisation(organisation)

        # Stream footer
        yield from self._stream_organisations_footer()

    def _stream_organisations_header(self):
        """
        Stream XML header and opening iati-organisations tag.

        :return: Generator yielding header XML chunks
        """
        yield '<?xml version="1.0" encoding="UTF-8"?>\n'

        # Get datetime for generated-datetime attribute
        utc_now = datetime.utcnow()
        generated_datetime = utc_now.isoformat("T", "seconds")

        yield f'<iati-organisations version="{self.version}" generated-datetime="{generated_datetime}">'

    def _stream_organisation(self, organisation):
        """
        Stream individual organisation XML with explicit memory cleanup.

        This method processes a single organisation, converts it to XML,
        and immediately cleans up the element tree to prevent memory accumulation.

        :param organisation: Organisation object to process
        :return: Generator yielding organisation XML chunk
        """
        # Create organization element (without adding to parent tree)
        organisation_element = etree.Element("iati-organisation")

        # Add attributes
        if last_modified_at := organisation.last_modified_at:
            last_modified_dt = make_datetime_aware(last_modified_at)
            organisation_element.attrib['last-updated-datetime'] = last_modified_dt.isoformat("T", "seconds")

        if organisation.language:
            organisation_element.attrib['{http://www.w3.org/XML/1998/namespace}lang'] = \
                organisation.language

        if organisation.currency:
            organisation_element.attrib['default-currency'] = organisation.currency

        # Add child elements
        for element in ORG_ELEMENTS:
            tree_elements = getattr(org_elements, element)(organisation, self.context)
            for tree_element in tree_elements:
                organisation_element.append(tree_element)

        # Convert to string and clean up immediately
        xml_chunk = etree.tostring(organisation_element, encoding='unicode', pretty_print=False)

        # Explicit memory cleanup
        organisation_element.clear()

        yield xml_chunk

    def _stream_organisations_footer(self):
        """
        Stream closing iati-organisations tag.

        :return: Generator yielding footer XML chunk
        """
        yield '</iati-organisations>'
