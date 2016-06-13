# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import IatiImport, IatiImportJob, Organisation, Project, User
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.test import TestCase


class IatiImportTestCase(TestCase):
    """Tests the IATI import, and validates the data which is imported in the database."""

    def setUp(self):
        """
        In order to correctly test an IATI import, we need the following objects in the database:

        - An organisation with a name, IATI organisation identifier and 'can_create_projects' set
        to True.
        - A user.
        - An IATI import object with a label and user.
        - An IATI import job object with an IATI import and an IATI XML sample file.

        Then we run the IATI import job.
        """

        # Create organisation
        Organisation.objects.create(
            name="Test Organisation Import",
            long_name="Test Organisation for IATI import",
            iati_org_id="NL-KVK-0987654321",
            can_create_projects=True
        )

        # Create (super)user
        user = User.objects.create_superuser(
            username="Super user import",
            email="superuser.import@test.akvo.org",
            password="password"
        )

        # Create IATI import
        iati_import = IatiImport.objects.create(
            label="Test IATI import",
            user=user
        )

        # Create IATI import job
        iati_xml_file = NamedTemporaryFile(delete=True)
        iati_xml_file.write("""<iati-activities generated-datetime="2014-09-10T07:15:37Z"
                version="2.02">
            <iati-activity xml:lang="en" default-currency="USD"
                    last-updated-datetime="2014-09-10T07:15:37Z">
                <iati-identifier>NL-KVK-0987654321-1234</iati-identifier>
                <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
                    <narrative>Test Organisation Import</narrative>
                </reporting-org>
                <title>
                    <narrative>Test project for IATI import</narrative>
                </title>
            </iati-activity>
        </iati-activities>""")
        iati_xml_file.flush()

        iati_import_job = IatiImportJob.objects.create(
            iati_import=iati_import,
            iati_xml_file=File(iati_xml_file)
        )

        # Then run the IATI import job
        iati_import_job.run()

    def test_imported_project_data(self):
        """
        Test if the project is in the database with correct data.
        """

        # Retrieve the project
        project = Project.objects.get(iati_activity_id="NL-KVK-0987654321-1234")

        # Test if the project is an instance of Project
        self.assertIsInstance(project, Project)

        # Test project's data: language, default-currency and title
        self.assertEqual(project.language, "en")
        self.assertEqual(project.currency, "USD")
        self.assertEqual(project.title, "Test project for IATI import")

    def test_imported_organisation_data(self):
        """
        Test if the reporting organisation is in the database with correct data.
        """

        # Retrieve the project
        project = Project.objects.get(iati_activity_id="NL-KVK-0987654321-1234")

        # Test project's reporting organisation
        self.assertEqual(project.partners.count(), 1)
        self.assertEqual(project.partners.first().iati_org_id, "NL-KVK-0987654321")
