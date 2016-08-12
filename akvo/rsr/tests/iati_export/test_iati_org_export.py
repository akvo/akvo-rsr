# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.iati.exports.iati_org_export import IatiOrgXML
from akvo.rsr.models import (User, Organisation, OrganisationDocument, OrganisationDocumentCategory,
                             OrganisationDocumentCountry, OrganisationTotalExpenditure,
                             OrganisationExpenseLine, OrganisationTotalBudget,
                             OrganisationTotalBudgetLine, OrganisationCountryBudget,
                             OrganisationCountryBudgetLine, OrganisationRegionBudget,
                             OrganisationRegionBudgetLine, OrganisationRecipientOrgBudget,
                             OrganisationRecipientOrgBudgetLine)

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.test.client import RequestFactory

import datetime, os, shutil
from lxml import etree
from xmlunittest import XmlTestMixin


class IatiOrgExportTestCase(TestCase, XmlTestMixin):
    """Tests the IATI export, and validates the XML file which is outputted."""

    def setUp(self):
        """
        In order to correctly test the IATI organisation export, we need a superuser in the
        database, an image path and a request object.
        """

        # Create (super)user
        self.user = User.objects.create_superuser(
            username="Super user org export",
            email="superuser.orgexport@test.akvo.org",
            password="password"
        )

        # Set test image path
        base_image_path = '/var/akvo/rsr/code/'
        if 'TRAVIS' in os.environ:
            base_image_path = '/home/travis/build/akvo/akvo-rsr/'
        self.image_path = base_image_path + 'akvo/rsr/tests/iati_export/test_image.jpg'

        # Get a request factory
        self.request = RequestFactory().get('/')

    def test_complete_org_export(self):
        """
        Test the export of a fully filled organisation.
        """
        # Create organisation
        organisation = Organisation.objects.create(
            name="Test Org Export",
            long_name="Test Organisation for IATI org export",
            iati_org_id="NL-KVK-OrgExport",
            can_create_projects=True,
            new_organisation_type=22,
            logo=SimpleUploadedFile(
                name='test_image.jpg',
                content=open(self.image_path, 'rb').read(),
                content_type='image/jpeg'
            ),
        )

        # Add organisation document, with category and country
        doc = OrganisationDocument.objects.create(
            organisation=organisation,
            document=SimpleUploadedFile(
                name='test_image.jpg',
                content=open(self.image_path, 'rb').read(),
                content_type='image/jpeg'
            ),
            format="application/jpg",
            title="Title",
            title_language="en",
            language="en",
            document_date=datetime.date.today(),
        )
        OrganisationDocumentCategory.objects.create(
            document=doc,
            category="A1",
        )
        OrganisationDocumentCountry.objects.create(
            document=doc,
            country="NL",
            text="The Netherlands",
        )

        # Add total expenditure, with expense line
        expenditure = OrganisationTotalExpenditure.objects.create(
            organisation=organisation,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            value=1,
            value_date=datetime.date.today(),
            currency="EUR",
        )
        OrganisationExpenseLine.objects.create(
            expenditure=expenditure,
            reference="ref",
            value=1,
            currency="EUR",
            value_date=datetime.date.today(),
            text="Text",
        )

        # Add total budget, with budget line
        budget = OrganisationTotalBudget.objects.create(
            organisation=organisation,
            status="1",
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            value=1,
            value_date=datetime.date.today(),
            currency="EUR",
        )
        OrganisationTotalBudgetLine.objects.create(
            budget=budget,
            reference="ref",
            value=1,
            currency="EUR",
            value_date=datetime.date.today(),
            text="Text",
        )

        # Add recipient country budget
        country_budget = OrganisationCountryBudget.objects.create(
            organisation=organisation,
            status="1",
            country="NL",
            text="The Netherlands",
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            value=1,
            value_date=datetime.date.today(),
            currency="EUR",
        )
        OrganisationCountryBudgetLine.objects.create(
            budget=country_budget,
            reference="ref",
            value=1,
            currency="EUR",
            value_date=datetime.date.today(),
            text="Text",
        )

        # Add recipient region budget
        region_budget = OrganisationRegionBudget.objects.create(
            organisation=organisation,
            status="1",
            region="110",
            region_vocabulary="1",
            region_vocabulary_uri="http://akvo.org/",
            text="Region",
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            value=1,
            value_date=datetime.date.today(),
            currency="EUR",
        )
        OrganisationRegionBudgetLine.objects.create(
            budget=region_budget,
            reference="ref",
            value=1,
            currency="EUR",
            value_date=datetime.date.today(),
            text="Text",
        )

        # Add recipient org budget
        org_budget = OrganisationRecipientOrgBudget.objects.create(
            organisation=organisation,
            status="1",
            recipient_organisation=organisation,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            value=1,
            value_date=datetime.date.today(),
            currency="EUR",
        )
        OrganisationRecipientOrgBudgetLine.objects.create(
            budget=org_budget,
            reference="ref",
            value=1,
            currency="EUR",
            value_date=datetime.date.today(),
            text="Text",
        )

        # Remove folder
        media_root = '/var/akvo/rsr/mediaroot/'
        directory = 'db/org/{}/iati-org/'.format(str(organisation.pk))
        if os.path.exists(media_root + directory):
            shutil.rmtree(media_root + directory)

        # Run IATI export
        iati_org_export = IatiOrgXML(self.request, [organisation])
        iati_org_export.save_file(str(organisation.pk), 'test-org-iati.xml')

        # In order to easily access the XML file, generate the IATI file again
        iati_org_xml = etree.tostring(iati_org_export.iati_organisations)

        # Perform checks on IATI XML file
        root_test = self.assertXmlDocument(iati_org_xml)
        self.assertXmlNode(root_test, tag="iati-organisations")

    def test_empty_org_export(self):
        """
        Test the export of an empty organisation (as far as possible).
        """
        # Create organisation
        organisation = Organisation.objects.create(
            name="Test Empty Org Export",
            long_name="Test Empty Org for IATI org export",
            can_create_projects=True,
            new_organisation_type=22
        )

        # Add organisation document (with url instead of document)
        OrganisationDocument.objects.create(
            organisation=organisation,
            url="http://akvo.org/"
        )

        # Run IATI export
        iati_org_export = IatiOrgXML(self.request, [organisation])
        iati_org_export.save_file(str(organisation.pk), 'test-org-iati.xml')

        # In order to easily access the XML file, generate the IATI file again
        iati_org_xml = etree.tostring(iati_org_export.iati_organisations)

        # Perform checks on IATI XML file
        root_test = self.assertXmlDocument(iati_org_xml)
        self.assertXmlNode(root_test, tag="iati-organisations")
