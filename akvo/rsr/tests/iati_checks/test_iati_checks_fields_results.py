# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
import os

from akvo.iati.checks.fields import results as results_checks
from akvo.iati.checks.iati_checks import IatiChecks
from akvo.rsr.models import (Partnership, Project, RecipientCountry, Sector, Transaction,
                             TransactionSector, Result, Indicator, IndicatorPeriod, Organisation,
                             User, ProjectEditorValidationSet)
from django.test import TestCase


class IatiChecksFieldsReultsTestCase(TestCase):
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



    def test_iati_checks_fields_results_with_dgis_validation(self):
        """
        Test the checks of results for a project that uses the DGIS validation set.
        """
        # Create empty project
        project = Project.objects.create(
            date_start_actual=datetime.date.today() + datetime.timedelta(days=1),
            date_end_actual=datetime.date.today() + datetime.timedelta(days=2),
            currency=''
        )

        # Add reporting partner
        Partnership.objects.create(
            project=project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        validation = ProjectEditorValidationSet.objects.create(
            name="DGIS IATI", description="DGIS IATI"
        )
        project.validations.add(validation)

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
            baseline_year=2017,
        )
        IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
        )

        all_checks_passed, checks = results_checks(project)

        # Test the IATI checks
        self.assertFalse(all_checks_passed)
        self.assertEquals(len(checks), 3)
        self.assertIn(u'baseline has no value', checks[0][1])
        self.assertIn(u'has no target value', checks[1][1])
        self.assertIn(u'has no actual value', checks[2][1])

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
