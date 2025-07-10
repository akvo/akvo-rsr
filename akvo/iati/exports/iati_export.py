# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.iati_activity_export import IatiActivityExport

from . import elements
import os
import logging

from datetime import datetime
from lxml import etree

from django.core.files.storage import default_storage, FileSystemStorage
from django.conf import settings

from .utils import make_datetime_aware

logger = logging.getLogger(__name__)

# Memory protection configuration for IATI exports
DEFAULT_IATI_EXPORT_CHUNK_SIZE = 100
IATI_EXPORT_CHUNK_SIZE = getattr(
    settings,
    'RSR_IATI_EXPORT_CHUNK_SIZE',
    DEFAULT_IATI_EXPORT_CHUNK_SIZE
)

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


def save_iati_xml_streaming(dir_path, filename, root_element, project_elements_generator):
    """
    Save IATI XML using streaming approach to avoid memory exhaustion.

    :param dir_path: Directory path for the file
    :param filename: Name of the file to save
    :param root_element: Root iati-activities element with attributes
    :param project_elements_generator: Generator yielding project elements
    :return: File path
    """
    if isinstance(default_storage, FileSystemStorage):
        # GoogleCloudStorage doesn't need parent directories to exist
        os.makedirs(default_storage.path(dir_path), exist_ok=True)

    file_path = os.path.join(dir_path, filename)

    with default_storage.open(file_path, "wb") as f:
        # Write XML declaration and opening root tag
        f.write(b'<?xml version="1.0" encoding="UTF-8"?>\n')

        # Build opening tag with attributes and namespaces
        root_tag = '<iati-activities'

        # Add namespace declarations
        if root_element.nsmap:
            for prefix, uri in root_element.nsmap.items():
                if prefix:
                    root_tag += f' xmlns:{prefix}="{uri}"'
                else:
                    root_tag += f' xmlns="{uri}"'

        # Add attributes
        for key, value in root_element.attrib.items():
            root_tag += f' {key}="{value}"'

        root_tag += '>\n'
        f.write(root_tag.encode('utf-8'))

        # Write project elements in chunks
        processed_count = 0
        for project_element in project_elements_generator:
            project_xml = etree.tostring(project_element, pretty_print=True, encoding='utf-8')
            f.write(project_xml)
            processed_count += 1

            # Log progress for large exports
            if processed_count % 500 == 0:
                logger.info(f"Streamed {processed_count} projects to IATI XML")

        # Write closing root tag
        f.write(b'</iati-activities>\n')

        logger.info(f"IATI XML export completed: {processed_count} projects written to {file_path}")

    return file_path


class IatiXML(object):
    def save_file(self, org_id, filename):
        """
        Export the etree to a file using streaming approach for memory efficiency.

        :param org: String of Organisation id
        :param filename: String of the file name

        :return: File path
        """
        dir_path = f"db/org/{org_id}/iati/"

        # Use streaming approach to avoid memory exhaustion
        if hasattr(self, '_use_streaming') and self._use_streaming:
            return save_iati_xml_streaming(
                dir_path,
                filename,
                self.iati_activities_root,
                self._generate_project_elements()
            )
        else:
            # Fallback to traditional approach for backward compatibility
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

    def _create_project_element(self, project):
        """
        Creates a standalone project element for streaming export.

        :param project: Project object
        :return: etree.Element for the project
        """
        project_element = etree.Element("iati-activity")

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

        return project_element

    def _chunked_projects(self, projects, chunk_size):
        """
        Yield projects in chunks to avoid loading all into memory at once.

        :param projects: QuerySet of projects
        :param chunk_size: Number of projects per chunk
        """
        offset = 0
        while True:
            chunk = list(projects[offset:offset + chunk_size])
            if not chunk:
                break
            yield chunk
            offset += chunk_size

    def _generate_project_elements(self):
        """
        Generator that yields project elements for streaming export.

        :return: Generator yielding etree.Element objects
        """
        processed_count = 0

        for chunk in self._chunked_projects(self.projects, IATI_EXPORT_CHUNK_SIZE):
            for project in chunk:
                # Add IATI activity export to indicate that export has started
                if self.iati_export:
                    from akvo.rsr.models import IatiExport
                    self.iati_activity_export = IatiActivityExport.objects.create(
                        iati_export=self.iati_export,
                        project=project
                    )

                # Create project element
                project_element = self._create_project_element(project)

                # Update IATI activity export's status to indicate that export has finished
                iati_activity_export = getattr(self, 'iati_activity_export', None)
                if iati_activity_export:
                    iati_activity_export.status = IatiExport.STATUS_IN_PROGRESS
                    iati_activity_export.save(update_fields=['status'])

                processed_count += 1

                # Log progress for large exports
                if processed_count % 100 == 0:
                    logger.info(f"Generated {processed_count} project elements for IATI export")

                yield project_element

    def __init__(
            self,
            projects,
            version='2.03',
            iati_export=None,
            excluded_elements=None,
            utc_now: datetime = None,
    ):
        """
        Initialise the IATI XML object with memory-efficient streaming for large exports.

        :param projects: QuerySet of Projects
        :param version: String of IATI version
        :param iati_export: IatiExport Django object
        :param excluded_elements: List of fieldnames that should be ignored when exporting
        :param utc_now: The current time in UTC. Useful to override in tests for a stable time
        """
        from akvo.rsr.models import IatiExport

        self.projects = projects
        self.version = version
        self.iati_export = iati_export
        self.excluded_elements = excluded_elements

        # Memory protection: Check project count and use streaming for large exports
        # Check if it's a Django QuerySet (has count method that takes no args)
        if hasattr(projects, 'model') and hasattr(projects, 'count'):
            # Django QuerySet
            project_count = projects.count()
        else:
            # Python list or other iterable
            project_count = len(projects)
        self._use_streaming = project_count > IATI_EXPORT_CHUNK_SIZE

        if self._use_streaming:
            logger.info(
                f"IATI export using streaming mode for {project_count} projects "
                f"(chunk size: {IATI_EXPORT_CHUNK_SIZE})"
            )

        # Create root element (used by both streaming and traditional modes)
        self.iati_activities_root = etree.Element("iati-activities",
                                                  nsmap={'akvo': 'http://akvo.org/iati-activities'})
        self.iati_activities_root.attrib['version'] = self.version

        utc_now = utc_now or datetime.utcnow()
        self.iati_activities_root.attrib['generated-datetime'] = utc_now.isoformat("T", "seconds")

        if self._use_streaming:
            # For streaming mode, we don't build the tree in memory
            # The root element is used for metadata only
            self.iati_activities = self.iati_activities_root
        else:
            # Traditional mode: build the complete tree in memory
            self.iati_activities = self.iati_activities_root

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
