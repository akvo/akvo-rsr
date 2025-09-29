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

    def save_file_streaming(self, org_id, filename):
        """
        Export using streaming generation to minimize memory usage.

        This method generates XML content in chunks and writes directly to file,
        preventing memory accumulation during large IATI project exports.
        Also creates necessary IatiActivityExport records for project tracking.

        :param org_id: String of Organisation id
        :param filename: String of the file name
        :return: File path
        """
        from django.core.files.storage import default_storage, FileSystemStorage
        from akvo.rsr.models.iati_activity_export import IatiActivityExport
        from akvo.rsr.models import IatiExport
        import os

        # Ensure directory exists for FileSystemStorage
        dir_path = f"db/org/{org_id}/iati/"
        if isinstance(default_storage, FileSystemStorage):
            os.makedirs(default_storage.path(dir_path), exist_ok=True)

        file_path = os.path.join(dir_path, filename)

        # Create IatiActivityExport records for each project (maintains compatibility with get_iati_profile_url)
        if self.iati_export:
            for project in self.projects:
                IatiActivityExport.objects.create(
                    iati_export=self.iati_export,
                    project=project,
                    status=IatiExport.STATUS_IN_PROGRESS  # Status 2 - required for get_iati_profile_url()
                )

        # Stream XML directly to file
        with default_storage.open(file_path, "wb") as f:
            for chunk in self.stream_xml():
                f.write(chunk.encode('utf-8'))

        return file_path

    @classmethod
    def create_for_streaming(cls, projects, version='2.03', iati_export=None, excluded_elements=None):
        """
        Create an IatiXML instance optimized for streaming without building the full tree in memory.

        This factory method creates an instance with the minimum setup needed for streaming,
        avoiding the memory-intensive tree construction in __init__.

        :param projects: QuerySet of Projects (will be optimized with prefetch)
        :param version: String of IATI version
        :param iati_export: IatiExport Django object
        :param excluded_elements: List of fieldnames that should be ignored when exporting
        :return: IatiXML instance ready for streaming
        """
        instance = cls.__new__(cls)  # Create instance without calling __init__

        # Set up only the minimal attributes needed for streaming
        if hasattr(projects, 'select_related'):
            # Optimize QuerySet with proper prefetching to prevent N+1 queries
            instance.projects = projects.select_related(
                'primary_location',
                'primary_organisation',
            ).prefetch_related(
                'locations',
                'partnerships__organisation',
                'results__indicators__periods',
                'sectors',
                'documents__categories',
                'transactions',
                'planned_disbursements',
                'related_projects',
            )
        else:
            instance.projects = projects

        instance.version = version
        instance.iati_export = iati_export
        instance.excluded_elements = excluded_elements

        # NOTE: We do NOT create self.iati_activities tree - that's the memory leak source!
        # The streaming methods will generate XML without keeping it in memory

        return instance

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

    def __init__(
            self,
            projects,
            version='2.03',
            iati_export=None,
            excluded_elements=None,
            utc_now: datetime = None,
    ):
        """
        Initialise the IATI XML object, creating a 'iati-activities' etree Element as root.

        :param projects: QuerySet of Projects
        :param version: String of IATI version
        :param iati_export: IatiExport Django object
        :param excluded_elements: List of fieldnames that should be ignored when exporting
        :param utc_now: The current time in UTC. Useful to override in tests for a stable time
        """
        from akvo.rsr.models import IatiExport

        # Optimize QuerySet with proper prefetching to prevent N+1 queries
        if hasattr(projects, 'select_related'):
            # Only optimize if we have a QuerySet, not a list
            self.projects = projects.select_related(
                'primary_location',
                'primary_organisation',
                'primary_organisation__country',
                'currency',
                'language',
            ).prefetch_related(
                'locations',
                'locations__country',
                'partnerships__organisation',
                'partnerships__organisation__country',
                'results__indicators__periods',
                'results__indicators__dimension_names',
                'budgetitems__country',
                'budgetitems__region',
                'sectors',
                'policy_markers',
                'documents__categories',
                'transactions',
                'planned_disbursements',
                'related_projects',
                'project_comments',
                'recipient_countries',
                'recipient_regions',
            )
        else:
            # If it's already a list, use as-is
            self.projects = projects

        self.version = version
        self.iati_export = iati_export
        self.excluded_elements = excluded_elements

        self.iati_activities = etree.Element("iati-activities",
                                             nsmap={'akvo': 'http://akvo.org/iati-activities'})
        self.iati_activities.attrib['version'] = self.version

        utc_now = utc_now or datetime.utcnow()
        self.iati_activities.attrib['generated-datetime'] = utc_now.isoformat("T", "seconds")

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

    def stream_xml(self):
        """
        Stream XML generation with memory monitoring and cleanup.

        This method yields XML content in chunks to prevent memory accumulation
        during large IATI project exports.

        :return: Generator yielding XML content chunks as strings
        """
        # Stream header
        yield from self._stream_activities_header()

        # Stream each project with memory cleanup
        for project in self.projects:
            yield from self._stream_project(project)

        # Stream footer
        yield from self._stream_activities_footer()

    def _stream_activities_header(self):
        """
        Stream XML header and opening iati-activities tag.

        :return: Generator yielding header XML chunks
        """
        yield '<?xml version="1.0" encoding="UTF-8"?>\n'

        # Get datetime for generated-datetime attribute
        utc_now = datetime.utcnow()
        generated_datetime = utc_now.isoformat("T", "seconds")

        # Include namespace mapping for akvo namespace
        yield f'<iati-activities version="{self.version}" generated-datetime="{generated_datetime}" xmlns:akvo="http://akvo.org/iati-activities">'

    def _stream_project(self, project):
        """
        Stream individual project XML with explicit memory cleanup.

        This method processes a single project, converts it to XML,
        and immediately cleans up the element tree to prevent memory accumulation.
        Uses optimized database queries to prevent N+1 query problems.

        :param project: Project object to process (with prefetched relations)
        :return: Generator yielding project XML chunk
        """
        # Create a temporary root with proper namespace map to ensure consistent prefixes
        temp_root = etree.Element("temp", nsmap={'akvo': 'http://akvo.org/iati-activities'})

        # Create project element as child of temp root to inherit namespace map
        project_element = etree.SubElement(temp_root, "iati-activity")

        # Add attributes
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

        # Add child elements using prefetched relationships
        # This prevents N+1 queries since relations are already loaded
        for element in ELEMENTS:
            tree_elements = getattr(elements, element)(project)
            for tree_element in tree_elements:
                project_element.append(tree_element)

        # Convert only the project element to string with proper namespace prefixes
        xml_chunk = etree.tostring(project_element, encoding='unicode', pretty_print=False)

        # Fix namespace prefixes to match traditional implementation
        xml_chunk = self._fix_namespace_prefixes(xml_chunk)

        # Explicit memory cleanup
        temp_root.clear()
        project_element.clear()

        yield xml_chunk

    def _fix_namespace_prefixes(self, xml_string):
        """
        Fix namespace prefixes to ensure akvo namespace uses 'akvo:' instead of auto-generated prefixes.

        This method replaces auto-generated namespace prefixes (ns0, ns1, etc.) with the correct 'akvo' prefix
        and removes redundant namespace declarations.
        """
        import re

        # Replace auto-generated namespace declarations with akvo prefix
        xml_string = re.sub(
            r'xmlns:ns\d+="http://akvo\.org/iati-activities"',
            '',
            xml_string
        )

        # Replace auto-generated namespace prefixes with akvo prefix
        xml_string = re.sub(
            r'ns\d+:(type|label)',
            r'akvo:\1',
            xml_string
        )

        # Remove any empty xmlns attributes that might be left
        xml_string = re.sub(r'\s+xmlns:ns\d+=""', '', xml_string)

        return xml_string

    def _stream_activities_footer(self):
        """
        Stream closing iati-activities tag.

        :return: Generator yielding footer XML chunk
        """
        yield '</iati-activities>'
