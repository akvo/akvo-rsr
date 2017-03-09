# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
import os

from akvo.iati.checks.iati_checks import IatiChecks
from akvo.rsr.models import (Partnership, Project, ProjectCondition, LegacyData, RecipientCountry,
                             RelatedProject, Sector, RecipientRegion, PolicyMarker,
                             HumanitarianScope, CountryBudgetItem, Fss, FssForecast, BudgetItem,
                             BudgetItemLabel, ProjectContact, PlannedDisbursement, Link,
                             ProjectDocument, ProjectDocumentCategory, ProjectUpdate,
                             ProjectLocation, AdministrativeLocation, CrsAdd, CrsAddOtherFlag,
                             Transaction, TransactionSector, Result, Indicator, IndicatorPeriod,
                             IndicatorPeriodActualDimension, IndicatorPeriodActualLocation,
                             IndicatorPeriodTargetDimension, IndicatorPeriodTargetLocation,
                             IndicatorReference, Organisation, User)

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase


class IatiChecksTestCase(TestCase):
    """Tests the IATI checks."""

    def setUp(self):
        """
        In order to correctly test an IATI export, we need the following objects in the database:

        - An organisation with a name, IATI organisation identifier and 'can_create_projects' set
        to True.
        - A user.
        """

        # Create organisation
        self.reporting_org = Organisation.objects.create(
            name="Test Organisation Export",
            long_name="Test Organisation for IATI export",
            iati_org_id="NL-KVK-1234567890",
            can_create_projects=True,
            new_organisation_type=22
        )

        # Create (super)user
        self.user = User.objects.create_superuser(
            username="Super user export",
            email="superuser.export@test.akvo.org",
            password="password"
        )

        # Set test image path
        base_image_path = '/var/akvo/rsr/code/'
        if 'TRAVIS' in os.environ:
            base_image_path = '/home/travis/build/akvo/akvo-rsr/'
        self.image_path = base_image_path + 'akvo/rsr/tests/iati_export/test_image.jpg'

    def test_iati_checks_empty_project(self):
        """
        Test the checks of an empty project.
        """
        # Create empty project
        empty_project = Project.objects.create()

        # Create IATI checks
        iati_checks = IatiChecks(empty_project)
        all_checks_passed, checks_results = iati_checks.perform_checks()

        # Test the IATI checks
        self.assertFalse(all_checks_passed)

    def test_iati_checks_correct_project(self):
        """
        Test the checks of a correctly filled project.
        """
        # Create a filled project
        project = Project.objects.create(
            title="Test project for IATI export",
            subtitle="Test project for IATI export (subtitle)",
            iati_activity_id="NL-KVK-IatiChecks",
            language="en",
            hierarchy=1,
            humanitarian=True,
            default_tied_status="1",
            default_flow_type="1",
            default_finance_type="1",
            default_aid_type="1",
            collaboration_type="1",
            capital_spend_percentage=100,
            iati_status="1",
            project_scope="1",
            project_plan_summary="Project summary",
            goals_overview="Goals overview",
            current_status="Current status",
            project_plan="Project plan",
            sustainability="Sustainability",
            background="Background",
            target_group="Target group",
            date_start_planned=datetime.date.today(),
            date_start_actual=datetime.date.today() - datetime.timedelta(days=2),
            date_end_planned=datetime.date.today() - datetime.timedelta(days=1),
            date_end_actual=datetime.date.today() - datetime.timedelta(days=1),
            country_budget_vocabulary="1",
            current_image=SimpleUploadedFile(
                name='test_image.jpg',
                content=open(self.image_path, 'rb').read(),
                content_type='image/jpeg'
            ),
            current_image_caption="Caption",
            current_image_credit="Credit",
        )

        # Create another project
        related_project = Project.objects.create(
            title="Test related project for IATI export",
            iati_activity_id="NL-KVK-1234567890-12345",
        )

        # Create partnership
        Partnership.objects.create(
            organisation=self.reporting_org,
            project=project,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
            internal_id="123"
        )

        # Create another partnership
        Partnership.objects.create(
            organisation=self.reporting_org,
            project=project,
            iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER,
            iati_activity_id="NL-KVK-Test"
        )

        # Add project condition
        ProjectCondition.objects.create(
            project=project,
            type="1",
            text="Test condition"
        )

        # Add legacy data
        LegacyData.objects.create(
            project=project,
            name="Name",
            value="Value",
            iati_equivalent="IATI equivalent"
        )

        # Add recipient country
        RecipientCountry.objects.create(
            project=project,
            country="NL",
            percentage=50,
            text="The Netherlands"
        )
        RecipientCountry.objects.create(
            project=project,
            country="BE",
            percentage=50,
            text="Belgium"
        )

        # Add related projects
        RelatedProject.objects.create(
            project=project,
            related_project=related_project,
            relation='1'
        )
        RelatedProject.objects.create(
            project=project,
            related_iati_id="NL-KVK-related",
            relation='1'
        )
        RelatedProject.objects.create(
            project=related_project,
            related_project=project,
            relation='1'
        )

        # Add sector
        Sector.objects.create(
            project=project,
            sector_code="140",
            vocabulary="1",
            vocabulary_uri="http://akvo.org",
            percentage=50,
            text="WASH",
        )
        Sector.objects.create(
            project=project,
            sector_code="150",
            vocabulary="1",
            vocabulary_uri="http://akvo.org",
            percentage=50,
            text="WASH",
        )

        # Add policy marker
        PolicyMarker.objects.create(
            project=project,
            policy_marker="1",
            significance="1",
            vocabulary="1",
            vocabulary_uri="http://akvo.org",
            description="Description",
        )

        # Add humanitarian scope
        HumanitarianScope.objects.create(
            project=project,
            code="1",
            type="1",
            vocabulary="1",
            vocabulary_uri="http://akvo.org",
            text="Humanitarian scope",
        )

        # Add country budget items
        CountryBudgetItem.objects.create(
            project=project,
            code="1",
            description="Description",
            percentage=50,
        )
        CountryBudgetItem.objects.create(
            project=project,
            code="1",
            description="Description",
            percentage=50,
        )

        # Add FSS and forecast
        fss = Fss.objects.create(
            project=project,
            extraction_date=datetime.date.today(),
            priority=True,
            phaseout_year=2016,
        )
        FssForecast.objects.create(
            fss=fss,
            value=1,
            year=2016,
            value_date=datetime.date.today(),
            currency="EUR",
        )

        # Add budget item and label
        label = BudgetItemLabel.objects.create(
            label="Test"
        )
        BudgetItem.objects.create(
            project=project,
            type="1",
            status="1",
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            amount=1,
            value_date=datetime.date.today(),
            currency="EUR",
            label=label,
        )

        # Add project contact
        ProjectContact.objects.create(
            project=project,
            type="1",
            organisation="Org",
            department="Dep",
            person_name="Person",
            job_title="Job title",
            telephone="06123",
            email="test@testing.nl",
            website="http://akvo.org",
            mailing_address="Mailing address",
        )

        # Add planned disbursement
        PlannedDisbursement.objects.create(
            project=project,
            type="1",
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            value=1,
            value_date=datetime.date.today(),
            currency="EUR",
            provider_organisation_activity="NL-KVK-prov",
            receiver_organisation_activity="NL-KVK-rec",
            provider_organisation=self.reporting_org,
            receiver_organisation=self.reporting_org,
        )

        # Add link
        Link.objects.create(
            project=project,
            url="http://rsr.akvo.org/",
            caption="RSR",
        )

        # Add project documents
        doc = ProjectDocument.objects.create(
            project=project,
            url="http://rsr.akvo.org/",
            format="application/http",
            title="RSR",
            title_language="en",
            language="en",
            document_date=datetime.date.today(),
        )
        ProjectDocumentCategory.objects.create(
            document=doc,
            category="A1"
        )

        # Add project update
        ProjectUpdate.objects.create(
            project=project,
            user=self.user,
            title="Update title",
            language="en"
        )

        # Add project location
        loc = ProjectLocation.objects.create(
            location_target=project,
            reference="ref",
            location_reach="1",
            location_code="1",
            vocabulary="1",
            name="Name",
            description="Description",
            activity_description="Activity description",
            latitude=10,
            longitude=10,
            exactness="1",
            location_class="1",
            feature_designation="1"
        )
        AdministrativeLocation.objects.create(
            location=loc,
            vocabulary="1",
            code="1",
            level=1,
        )

        # Add CRS++
        crs = CrsAdd.objects.create(
            project=project,
            loan_terms_rate1=1,
            loan_terms_rate2=2,
            repayment_type="1",
            repayment_plan="1",
            commitment_date=datetime.date.today(),
            repayment_first_date=datetime.date.today(),
            repayment_final_date=datetime.date.today(),
            loan_status_year=2016,
            loan_status_currency="EUR",
            loan_status_value_date=datetime.date.today(),
            interest_received=1,
            principal_outstanding=1,
            principal_arrears=1,
            interest_arrears=1,
            channel_code="1",
        )
        CrsAddOtherFlag.objects.create(
            crs=crs,
            code="1",
            significance=True,
        )

        # Add transaction
        Transaction.objects.create(
            project=project,
            reference="ref",
            humanitarian=True,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1,
            currency="EUR",
            value_date=datetime.date.today(),
            description="Description",
            disbursement_channel="1",
            provider_organisation_activity="NL-KVK-prov",
            receiver_organisation_activity="NL-KVK-rec",
            provider_organisation=self.reporting_org,
            receiver_organisation=self.reporting_org,
            flow_type="1",
            finance_type="1",
            aid_type="1",
            tied_status="1",
        )

        # Add results framework
        result = Result.objects.create(
            project=project,
            type="1",
            aggregation_status=True,
            title="Title",
            description="Description",
        )
        indicator = Indicator.objects.create(
            result=result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
            baseline_year=2016,
            baseline_value="1",
            baseline_comment="Comment"
        )
        IndicatorReference.objects.create(
            indicator=indicator,
            vocabulary="1",
            reference="ref",
            vocabulary_uri="http://akvo.org/",
        )
        period = IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="1",
            target_comment="Comment",
            actual_value="1",
            actual_comment="Comment",
        )
        IndicatorPeriodTargetLocation.objects.create(
            period=period,
            location="loc",
        )
        IndicatorPeriodActualLocation.objects.create(
            period=period,
            location="loc",
        )
        IndicatorPeriodTargetDimension.objects.create(
            period=period,
            name="Name",
            value="Value",
        )
        IndicatorPeriodActualDimension.objects.create(
            period=period,
            name="Name",
            value="Value",
        )

        # Create IATI checks
        iati_checks = IatiChecks(project)
        all_checks_passed, checks_results = iati_checks.perform_checks()

        # Test the IATI checks
        self.assertTrue(all_checks_passed)

    def test_iati_checks_incorrect_project(self):
        """
        Test the checks of an incorrect project.
        """
        # Create empty project
        project = Project.objects.create(
            date_start_actual=datetime.date.today() + datetime.timedelta(days=1),
            date_end_actual=datetime.date.today() + datetime.timedelta(days=2),
            currency=''
        )

        # Remove IATI ID of reporting org
        self.reporting_org.iati_org_id = ''
        self.reporting_org.save()

        # Add reporting partner without IATI organisation ID
        Partnership.objects.create(
            project=project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        # Add partnership without role
        Partnership.objects.create(
            project=project,
            organisation=self.reporting_org,
        )

        # Add partnership without organisation
        Partnership.objects.create(
            project=project,
        )

        # Add empty project document
        ProjectDocument.objects.create(
            project=project,
            title='',

        )

        # Add location with code, but without vocabulary (and same for administrative)
        loc = ProjectLocation.objects.create(
            location_target=project,
            location_code="1",
        )
        AdministrativeLocation.objects.create(
            location=loc,
            code="1",
        )

        # Add legacy data without name or value
        LegacyData.objects.create(
            project=project,
        )

        # Add condition without type or text
        ProjectCondition.objects.create(
            project=project,
        )

        # Add policy marker with vocabulary 99 and no URI, and vocabulary 1 and no significance
        PolicyMarker.objects.create(
            project=project,
            vocabulary='99',
        )
        PolicyMarker.objects.create(
            project=project,
            vocabulary='1',
        )

        # Add CRS++ without flag code or significance, and without loan status year or currency
        crs = CrsAdd.objects.create(
            project=project,
            interest_received=1,
        )
        CrsAddOtherFlag.objects.create(
            crs=crs,
        )

        # Add related project without related project, or with related project without IATI ID
        RelatedProject.objects.create(
            project=project,
        )
        related_project = Project.objects.create()
        RelatedProject.objects.create(
            project=project,
            related_project=related_project,
        )

        # Add FSS without extraction date, and forecast without value, year or currency
        fss = Fss.objects.create(
            project=project,
        )
        FssForecast.objects.create(
            fss=fss,
        )

        # Add humanitarian scope without code, type or vocabulary, and with vocabulary 99 but
        # without URI
        HumanitarianScope.objects.create(
            project=project,
        )
        HumanitarianScope.objects.create(
            project=project,
            vocabulary='99',
        )

        # Add empty planned disbursement, and one with the start date after the end date
        PlannedDisbursement.objects.create(
            project=project,
        )
        PlannedDisbursement.objects.create(
            project=project,
            receiver_organisation=self.reporting_org,
            provider_organisation=self.reporting_org,
            period_start=datetime.date.today() + datetime.timedelta(days=1),
            period_end=datetime.date.today(),
        )

        # Add empty budget, and one with the start date after the end date
        BudgetItem.objects.create(
            project=project,
        )
        BudgetItem.objects.create(
            project=project,
            period_start=datetime.date.today() + datetime.timedelta(days=1),
            period_end=datetime.date.today(),
        )

        # Add empty transaction, and one with the transaction date in the future
        Transaction.objects.create(
            project=project,
        )
        Transaction.objects.create(
            project=project,
            receiver_organisation=self.reporting_org,
            provider_organisation=self.reporting_org,
            recipient_region_vocabulary="99",
            transaction_date=datetime.date.today() + datetime.timedelta(days=1),
        )

        # Add sectors with incorrect percentage, and vocabulary without URI
        Sector.objects.create(
            project=project,
            percentage=10,
        )
        Sector.objects.create(
            project=project,
        )
        Sector.objects.create(
            project=project,
            vocabulary="99",
        )

        # Add empty results framework
        Result.objects.create(
            project=project,
        )
        result = Result.objects.create(
            project=project,
        )
        indicator = Indicator.objects.create(
            result=result,
            baseline_value="1",
        )
        IndicatorReference.objects.create(
            indicator=indicator,
        )
        IndicatorReference.objects.create(
            indicator=indicator,
            vocabulary="99",
        )
        IndicatorPeriod.objects.create(
            indicator=indicator,
        )
        IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today() + datetime.timedelta(days=1),
            period_end=datetime.date.today(),
            target_comment="Comment",
            actual_comment="Comment",
        )

        # Add multiple recipient countries and regions
        RecipientCountry.objects.create(
            project=project,
        )
        RecipientCountry.objects.create(
            project=project,
            percentage=5,
        )
        RecipientRegion.objects.create(
            project=project,
        )
        RecipientRegion.objects.create(
            project=project,
            percentage=5,
            region_vocabulary="99",
        )

        # Add a country budget item without a vocabulary
        CountryBudgetItem.objects.create(
            project=project,
        )
        CountryBudgetItem.objects.create(
            project=project,
            percentage=5,
        )

        # Create IATI checks
        iati_checks = IatiChecks(project)
        all_checks_passed, checks_results = iati_checks.perform_checks()

        # Test the IATI checks
        self.assertFalse(all_checks_passed)

    def test_iati_checks_multiple_level_sectors(self):
        """
        Test the checks for sectors on project and transaction level.
        """
        # Create empty project
        project = Project.objects.create()

        # Add sector
        sector = Sector.objects.create(
            project=project,
        )

        # Add recipient country
        RecipientCountry.objects.create(
            project=project,
        )

        # Add transaction and sector
        transaction = Transaction.objects.create(
            project=project,
        )
        trans_sector = TransactionSector.objects.create(
            transaction=transaction,
        )
        Transaction.objects.create(
            project=project,
        )

        # Create IATI checks
        iati_checks = IatiChecks(project)
        all_checks_passed, checks_results = iati_checks.perform_checks()

        # Test the IATI checks
        self.assertFalse(all_checks_passed)

        # Delete the transaction sector and sector
        trans_sector.delete()
        sector.delete()

        # Create IATI checks again
        iati_checks = IatiChecks(project)
        all_checks_passed, checks_results = iati_checks.perform_checks()

        # Test the IATI checks again
        self.assertFalse(all_checks_passed)

    def test_iati_checks_transaction_level_sectors(self):
        """
        Test the checks for sectors on transaction level.
        """
        # Create empty project
        project = Project.objects.create()

        # Add transaction sector
        transaction = Transaction.objects.create(
            project=project,
            recipient_country="NL",
            recipient_region="101",
        )
        TransactionSector.objects.create(
            transaction=transaction,
            vocabulary="99",
        )
        TransactionSector.objects.create(
            transaction=transaction,
            vocabulary="99",
        )

        # Create IATI checks
        iati_checks = IatiChecks(project)
        all_checks_passed, checks_results = iati_checks.perform_checks()

        # Test the IATI checks
        self.assertFalse(all_checks_passed)

        # Remove recipient region from transaction
        transaction.recipient_region = ''
        transaction.save()

        # Create IATI checks
        iati_checks = IatiChecks(project)
        all_checks_passed, checks_results = iati_checks.perform_checks()

        # Test the IATI checks
        self.assertFalse(all_checks_passed)

        # Add another transaction
        Transaction.objects.create(
            project=project,
        )

        # Create IATI checks
        iati_checks = IatiChecks(project)
        all_checks_passed, checks_results = iati_checks.perform_checks()

        # Test the IATI checks
        self.assertFalse(all_checks_passed)

        # Add a recipient country
        RecipientCountry.objects.create(
            project=project,
        )

        # Create IATI checks
        iati_checks = IatiChecks(project)
        all_checks_passed, checks_results = iati_checks.perform_checks()

        # Test the IATI checks
        self.assertFalse(all_checks_passed)
