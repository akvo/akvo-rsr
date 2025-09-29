# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""
Simple test to verify IATI streaming compatibility produces equivalent XML documents.
"""

from lxml import etree

from akvo.iati.exports.iati_export import IatiXML
from akvo.rsr.models import Project, IatiExport
from akvo.rsr.tests.base import BaseTestCase


class IatiStreamingSimpleTestCase(BaseTestCase):
    """Simple test case to verify IATI streaming implementation produces valid equivalent XML."""

    def setUp(self):
        """Set up test data."""
        super().setUp()

        # Create test user
        self.user = self.create_user('test@streaming.org', 'password')

        # Create test organization
        self.org = self.create_organisation("Streaming Test Org")
        self.org.iati_org_id = "STREAM-TEST-001"
        self.org.save()

        # Create test project
        self.project = self.create_project("Streaming Test Project")
        self.project.iati_activity_id = "STREAM-TEST-PROJECT-001"
        self.project.currency = "USD"
        self.project.language = "en"
        self.project.primary_organisation = self.org
        self.project.save()

        # Create projects queryset
        self.projects = Project.objects.filter(id=self.project.id)

        # Create IATI export
        self.iati_export = IatiExport.objects.create(
            reporting_organisation=self.org,
            user=self.user,
            version="2.03"
        )
        self.iati_export.projects.add(self.project)

    def test_both_methods_produce_valid_xml(self):
        """Test that both traditional and streaming methods produce valid XML."""

        # Generate traditional IATI XML
        traditional_xml = IatiXML(self.projects, "2.03", self.iati_export)

        # Generate streaming IATI XML
        streaming_xml = IatiXML.create_for_streaming(self.projects, "2.03", self.iati_export)
        streaming_chunks = list(streaming_xml.stream_xml())
        streaming_content = ''.join(streaming_chunks)

        # Remove XML declaration for parsing
        if streaming_content.startswith('<?xml'):
            streaming_content = streaming_content.split('\n', 1)[1]

        # Both should be valid XML
        try:
            traditional_root = traditional_xml.iati_activities
            streaming_root = etree.fromstring(streaming_content)
        except etree.XMLSyntaxError as e:
            self.fail(f"Generated XML is not valid: {e}")

        # Both should contain our test project
        traditional_activities = traditional_root.xpath('//iati-activity')
        streaming_activities = streaming_root.xpath('//iati-activity')

        self.assertEqual(len(traditional_activities), 1)
        self.assertEqual(len(streaming_activities), 1)

        # Both should have same IATI identifier
        traditional_id = traditional_activities[0].xpath('iati-identifier/text()')[0]
        streaming_id = streaming_activities[0].xpath('iati-identifier/text()')[0]
        self.assertEqual(traditional_id, streaming_id)
        self.assertEqual(traditional_id, "STREAM-TEST-PROJECT-001")

        # Both should have same project title
        traditional_title = traditional_activities[0].xpath('title/narrative/text()')[0]
        streaming_title = streaming_activities[0].xpath('title/narrative/text()')[0]
        self.assertEqual(traditional_title, streaming_title)
        self.assertEqual(traditional_title, "Streaming Test Project")

    def test_streaming_chunks_are_progressive(self):
        """Test that streaming yields progressive chunks (memory efficiency)."""

        streaming_xml = IatiXML.create_for_streaming(self.projects, "2.03", self.iati_export)

        chunks = list(streaming_xml.stream_xml())

        # Should get multiple chunks, demonstrating streaming behavior
        self.assertGreater(len(chunks), 1, "Should generate multiple chunks for streaming")

        # Reassemble all chunks to full content
        full_content = ''.join(chunks)

        # Full content should be valid XML
        try:
            # Remove XML declaration for parsing
            if full_content.startswith('<?xml'):
                xml_content = full_content.split('\n', 1)[1]
            else:
                xml_content = full_content
            root = etree.fromstring(xml_content)
            activities = root.xpath('//iati-activity')
            self.assertEqual(len(activities), 1)
        except etree.XMLSyntaxError as e:
            self.fail(f"Reassembled streaming XML is not valid: {e}")

        # Content should contain our test project
        self.assertIn('STREAM-TEST-PROJECT-001', full_content)
        self.assertIn('Streaming Test Project', full_content)

        # Should contain proper IATI structure
        self.assertIn('<iati-activities', full_content)
        self.assertIn('</iati-activities>', full_content)
        self.assertIn('<iati-activity', full_content)
        self.assertIn('</iati-activity>', full_content)

    def test_streaming_maintains_business_logic(self):
        """Test that streaming method maintains the same business logic as traditional method."""

        # Clear any existing activity exports
        from akvo.rsr.models.iati_activity_export import IatiActivityExport
        IatiActivityExport.objects.filter(iati_export=self.iati_export).delete()

        # Clear any existing activity exports before running the test

        # Verify no activity exports exist yet
        activity_exports_before = IatiActivityExport.objects.filter(iati_export=self.iati_export).count()
        self.assertEqual(activity_exports_before, 0)

        # Simulate the complete export process using the IatiExport.create_iati_file method
        # This ensures all the business logic steps are followed correctly
        from unittest import mock
        with mock.patch('akvo.iati.exports.iati_export.default_storage') as mock_storage:
            mock_storage.open.return_value.__enter__.return_value.write = mock.Mock()
            mock_storage.path.return_value = "/mock/path"

            # Use the actual create_iati_file method which calls our streaming implementation
            self.iati_export.create_iati_file()

        # Verify activity exports were created
        activity_exports_after = IatiActivityExport.objects.filter(iati_export=self.iati_export)
        self.assertEqual(activity_exports_after.count(), 1)

        # Verify the export is for our project and has correct status
        activity_export = activity_exports_after.first()
        self.assertEqual(activity_export.project, self.project)
        self.assertEqual(activity_export.status, 2)  # STATUS_IN_PROGRESS

        # Refresh the export to get updated status
        self.iati_export.refresh_from_db()

        # Verify the export is marked as latest (required for profile URL)
        self.assertTrue(self.iati_export.latest)

        # Verify profile URL generation works (the key business requirement)
        profile_url = self.project.get_iati_profile_url()
        self.assertIsNotNone(profile_url)
        self.assertIn("STREAM-TEST-001", profile_url)  # org IATI ID
        self.assertIn("STREAM-TEST-PROJECT-001", profile_url)  # activity IATI ID
