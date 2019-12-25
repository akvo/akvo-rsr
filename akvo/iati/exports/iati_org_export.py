# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from . import org_elements
import os

from datetime import datetime
from lxml import etree

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
        :return: File object
        """
        media_root = '/var/akvo/rsr/mediaroot/'
        directory = 'db/org/%s/iati-org/' % org_id
        if not os.path.exists(media_root + directory):
            os.makedirs(media_root + directory)

        f = open(media_root + directory + filename, 'w')
        f.write(etree.tostring(self.iati_organisations, pretty_print=True))
        f.close()

        return directory + filename

    def add_organisation(self, organisation):
        """
        Adds an organisation to the IATI organisation XML.

        :param organisation: Organisation object
        """
        organisation_element = etree.SubElement(self.iati_organisations, "iati-organisation")

        if organisation.last_modified_at:
            organisation_element.attrib['last-updated-datetime'] = organisation.last_modified_at.\
                strftime("%Y-%m-%dT%H:%M:%SZ")

        if organisation.language:
            organisation_element.attrib['{http://www.w3.org/XML/1998/namespace}lang'] = \
                organisation.language

        if organisation.currency:
            organisation_element.attrib['default-currency'] = organisation.currency

        for element in ORG_ELEMENTS:
            tree_elements = getattr(org_elements, element)(organisation, self.request)
            for tree_element in tree_elements:
                organisation_element.append(tree_element)

    def __init__(self, request, organisations, version='2.03', excluded_elements=None):
        """
        Initialise the IATI XML object, creating a 'iati-organisations' etree Element as root.

        :param request: A Django request
        :param organisations: QuerySet of Organisations
        :param version: String of IATI version
        :param excluded_elements: List of fieldnames that should be ignored when exporting
        """
        self.request = request
        self.organisations = organisations
        self.version = version
        self.excluded_elements = excluded_elements
        # TODO: Add Akvo namespace and RSR specific fields
        self.iati_organisations = etree.Element("iati-organisations")
        self.iati_organisations.attrib['version'] = self.version
        self.iati_organisations.attrib['generated-datetime'] = datetime.utcnow().\
            strftime("%Y-%m-%dT%H:%M:%SZ")

        for organisation in organisations:
            self.add_organisation(organisation)
