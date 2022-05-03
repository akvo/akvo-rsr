# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.iati_activity_export import IatiActivityExport

from . import elements
import os

from datetime import datetime
from lxml import etree

from django.core.files.storage import default_storage, FileSystemStorage

from .utils import make_datetime_aware

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
    'humanitarian_scope',
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


def save_iati_xml(dir_path, filename, items):
    if isinstance(default_storage, FileSystemStorage):
        # GoogleCloudStorage doesn't need parent directories to exist
        os.makedirs(default_storage.path(dir_path), exist_ok=True)

    file_path = os.path.join(dir_path, filename)
    with default_storage.open(file_path, "wb") as f:
        f.write(etree.tostring(items, pretty_print=True))

    return file_path


class IatiXML(object):
    def save_file(self, org_id, filename):
        """
        Export the etree to a file.

        :param org: String of Organisation id
        :param filename: String of the file name

        :return: File path
        """
        dir_path = f"db/org/{org_id}/iati/"
        return save_iati_xml(dir_path, filename, self.iati_activities)

    def add_project(self, project):
        """
        Adds a project to the IATI XML.

        :param project: Project object
        """
        project_element = etree.SubElement(self.iati_activities, "iati-activity")

        if last_modified_at := project.last_modified_at:
            last_modified_dt = make_datetime_aware(last_modified_at)
            project_element.attrib['last-updated-datetime'] = last_modified_dt.isoformat("T", "seconds")

        if project.language:
            project_element.attrib['{http://www.w3.org/XML/1998/namespace}lang'] = project.language

        if project.currency:
            project_element.attrib['default-currency'] = project.currency

        if project.hierarchy:
            project_element.attrib['hierarchy'] = str(project.hierarchy)

        if project.humanitarian is not None:
            project_element.attrib['humanitarian'] = '1' if project.humanitarian else '0'

        for element in ELEMENTS:
            tree_elements = getattr(elements, element)(project)
            for tree_element in tree_elements:
                project_element.append(tree_element)

    def __init__(self, projects, version='2.03', iati_export=None, excluded_elements=None):
        """
        Initialise the IATI XML object, creating a 'iati-activities' etree Element as root.

        :param projects: QuerySet of Projects
        :param version: String of IATI version
        :param iati_export: IatiExport Django object
        :param excluded_elements: List of fieldnames that should be ignored when exporting
        """
        from akvo.rsr.models import IatiExport

        self.projects = projects
        self.version = version
        self.iati_export = iati_export
        self.excluded_elements = excluded_elements

        self.iati_activities = etree.Element("iati-activities",
                                             nsmap={'akvo': 'http://akvo.org/iati-activities'})
        self.iati_activities.attrib['version'] = self.version
        self.iati_activities.attrib['generated-datetime'] = datetime.utcnow().\
            isoformat("T", "seconds")

        for project in projects:
            # Add IATI activity export to indicate that export has started
            if self.iati_export:
                self.iati_activity_export = IatiActivityExport.objects.create(
                    iati_export=self.iati_export,
                    project=project
                )

            # Add project to IATI XML file
            self.add_project(project)

            # Update IATI activity export's status to indicate that export has finished
            iati_activity_export = getattr(self, 'iati_activity_export', None)
            if iati_activity_export:
                iati_activity_export.status = IatiExport.STATUS_IN_PROGRESS
                iati_activity_export.save(update_fields=['status'])
