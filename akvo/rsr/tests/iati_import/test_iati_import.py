# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
from datetime import datetime

from akvo.rsr.models import IatiImport, IatiImportJob, Organisation, Project, User, BudgetItemLabel
from akvo.codelists.models import BudgetIdentifier, Currency, ResultType, Version
from akvo.rsr.models import RelatedProject

from .xml_files import (IATI_V1_STRING, IATI_V2_STRING, IATI_V2_STRING_INCORRECT, IATI_ICCO_STRING,
                        IATI_CORDAID_STRING, IATI_V2_RESULT_ONLY, IATI_PARTIAL_IMPORT)

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
        BudgetItemLabel.objects.create(label="Subtotal")

        # Create budget identifier code
        iati_version = Version.objects.create(code='2.02')
        BudgetIdentifier.objects.create(version=iati_version, code="1.1.1", name="Codelist name")

        # Create result type code
        ResultType.objects.create(version=iati_version, code="1", name="Output")

        # Create a pair of Currency codelist objects for use in the transaction import
        Currency.objects.create(code='EUR', name=u'Euro', version=iati_version)
        Currency.objects.create(code='USD', name=u'US Dollar', version=iati_version)

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
        transaction_1 = project_v1.transactions.get(reference='1234')
        transaction_2 = project_v1.transactions.get(reference='4321')
        self.assertIsInstance(project_v1, Project)
        self.assertEqual(project_v1.language, "en")
        self.assertEqual(project_v1.currency, "USD")
        self.assertEqual(project_v1.title, "Test project for IATI import v1")
        self.assertEqual(project_v1.date_start_planned, datetime(2012, 04, 15).date())
        self.assertEqual(project_v1.date_start_actual, datetime(2012, 04, 28).date())
        self.assertEqual(project_v1.date_end_planned, datetime(2015, 12, 31).date())
        self.assertEqual(project_v1.date_end_actual, datetime(2015, 12, 31).date())
        self.assertEqual(project_v1.partners.count(), 4)
        self.assertEqual(project_v1.transactions.count(), 2)
        self.assertEqual(project_v1.transactions.count(), 2)
        self.assertEqual(project_v1.reporting_org.iati_org_id, "NL-KVK-0987654321")

        self.assertEqual(transaction_1.reference, '1234')
        self.assertEqual(transaction_1.currency, 'EUR')
        self.assertEqual(transaction_1.iati_currency(), u'Euro')
        self.assertEqual(transaction_2.reference, '4321')
        self.assertEqual(transaction_2.currency, 'USD')
        self.assertEqual(transaction_2.iati_currency(), u'US Dollar')

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
        self.assertEqual(project_v2.date_start_planned, datetime(2012, 04, 15).date())
        self.assertEqual(project_v2.date_start_actual, datetime(2012, 04, 28).date())
        self.assertEqual(project_v2.date_end_planned, datetime(2015, 12, 31).date())
        self.assertEqual(project_v2.date_end_actual, datetime(2015, 12, 31).date())
        self.assertEqual(project_v2.partners.count(), 4)
        self.assertEqual(project_v2.transactions.count(), 1)
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

    def test_iati_result_only_import(self):
        """
        Test an IATI import only importing Result.
        """
        iati_v2_import = IatiImport.objects.create(label="Test IATI v2 import", user=self.user)
        iati_v2_xml_file = NamedTemporaryFile(delete=True)
        iati_v2_xml_file.write(IATI_V2_STRING)
        iati_v2_xml_file.flush()
        iati_v2_import_job = IatiImportJob.objects.create(iati_import=iati_v2_import,
                                                          iati_xml_file=File(iati_v2_xml_file))
        iati_v2_import_job.run()

        project_v2 = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v2")
        self.assertEqual(project_v2.results.count(), 1)

        result_only_import = IatiImport.objects.create(
            label="Test IATI Result only import", user=self.user, mapper_prefix="Result_only")
        result_only_xml_file = NamedTemporaryFile(delete=True)
        result_only_xml_file.write(IATI_V2_RESULT_ONLY)
        result_only_xml_file.flush()
        result_only_import_job = IatiImportJob.objects.create(iati_import=result_only_import,
                                                              iati_xml_file=File(result_only_xml_file))
        result_only_import_job.run()

        project_result_only = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v2")
        self.assertIsInstance(project_result_only, Project)
        self.assertEqual(project_result_only.language, "en")
        self.assertEqual(project_result_only.currency, "USD")
        self.assertEqual(project_result_only.hierarchy, 1)
        self.assertEqual(project_result_only.title, "Test project for IATI import v2")
        self.assertEqual(project_result_only.partners.count(), 4)
        self.assertEqual(project_result_only.transactions.count(), 1)
        self.assertEqual(project_result_only.reporting_org.iati_org_id, "NL-KVK-0987654321")
        self.assertEqual(project_result_only.results.count(), 2)
        result_1 = project_result_only.results.get(title="Result title")
        self.assertEqual(result_1.indicators.count(), 1)
        self.assertEqual(result_1.indicators.all()[0].periods.all()[0].actual_value, u'22')

        result_2 = project_result_only.results.get(title="New result title")
        self.assertEqual(result_2.indicators.count(), 2)

    def test_partial_iati_import(self):
        """
        Test an IATI import that ignores certain elements

        Ignore the data if the akvo:import attribute set to falsey values, i.e. "false", "no", "f"
        or "0". Elements that support this are: budget, contact-info, humanitarian-scope,
        legacy-data, location, participating-org, planned-disbursement, policy-marker,
        recipient-country, recipient-region, related-activity, result, sector and transaction
        """
        # import a project
        iati_v2_import = IatiImport.objects.create(label="Test IATI v2 import", user=self.user)
        iati_v2_xml_file = NamedTemporaryFile(delete=True)
        iati_v2_xml_file.write(IATI_V2_STRING)
        iati_v2_xml_file.flush()
        iati_v2_import_job = IatiImportJob.objects.create(iati_import=iati_v2_import,
                                                          iati_xml_file=File(iati_v2_xml_file))
        iati_v2_import_job.run()

        project_v2 = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v2")

        self.assertEqual(project_v2.contacts.count(), 1)
        contact_info = project_v2.contacts.all()[0]
        self.assertEqual(contact_info.organisation, "Agency A")
        self.assertEqual(contact_info.department, "Department B")

        self.assertEqual(project_v2.locations.count(), 2)
        location_1 = project_v2.locations.get(reference="AF-KAN")
        location_2 = project_v2.locations.get(reference="KH-PNH")
        self.assertEqual(location_1.location_code, "1453782")
        self.assertEqual(location_2.location_code, "1821306")

        # do a new import to the same project, with contact and location elements having
        # akvo:import="false"
        partial_import = IatiImport.objects.create(
            label="Test partial IATI import", user=self.user)
        partial_import_xml_file = NamedTemporaryFile(delete=True)
        partial_import_xml_file.write(IATI_PARTIAL_IMPORT)
        partial_import_xml_file.flush()
        partial_import_job = IatiImportJob.objects.create(
            iati_import=partial_import, iati_xml_file=File(partial_import_xml_file))
        partial_import_job.run()

        project_partial_import = Project.objects.get(iati_activity_id="NL-KVK-0987654321-v2")
        self.assertIsInstance(project_partial_import, Project)

        # Assert that no data has changed, even if the XML has
        self.assertEqual(project_v2.results.count(), 1)
        result_1 = project_v2.results.get(title="Result title")
        self.assertEqual(result_1.indicators.count(), 1)
        self.assertEqual(result_1.indicators.all()[0].periods.all()[0].actual_value, u'11')

        self.assertEqual(project_v2.contacts.count(), 1)
        contact_info = project_v2.contacts.all()[0]
        self.assertEqual(contact_info.organisation, "Agency A")
        self.assertEqual(contact_info.department, "Department B")

        self.assertEqual(project_v2.locations.count(), 2)
        location_1 = project_v2.locations.get(reference="AF-KAN")
        location_2 = project_v2.locations.get(reference="KH-PNH")
        self.assertEqual(location_1.location_code, "1453782")
        self.assertEqual(location_2.location_code, "1821306")

        self.assertEqual(project_v2.humanitarian_scopes.count(), 2)
        humanitarian_scope_1 = project_v2.humanitarian_scopes.get(vocabulary="1-2")
        humanitarian_scope_2 = project_v2.humanitarian_scopes.get(vocabulary="99")
        self.assertEqual(humanitarian_scope_1.code, "2015-000050")
        self.assertEqual(humanitarian_scope_2.vocabulary_uri, "http://example.com/vocab.html")

        # three participating orgs, and one reporting org
        self.assertEqual(project_v2.partners.count(), 4)
        self.assertEqual(project_v2.planned_disbursements.count(), 2)
        self.assertEqual(project_v2.policy_markers.count(), 3)
        self.assertEqual(project_v2.recipient_countries.count(), 2)
        self.assertEqual(project_v2.recipient_regions.count(), 3)

        related_project_1 = project_v2.related_projects.get(
            related_iati_id="AA-AAA-123456789-6789")
        self.assertIsInstance(related_project_1, RelatedProject)
        self.assertEqual(project_v2.sectors.count(), 3)
        self.assertEqual(project_v2.transactions.count(), 1)
        self.assertEqual(project_v2.budget_items.count(), 1)
