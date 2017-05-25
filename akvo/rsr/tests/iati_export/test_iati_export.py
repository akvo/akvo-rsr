# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.iati.exports.iati_export import IatiXML
from akvo.rsr.models import (IatiExport, Organisation, Partnership, Project, User, ProjectCondition,
                             LegacyData, RecipientCountry, RelatedProject, Sector, RecipientRegion,
                             PolicyMarker, HumanitarianScope, CountryBudgetItem, Fss, FssForecast,
                             BudgetItem, BudgetItemLabel, ProjectContact, PlannedDisbursement,
                             Link, ProjectDocument, ProjectDocumentCategory, ProjectUpdate,
                             ProjectLocation, AdministrativeLocation, CrsAdd, CrsAddOtherFlag,
                             Transaction, TransactionSector, Result, Indicator, IndicatorPeriod,
                             IndicatorPeriodActualDimension, IndicatorPeriodActualLocation,
                             IndicatorPeriodTargetDimension, IndicatorPeriodTargetLocation,
                             IndicatorReference)

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

import datetime
import os
import shutil
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

    def test_complete_project_export(self):
        """
        Test the export of a fully filled project.
        """
        # Create project
        project = Project.objects.create(
            title="Test project for IATI export",
            subtitle="Test project for IATI export (subtitle)",
            iati_activity_id="NL-KVK-1234567890-1234",
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
            date_start_actual=datetime.date.today(),
            date_end_planned=datetime.date.today() + datetime.timedelta(days=1),
            date_end_actual=datetime.date.today() + datetime.timedelta(days=1),
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
            percentage=100,
            text="The Netherlands"
        )

        # Add related projects
        RelatedProject.objects.create(
            project=project,
            related_project=related_project,
            relation=RelatedProject.PROJECT_RELATION_PARENT
        )
        RelatedProject.objects.create(
            project=project,
            related_iati_id="NL-KVK-related",
            relation=RelatedProject.PROJECT_RELATION_PARENT
        )
        RelatedProject.objects.create(
            project=related_project,
            related_project=project,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )

        # Add sector
        Sector.objects.create(
            project=project,
            sector_code="140",
            vocabulary="1",
            vocabulary_uri="http://akvo.org",
            percentage=100,
            text="WASH",
        )

        # Add recipient region
        RecipientRegion.objects.create(
            project=project,
            region="100",
            percentage=100,
            region_vocabulary="1",
            region_vocabulary_uri="http://akvo.org",
            text="Some region",
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

        # Add country budget item
        CountryBudgetItem.objects.create(
            project=project,
            code="1",
            description="Description",
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
        ProjectDocument.objects.create(
            project=project,
            document=SimpleUploadedFile(
                name='test_image.jpg',
                content=open(self.image_path, 'rb').read(),
                content_type='image/jpeg'
            ),
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
        transaction = Transaction.objects.create(
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
            recipient_country="NL",
            recipient_region="110",
            recipient_region_vocabulary="1",
            recipient_region_vocabulary_uri="http://akvo.org",
            flow_type="1",
            finance_type="1",
            aid_type="1",
            tied_status="1",
        )
        TransactionSector.objects.create(
            transaction=transaction,
            code="140",
            vocabulary="1",
            vocabulary_uri="http://akvo.org",
            text="WASH",
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
            description="Indicator Description",
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

        # Create IATI export
        iati_export = IatiExport.objects.create(
            reporting_organisation=self.reporting_org,
            user=self.user
        )

        # Add a project to the IATI export
        iati_export.projects.add(project)

        # Remove folder
        media_root = '/var/akvo/rsr/mediaroot/'
        directory = 'db/org/%s/iati/' % str(self.reporting_org.pk)
        if os.path.exists(media_root + directory):
            shutil.rmtree(media_root + directory)

        # Run IATI export
        iati_export.create_iati_file()

        # In order to easily access the XML file, generate the IATI file again
        tmp_iati_xml = IatiXML(iati_export.projects.all(), iati_export.version, iati_export)
        iati_xml = etree.tostring(tmp_iati_xml.iati_activities)

        # Perform checks on IATI export
        self.assertEqual(iati_export.status, 3)
        self.assertNotEqual(iati_export.iati_file, '')

        # Perform checks on IATI XML file
        root_test = self.assertXmlDocument(iati_xml)
        self.assertXmlNode(root_test, tag='iati-activities')
        self.assertXmlHasAttribute(root_test, 'generated-datetime')
        self.assertXmlHasAttribute(root_test, 'version')
        self.assertXpathsExist(root_test, ('./iati-activity',
                                           './iati-activity/iati-identifier',
                                           './iati-activity/reporting-org',
                                           './iati-activity/title'))

        # Test related activities are listed only once
        related_activity_id = related_project.iati_activity_id
        attributes = {'ref': related_activity_id, 'type': RelatedProject.PROJECT_RELATION_PARENT}
        related_activities = root_test.xpath(
            './iati-activity/related-activity[@ref="{}"]'.format(related_activity_id)
        )
        self.assertEqual(1, len(related_activities))
        self.assertEqual(attributes, related_activities[0].attrib)

        # Test indicator has description
        indicator_description_xpath = './iati-activity/result/indicator/description/narrative'
        self.assertXpathsExist(root_test, (indicator_description_xpath,))
        indicators = root_test.xpath(indicator_description_xpath)
        self.assertEqual(indicators[0].text, 'Indicator Description')

    def test_different_complete_project_export(self):
        """
        Test the export of a fully filled project with different settings.
        """
        # Create project
        project = Project.objects.create(
            title="Test project for IATI export",
            subtitle="Test project for IATI export (subtitle)",
            iati_activity_id="NL-KVK-1234567890-1234",
            language="en",
            hierarchy=1,
            humanitarian=True,
            current_image=SimpleUploadedFile(
                name='test_image.jpg',
                content=open(self.image_path, 'rb').read(),
                content_type='image/jpeg'
            ),
            current_image_caption="Only caption",
        )

        # Remove long name and IATI identifier from reporting org
        self.reporting_org.long_name = ""
        self.reporting_org.iati_org_id = ""
        self.reporting_org.save()

        # Create partnership
        Partnership.objects.create(
            organisation=self.reporting_org,
            project=project,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
            is_secondary_reporter=True,
            internal_id="123"
        )

        # Create another partnership
        Partnership.objects.create(
            organisation=self.reporting_org,
            project=project,
            iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER,
            iati_activity_id="NL-KVK-Test"
        )

        # Create budget item
        BudgetItem.objects.create(
            project=project,
            type="1",
            status="1",
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            amount=1,
            value_date=datetime.date.today(),
            currency="EUR",
            other_extra="Other extra",
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
            recipient_country="NL",
            recipient_region="110",
            recipient_region_vocabulary="1",
            recipient_region_vocabulary_uri="http://akvo.org",
            flow_type="1",
            finance_type="1",
            aid_type="1",
            tied_status="1",
        )

        # Create IATI export
        iati_export = IatiExport.objects.create(
            reporting_organisation=self.reporting_org,
            user=self.user
        )

        # Add a project to the IATI export
        iati_export.projects.add(project)

        # Run IATI export
        iati_export.create_iati_file()

        # In order to easily access the XML file, generate the IATI file again
        tmp_iati_xml = IatiXML(iati_export.projects.all(), iati_export.version, iati_export)
        iati_xml = etree.tostring(tmp_iati_xml.iati_activities)

        # Perform checks on IATI export
        self.assertEqual(iati_export.status, 3)
        self.assertNotEqual(iati_export.iati_file, '')

        # Perform checks on IATI XML file
        root_test = self.assertXmlDocument(iati_xml)
        self.assertXmlNode(root_test, tag='iati-activities')
        self.assertXmlHasAttribute(root_test, 'generated-datetime')
        self.assertXmlHasAttribute(root_test, 'version')
        self.assertXpathsExist(root_test, ('./iati-activity',
                                           './iati-activity/iati-identifier',
                                           './iati-activity/reporting-org',
                                           './iati-activity/title'))

    def test_empty_project_export(self):
        """
        Test the export of an empty project (with only an image).
        """
        # Create project
        empty_project = Project.objects.create(
            current_image=SimpleUploadedFile(
                name='test_image.jpg',
                content=open(self.image_path, 'rb').read(),
                content_type='image/jpeg'
            ),
        )

        # Create IATI export
        iati_export = IatiExport.objects.create(
            reporting_organisation=self.reporting_org,
            user=self.user
        )

        # Add a project to the IATI export
        iati_export.projects.add(empty_project)

        # Run IATI export
        iati_export.create_iati_file()

        # In order to easily access the XML file, generate the IATI file again
        tmp_iati_xml = IatiXML(iati_export.projects.all(), iati_export.version, iati_export)
        iati_xml = etree.tostring(tmp_iati_xml.iati_activities)

        # Perform checks on IATI export
        self.assertEqual(iati_export.status, 3)
        self.assertNotEqual(iati_export.iati_file, '')

        # Perform checks on IATI XML file
        root_test = self.assertXmlDocument(iati_xml)
        self.assertXmlNode(root_test, tag='iati-activities')
        self.assertXmlHasAttribute(root_test, 'generated-datetime')
        self.assertXmlHasAttribute(root_test, 'version')
        self.assertXpathsExist(root_test, ('./iati-activity', ))

    def test_project_with_only_credit_export(self):
        """
        Test the export of an empty project (with only an image and image credit).
        """
        # Create project
        empty_project = Project.objects.create(
            current_image=SimpleUploadedFile(
                name='test_image.jpg',
                content=open(self.image_path, 'rb').read(),
                content_type='image/jpeg'
            ),
            current_image_credit="Only credit"
        )

        # Create IATI export
        iati_export = IatiExport.objects.create(
            reporting_organisation=self.reporting_org,
            user=self.user
        )

        # Add a project to the IATI export
        iati_export.projects.add(empty_project)

        # Run IATI export
        iati_export.create_iati_file()

        # In order to easily access the XML file, generate the IATI file again
        tmp_iati_xml = IatiXML(iati_export.projects.all(), iati_export.version, iati_export)
        iati_xml = etree.tostring(tmp_iati_xml.iati_activities)

        # Perform checks on IATI export
        self.assertEqual(iati_export.status, 3)
        self.assertNotEqual(iati_export.iati_file, '')

        # Perform checks on IATI XML file
        root_test = self.assertXmlDocument(iati_xml)
        self.assertXmlNode(root_test, tag='iati-activities')
        self.assertXmlHasAttribute(root_test, 'generated-datetime')
        self.assertXmlHasAttribute(root_test, 'version')
        self.assertXpathsExist(root_test, ('./iati-activity',))
