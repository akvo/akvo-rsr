# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import elements
import os

from datetime import datetime
from io import BytesIO
from lxml import etree

ELEMENTS = [
    'iati_identifier',
    'reporting_org',
    'title',
    'subtitle',
    'summary',
    'background',
    'project_plan',
    'current_situation',
    'sustainability',
    'goals_overview',
    'target_group',
    'participating_org',
    'other_identifier',
    'activity_status',
    'activity_date',
    'contact_info',
    'activity_scope',
    'recipient_country',
    'recipient_region',
    'location',
    'sector',
    'country_budget_items',
    'policy_marker',
    'collaboration_type',
    'default_flow_type',
    'default_finance_type',
    'default_aid_type',
    'default_tied_status',
    'budget',
    'planned_disbursement',
    'capital_spend',
    'transaction',
    'document_link',
    'related_activity',
    'legacy_data',
    'conditions',
    'result',
    'crs_add',
    'fss',
]


class IatiXML(object):
    def save_file(self, org_id, filename):
        """
        Export the etree to a file.

        :param org: String of Organisation id
        :param filename: String of the file name
        :return: File object
        """
        media_root = '/var/akvo/rsr/mediaroot/'
        directory = 'db/org/%s/iati/' % org_id
        if not os.path.exists(media_root + directory):
            os.makedirs(media_root + directory)

        f = open(media_root + directory + filename, 'w')
        f.write(etree.tostring(self.iati_activities, pretty_print=True))
        f.close()

        return directory + filename

    def add_project(self, project):
        """
        Adds a project to the IATI XML.

        :param project: Project object
        """
        project_element = etree.SubElement(self.iati_activities, "iati-activity")

        if project.last_modified_at:
            project_element.attrib['last-updated-datetime'] = project.last_modified_at.strftime("%Y-%m-%dT%H:%M:%SZ")

        if project.language:
            project_element.attrib['{http://www.w3.org/XML/1998/namespace}lang'] = project.language

        if project.currency:
            project_element.attrib['default-currency'] = project.currency

        if project.hierarchy:
            project_element.attrib['hierarchy'] = str(project.hierarchy)

        for element in ELEMENTS:
            tree_elements = getattr(elements, element)(project)
            for tree_element in tree_elements:
                project_element.append(tree_element)

    def __init__(self, projects, version='2.01', excluded_elements=None):
        """
        Initialise the IATI XML object, creating a 'iati-activities' etree Element as root.

        :param projects: QuerySet of Projects
        :param version: String of IATI version
        :param excluded_elements: List of fieldnames that should be ignored when exporting
        """
        self.projects, self.version, self.excluded_elements = projects, version, excluded_elements

        self.iati_activities = etree.Element("iati-activities", nsmap={'akvo': 'http://akvo.org/iati-activities'})
        self.iati_activities.attrib['version'] = self.version
        self.iati_activities.attrib['generated-datetime'] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

        for project in projects:
            self.add_project(project)
