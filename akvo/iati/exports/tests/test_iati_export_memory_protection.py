# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest.mock import patch, MagicMock
from datetime import datetime
from lxml import etree

from django.test import override_settings

from akvo.rsr.tests.base import BaseTestCase
from akvo.iati.exports.iati_export import (
    IatiXML,
    save_iati_xml_streaming,
    IATI_EXPORT_CHUNK_SIZE,
    DEFAULT_IATI_EXPORT_CHUNK_SIZE
)


class IatiExportMemoryProtectionTestCase(BaseTestCase):
    """Test memory protection features in IATI XML export"""

    def setUp(self):
        """Set up test data"""
        super().setUp()
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)
        self.org = self.create_organisation('Test Organisation')

        # Create a small number of projects for testing
        self.projects = []
        for i in range(5):
            project = self.create_project(f'Test Project {i+1}')
            self.projects.append(project)

    def test_configuration_constants(self):
        """Test that configuration constants are properly set"""
        self.assertEqual(DEFAULT_IATI_EXPORT_CHUNK_SIZE, 100)
        self.assertIsInstance(IATI_EXPORT_CHUNK_SIZE, int)
        self.assertGreater(IATI_EXPORT_CHUNK_SIZE, 0)

    @override_settings(RSR_IATI_EXPORT_CHUNK_SIZE=50)
    def test_settings_override(self):
        """Test that settings can override default chunk size"""
        # Reload the module to pick up new settings
        import importlib
        import akvo.iati.exports.iati_export
        importlib.reload(akvo.iati.exports.iati_export)

        from akvo.iati.exports.iati_export import IATI_EXPORT_CHUNK_SIZE
        self.assertEqual(IATI_EXPORT_CHUNK_SIZE, 50)

    def test_small_export_uses_traditional_mode(self):
        """Test that small exports use traditional in-memory mode"""
        from akvo.rsr.models import Project

        # Create a small queryset
        small_projects = Project.objects.filter(id__in=[p.id for p in self.projects[:3]])

        iati_xml = IatiXML(small_projects)

        # Should use traditional mode for small exports
        self.assertFalse(iati_xml._use_streaming)
        self.assertIsNotNone(iati_xml.iati_activities)

    @override_settings(RSR_IATI_EXPORT_CHUNK_SIZE=2)
    def test_large_export_uses_streaming_mode(self):
        """Test that large exports automatically use streaming mode"""
        # Reload the module to pick up new settings
        import importlib
        import akvo.iati.exports.iati_export
        importlib.reload(akvo.iati.exports.iati_export)

        from akvo.rsr.models import Project
        from akvo.iati.exports.iati_export import IatiXML

        # Create a queryset larger than chunk size (5 > 2)
        large_projects = Project.objects.filter(id__in=[p.id for p in self.projects])

        iati_xml = IatiXML(large_projects)

        # Should use streaming mode for large exports
        self.assertTrue(iati_xml._use_streaming)
        self.assertIsNotNone(iati_xml.iati_activities_root)

    def test_chunked_projects_method(self):
        """Test the _chunked_projects method"""
        from akvo.rsr.models import Project

        projects = Project.objects.filter(id__in=[p.id for p in self.projects])
        iati_xml = IatiXML(projects)

        # Test chunking with size 2
        chunks = list(iati_xml._chunked_projects(projects, 2))

        # Should have 3 chunks (2+2+1)
        self.assertEqual(len(chunks), 3)
        self.assertEqual(len(chunks[0]), 2)
        self.assertEqual(len(chunks[1]), 2)
        self.assertEqual(len(chunks[2]), 1)

    def test_chunked_projects_empty_queryset(self):
        """Test chunked projects with empty queryset"""
        from akvo.rsr.models import Project

        empty_projects = Project.objects.none()
        iati_xml = IatiXML(empty_projects)

        # Should return no chunks
        chunks = list(iati_xml._chunked_projects(empty_projects, 10))
        self.assertEqual(len(chunks), 0)

    def test_create_project_element_method(self):
        """Test the _create_project_element method"""
        from akvo.rsr.models import Project

        projects = Project.objects.filter(id__in=[p.id for p in self.projects[:1]])
        iati_xml = IatiXML(projects)

        # Test creating a project element
        project = self.projects[0]
        project_element = iati_xml._create_project_element(project)

        # Should create a valid XML element
        self.assertIsInstance(project_element, etree._Element)
        self.assertEqual(project_element.tag, "iati-activity")

    def test_generate_project_elements_method(self):
        """Test the _generate_project_elements generator"""
        from akvo.rsr.models import Project

        projects = Project.objects.filter(id__in=[p.id for p in self.projects[:3]])
        iati_xml = IatiXML(projects)
        iati_xml._use_streaming = True  # Force streaming mode

        # Test the generator
        elements = list(iati_xml._generate_project_elements())

        # Should generate elements for all projects
        self.assertEqual(len(elements), 3)
        for element in elements:
            self.assertIsInstance(element, etree._Element)
            self.assertEqual(element.tag, "iati-activity")

    @patch('akvo.iati.exports.iati_export.default_storage')
    def test_save_iati_xml_streaming_function(self, mock_storage):
        """Test the save_iati_xml_streaming function"""
        # Mock file operations
        mock_file = MagicMock()
        mock_storage.open.return_value.__enter__.return_value = mock_file
        mock_storage.path.return_value = '/fake/path'

        # Create a root element
        root_element = etree.Element("iati-activities", nsmap={'akvo': 'http://akvo.org/iati-activities'})
        root_element.attrib['version'] = '2.03'
        root_element.attrib['generated-datetime'] = '2023-01-01T00:00:00'

        # Create a generator of project elements
        def project_generator():
            for i in range(3):
                project_element = etree.Element("iati-activity")
                project_element.text = f"Project {i+1}"
                yield project_element

        # Test the streaming save function
        result_path = save_iati_xml_streaming(
            "test/dir",
            "test.xml",
            root_element,
            project_generator()
        )

        # Should call file operations correctly
        mock_storage.open.assert_called_once_with("test/dir/test.xml", "wb")
        self.assertGreater(mock_file.write.call_count, 1)  # Should write multiple times
        self.assertEqual(result_path, "test/dir/test.xml")

    @override_settings(RSR_IATI_EXPORT_CHUNK_SIZE=2)
    def test_streaming_mode_with_iati_export_tracking(self):
        """Test streaming mode properly tracks IATI activity exports"""
        # Reload the module to pick up new settings
        import importlib
        import akvo.iati.exports.iati_export
        importlib.reload(akvo.iati.exports.iati_export)

        from akvo.rsr.models import Project, IatiExport
        from akvo.iati.exports.iati_export import IatiXML

        # Create an IATI export object
        iati_export = IatiExport.objects.create(
            reporting_organisation=self.org,
            user=self.user,
            version='2.03'
        )

        projects = Project.objects.filter(id__in=[p.id for p in self.projects[:3]])
        iati_export.projects.set(projects)

        # Test with streaming mode (3 > 2)
        iati_xml = IatiXML(projects, iati_export=iati_export)

        # Should use streaming mode
        self.assertTrue(iati_xml._use_streaming)

        # Test the generator creates tracking records
        elements = list(iati_xml._generate_project_elements())
        self.assertEqual(len(elements), 3)

    def test_backward_compatibility_with_traditional_export(self):
        """Test that traditional exports still work for backward compatibility"""
        from akvo.rsr.models import Project

        # Use a small queryset to trigger traditional mode
        small_projects = Project.objects.filter(id__in=[p.id for p in self.projects[:2]])

        iati_xml = IatiXML(small_projects)

        # Should use traditional mode
        self.assertFalse(iati_xml._use_streaming)

        # Should have projects added to the tree
        self.assertEqual(len(iati_xml.iati_activities), 2)

    @patch('akvo.iati.exports.iati_export.save_iati_xml')
    @patch('akvo.iati.exports.iati_export.save_iati_xml_streaming')
    def test_save_file_method_routing(self, mock_streaming_save, mock_traditional_save):
        """Test that save_file method routes to correct implementation"""
        from akvo.rsr.models import Project

        projects = Project.objects.filter(id__in=[p.id for p in self.projects[:2]])

        # Test traditional mode
        iati_xml = IatiXML(projects)
        iati_xml._use_streaming = False

        mock_traditional_save.return_value = "traditional_path.xml"
        result = iati_xml.save_file("123", "test.xml")

        mock_traditional_save.assert_called_once()
        mock_streaming_save.assert_not_called()
        self.assertEqual(result, "traditional_path.xml")

        # Reset mocks
        mock_traditional_save.reset_mock()
        mock_streaming_save.reset_mock()

        # Test streaming mode
        iati_xml._use_streaming = True
        mock_streaming_save.return_value = "streaming_path.xml"
        result = iati_xml.save_file("123", "test.xml")

        mock_streaming_save.assert_called_once()
        mock_traditional_save.assert_not_called()
        self.assertEqual(result, "streaming_path.xml")

    def test_memory_efficient_chunking_boundaries(self):
        """Test chunking works correctly at boundaries"""
        from akvo.rsr.models import Project

        projects = Project.objects.filter(id__in=[p.id for p in self.projects])
        iati_xml = IatiXML(projects)

        # Test with exact chunk size
        chunks = list(iati_xml._chunked_projects(projects, 5))
        self.assertEqual(len(chunks), 1)
        self.assertEqual(len(chunks[0]), 5)

        # Test with chunk size larger than data
        chunks = list(iati_xml._chunked_projects(projects, 10))
        self.assertEqual(len(chunks), 1)
        self.assertEqual(len(chunks[0]), 5)

        # Test with chunk size of 1
        chunks = list(iati_xml._chunked_projects(projects, 1))
        self.assertEqual(len(chunks), 5)
        for chunk in chunks:
            self.assertEqual(len(chunk), 1)

    @override_settings(RSR_IATI_EXPORT_CHUNK_SIZE=1)
    def test_streaming_mode_triggers_correctly(self):
        """Test that streaming mode triggers at the correct threshold"""
        # Reload the module to pick up new settings
        import importlib
        import akvo.iati.exports.iati_export
        importlib.reload(akvo.iati.exports.iati_export)

        from akvo.rsr.models import Project
        from akvo.iati.exports.iati_export import IatiXML

        # Single project should not trigger streaming (1 == 1, not > 1)
        single_project = Project.objects.filter(id=self.projects[0].id)
        iati_xml = IatiXML(single_project)
        self.assertFalse(iati_xml._use_streaming)

        # Two projects should trigger streaming with chunk size 1 (2 > 1)
        two_projects = Project.objects.filter(id__in=[p.id for p in self.projects[:2]])
        iati_xml = IatiXML(two_projects)
        self.assertTrue(iati_xml._use_streaming)

    def test_root_element_attributes_preserved(self):
        """Test that root element attributes are preserved in streaming mode"""
        from akvo.rsr.models import Project

        projects = Project.objects.filter(id__in=[p.id for p in self.projects[:2]])
        test_datetime = datetime(2023, 1, 1, 12, 0, 0)

        iati_xml = IatiXML(projects, version='2.02', utc_now=test_datetime)

        # Check attributes are set correctly
        root = iati_xml.iati_activities_root
        self.assertEqual(root.attrib['version'], '2.02')
        self.assertEqual(root.attrib['generated-datetime'], '2023-01-01T12:00:00')
        self.assertIn('akvo', root.nsmap)
        self.assertEqual(root.nsmap['akvo'], 'http://akvo.org/iati-activities')
