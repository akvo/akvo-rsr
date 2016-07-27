# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import IatiImport, IatiImportJob, Organisation, Project, User

from .xml_files import IATI_V1_STRING, IATI_V2_STRING

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

        # Create IATI v1 import, import job and run the job
        iati_v1_import = IatiImport.objects.create(label="Test IATI v1 import", user=user)
        iati_v1_xml_file = NamedTemporaryFile(delete=True)
        iati_v1_xml_file.write(IATI_V1_STRING)
        iati_v1_xml_file.flush()
        iati_v1_import_job = IatiImportJob.objects.create(iati_import=iati_v1_import,
                                                          iati_xml_file=File(iati_v1_xml_file))
        iati_v1_import_job.run()

        # Create IATI v2 import, import job and run the job
        iati_v2_import = IatiImport.objects.create(label="Test IATI v2 import", user=user)
        iati_v2_xml_file = NamedTemporaryFile(delete=True)
        iati_v2_xml_file.write(IATI_V2_STRING)
        iati_v2_xml_file.flush()
        iati_v2_import_job = IatiImportJob.objects.create(iati_import=iati_v2_import,
                                                          iati_xml_file=File(iati_v2_xml_file))
        iati_v2_import_job.run()

    def test_imported_project_data(self):
        """
        Test if the project is in the database with correct data.
        """

        # Retrieve the projects
        project_v1 = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v1")
        project_v2 = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v2")

        # Test if the projects are an instance of Project
        self.assertIsInstance(project_v1, Project)
        self.assertIsInstance(project_v2, Project)

        # Test projects' data: language, default-currency and title
        self.assertEqual(project_v1.language, "en")
        self.assertEqual(project_v2.language, "en")
        self.assertEqual(project_v1.currency, "USD")
        self.assertEqual(project_v2.currency, "USD")
        self.assertEqual(project_v1.title, "Test project for IATI import v1")
        self.assertEqual(project_v2.title, "Test project for IATI import v2")

    def test_imported_organisation_data(self):
        """
        Test if the reporting organisation is in the database with correct data.
        """

        # Retrieve the projects
        project_v1 = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v1")
        project_v2 = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v2")

        # Test projects' partners
        self.assertEqual(project_v1.partners.count(), 4)
        self.assertEqual(project_v2.partners.count(), 4)
        self.assertEqual(project_v1.reporting_org.iati_org_id, "NL-KVK-0987654321")
        self.assertEqual(project_v2.reporting_org.iati_org_id, "NL-KVK-0987654321")
