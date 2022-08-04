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

    def __init__(self, organisations, version='2.03', excluded_elements=None, context=None):
        """
        Initialise the IATI XML object, creating a 'iati-organisations' etree Element as root.

        :param organisations: QuerySet of Organisations
        :param context: Dictionary of additional context that might be required by element handler
        :param version: String of IATI version
        :param excluded_elements: List of fieldnames that should be ignored when exporting
        """
        self.context = context or {}
        self.organisations = organisations
        self.version = version
        self.excluded_elements = excluded_elements
        # TODO: Add Akvo namespace and RSR specific fields
        self.iati_organisations = etree.Element("iati-organisations")
        self.iati_organisations.attrib['version'] = self.version
        self.iati_organisations.attrib['generated-datetime'] = datetime.utcnow().\
            isoformat("T", "seconds")

        for organisation in organisations:
            self.add_organisation(organisation)
