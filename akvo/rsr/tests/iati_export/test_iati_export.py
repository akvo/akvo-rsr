# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.iati.exports.iati_export import IatiXML
from akvo.rsr.models import IatiExport, Organisation, Partnership, Project, User

from django.test import TestCase

from lxml import etree
from xmlunittest import XmlTestMixin


class IatiExportTestCase(TestCase, XmlTestMixin):
    """Tests the IATI export, and validates the XML file which is outputted."""

    def setUp(self):
        """
        In order to correctly test an IATI export, we need the following objects in the database:

        - An organisation with a name, IATI organisation identifier and 'can_create_projects' set
        to True.
        - A user.
        - A project with a title and IATI identifier.
        - A reporting partnership between the project and organisation.
        - An IATI export object with a reporting organisation, user and a project.

        Then we run the IATI export.
        """

        # Create organisation
        reporting_org = Organisation.objects.create(
            name="Test Organisation Export",
            long_name="Test Organisation for IATI export",
            iati_org_id="NL-KVK-1234567890",
            can_create_projects=True
        )

        # Create (super)user
        user = User.objects.create_superuser(
            username="Super user export",
            email="superuser.export@test.akvo.org",
            password="password"
        )

        # Create project
        project = Project.objects.create(
            title="Test project for IATI export",
            subtitle="Test project for IATI export (subtitle)",
            iati_activity_id="NL-KVK-1234567890-1234",
        )

        # Create partnership
        Partnership.objects.create(
            organisation=reporting_org,
            project=project,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
        )

        # Create IATI export
        iati_export = IatiExport.objects.create(
            reporting_organisation=reporting_org,
            user=user
        )

        # Add a project to the IATI export
        iati_export.projects.add(project)

        # Run IATI export
        iati_export.create_iati_file()

        # In order to easily access the XML file, generate the IATI file again
        tmp_iati_xml = IatiXML(iati_export.projects.all(), iati_export.version, iati_export)
        self.iati_xml = etree.tostring(tmp_iati_xml.iati_activities)

    def test_status(self):
        """
        Test if the status of the export is set to completed.
        """

        # Retrieve the latest IATI export
        iati_export = IatiExport.objects.order_by('-id').first()

        # Test if status is set to completed.
        self.assertEqual(iati_export.status, 3)

    def test_existing_xml(self):
        """
        Test if the export has an XML file.
        """
        # Retrieve the latest IATI export
        iati_export = IatiExport.objects.order_by('-id').first()

        # Test if export has an XML file
        self.assertNotEqual(iati_export.iati_file, '')

    def test_valid_xml(self):
        """
        Test if the XML is valid.
        """
        # Test if XML is valid
        root_test = self.assertXmlDocument(self.iati_xml)

        # Test if the root's tag name is 'iati-activities'
        self.assertXmlNode(root_test, tag='iati-activities')

        # Test if the root has attributes 'generated-datetime' and 'version'
        self.assertXmlHasAttribute(root_test, 'generated-datetime')
        self.assertXmlHasAttribute(root_test, 'version')

        # Test if the root has correct child nodes: 'iati-activity' with an 'iati-identifier',
        # 'reporting-org' and 'title'
        self.assertXpathsExist(root_test, ('./iati-activity',
                                           './iati-activity/iati-identifier',
                                           './iati-activity/reporting-org',
                                           './iati-activity/title'))
