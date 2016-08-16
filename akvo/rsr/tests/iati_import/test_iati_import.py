# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import IatiImport, IatiImportJob, Organisation, Project, User, BudgetItemLabel
from akvo.codelists.models import BudgetIdentifier, ResultType, Version

from .xml_files import (IATI_V1_STRING, IATI_V2_STRING, IATI_V2_STRING_INCORRECT, IATI_ICCO_STRING,
                        IATI_CORDAID_STRING)

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
        - Budget item labels 'Total' and 'Other'.
        - A budget identifier code in the IATI codelists.
        - A result type code in the IATI codelists.
        """

        # Create organisation
        Organisation.objects.create(
            name="Test Organisation Import",
            long_name="Test Organisation for IATI import",
            iati_org_id="NL-KVK-0987654321",
            can_create_projects=True
        )

        # Create (super)user
        self.user = User.objects.create_superuser(
            username="Super user import",
            email="superuser.import@test.akvo.org",
            password="password"
        )

        # Create budget item labels
        BudgetItemLabel.objects.create(label="Total")
        BudgetItemLabel.objects.create(label="Other")

        # Create budget identifier code
        iati_version = Version.objects.create(code='2.02')
        BudgetIdentifier.objects.create(version=iati_version, code="1.1.1", name="Codelist name")

        # Create result type code
        ResultType.objects.create(version=iati_version, code="1", name="Output")

    def test_iati_v1_import(self):
        """
        Test the IATI v1 import.
        """
        iati_v1_import = IatiImport.objects.create(label="Test IATI v1 import", user=self.user)
        iati_v1_xml_file = NamedTemporaryFile(delete=True)
        iati_v1_xml_file.write(IATI_V1_STRING)
        iati_v1_xml_file.flush()
        iati_v1_import_job = IatiImportJob.objects.create(iati_import=iati_v1_import,
                                                          iati_xml_file=File(iati_v1_xml_file))
        iati_v1_import_job.run()

        project_v1 = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v1")
        self.assertIsInstance(project_v1, Project)
        self.assertEqual(project_v1.language, "en")
        self.assertEqual(project_v1.currency, "USD")
        self.assertEqual(project_v1.title, "Test project for IATI import v1")
        self.assertEqual(project_v1.partners.count(), 4)
        self.assertEqual(project_v1.reporting_org.iati_org_id, "NL-KVK-0987654321")

    def test_iati_v2_import(self):
        """
        Test the IATI v2 import.
        """
        iati_v2_import = IatiImport.objects.create(label="Test IATI v2 import", user=self.user)
        iati_v2_xml_file = NamedTemporaryFile(delete=True)
        iati_v2_xml_file.write(IATI_V2_STRING)
        iati_v2_xml_file.flush()
        iati_v2_import_job = IatiImportJob.objects.create(iati_import=iati_v2_import,
                                                          iati_xml_file=File(iati_v2_xml_file))
        iati_v2_import_job.run()

        project_v2 = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v2")
        self.assertIsInstance(project_v2, Project)
        self.assertEqual(project_v2.language, "en")
        self.assertEqual(project_v2.currency, "USD")
        self.assertEqual(project_v2.hierarchy, 1)
        self.assertEqual(project_v2.title, "Test project for IATI import v2")
        self.assertEqual(project_v2.partners.count(), 4)
        self.assertEqual(project_v2.reporting_org.iati_org_id, "NL-KVK-0987654321")

    def test_iati_incorrect_import(self):
        """
        Test an IATI import with a lot of incorrect values.
        """
        iati_inc_import = IatiImport.objects.create(label="Test IATI incorrect import",
                                                    user=self.user)
        iati_inc_xml_file = NamedTemporaryFile(delete=True)
        iati_inc_xml_file.write(IATI_V2_STRING_INCORRECT)
        iati_inc_xml_file.flush()
        iati_inc_import_job = IatiImportJob.objects.create(iati_import=iati_inc_import,
                                                           iati_xml_file=File(iati_inc_xml_file))
        iati_inc_import_job.run()

        project_inc = Project.objects.get(iati_activity_id="NL-KVK-0987654321-incorrect")
        self.assertIsInstance(project_inc, Project)
        self.assertEqual(project_inc.language, "en")
        self.assertEqual(project_inc.currency, "USD")
        self.assertEqual(project_inc.hierarchy, None)
        self.assertEqual(project_inc.title, "Test project for IATI import (incorrect)")
        self.assertEqual(project_inc.partners.count(), 1)
        self.assertEqual(project_inc.reporting_org.iati_org_id, "NL-KVK-0987654321")

    def test_iati_icco_import(self):
        """
        Test an IATI import for ICCO.
        """
        iati_icco_import = IatiImport.objects.create(
            label="Test IATI ICCO import", user=self.user, mapper_prefix="ICCO")
        iati_icco_xml_file = NamedTemporaryFile(delete=True)
        iati_icco_xml_file.write(IATI_ICCO_STRING)
        iati_icco_xml_file.flush()
        iati_icco_import_job = IatiImportJob.objects.create(iati_import=iati_icco_import,
                                                            iati_xml_file=File(iati_icco_xml_file))
        iati_icco_import_job.run()

        project_icco = Project.objects.get(iati_activity_id="NL-KVK-0987654321-icco")
        self.assertIsInstance(project_icco, Project)
        self.assertEqual(project_icco.language, "en")
        self.assertEqual(project_icco.currency, "USD")
        self.assertEqual(project_icco.hierarchy, 1)
        self.assertEqual(project_icco.title, "Test project for IATI ICCO import")
        self.assertEqual(project_icco.partners.count(), 4)
        self.assertEqual(project_icco.reporting_org.iati_org_id, "NL-KVK-0987654321")

    def test_iati_cordaid_import(self):
        """
        Test an IATI import for Cordaid.
        """
        # Create business unit, Cordaid and Other organisations
        Organisation.objects.create(
            id=959,
            name="Cordaid business unit",
            long_name="Cordaid business unit",
            iati_org_id="NL-KVK-0987654321-business"
        )
        Organisation.objects.create(
            id=273,
            name="Cordaid",
            long_name="Cordaid",
            iati_org_id="NL-KVK-cordaid"
        )
        Organisation.objects.create(
            id=1653,
            name="Cordaid - Others",
            long_name="Cordaid - Others",
            iati_org_id="NL-KVK-others"
        )

        iati_cordaid_import = IatiImport.objects.create(
            label="Test IATI Cordaid import", user=self.user, mapper_prefix="Cordaid")
        iati_cordaid_xml_file = NamedTemporaryFile(delete=True)
        iati_cordaid_xml_file.write(IATI_CORDAID_STRING)
        iati_cordaid_xml_file.flush()
        iati_cordaid_import_job = IatiImportJob.objects.create(
            iati_import=iati_cordaid_import, iati_xml_file=File(iati_cordaid_xml_file))
        iati_cordaid_import_job.run()

        project_cordaid = Project.objects.get(iati_activity_id="NL-KVK-0987654321-cordaid")
        self.assertIsInstance(project_cordaid, Project)
        self.assertEqual(project_cordaid.language, "en")
        self.assertEqual(project_cordaid.currency, "USD")
        self.assertEqual(project_cordaid.hierarchy, 1)
        self.assertEqual(project_cordaid.title, "Test project for IATI Cordaid import")
        self.assertEqual(project_cordaid.partners.count(), 4)
        self.assertEqual(project_cordaid.reporting_org.iati_org_id, "NL-KVK-0987654321")
