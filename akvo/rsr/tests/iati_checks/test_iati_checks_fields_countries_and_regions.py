# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime

from akvo.rsr.tests.base import BaseTestCase
from akvo.iati.checks.fields import countries_and_regions as geo_checks
from akvo.rsr.models import RecipientCountry, RecipientRegion, Transaction

TRANSACTION_TYPE_INCOMING_FUNDS = "1"


class IatiCheckFieldsTransactionRecipientsTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.project = self.create_project("Test project")
        Transaction.objects.create(
            project=self.project,
            transaction_type=TRANSACTION_TYPE_INCOMING_FUNDS,
            transaction_date=datetime.date.today(),
            value=1,
            value_date=datetime.date.today(),
        )

    def test_transcation_no_recipient_country_or_regions(self):
        all_checks_passed, checks = geo_checks(self.project)
        self.assertFalse(all_checks_passed)
        self.assertEqual('error', checks[0][0])
        self.assertIn('recipient country or recipient region should be declared for either the activity or for all transactions', checks[0][1])

    def test_transcation_with_recipient_countries(self):
        RecipientCountry.objects.create(project=self.project, country="NL", percentage=100)
        all_checks_passed, _ = geo_checks(self.project)
        self.assertTrue(all_checks_passed)

    def test_transcation_with_recipient_regions(self):
        RecipientRegion.objects.create(project=self.project, region="89", percentage=100)
        all_checks_passed, _ = geo_checks(self.project)
        self.assertTrue(all_checks_passed)


class SingleRecipientCountryPercentage(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.project = self.create_project("Test project")

    def test_invalid(self):
        RecipientCountry.objects.create(project=self.project, country="NL", percentage=50)
        all_checks_passed, checks = geo_checks(self.project)
        self.assertFalse(all_checks_passed)
        self.assertEqual('error', checks[0][0])
        self.assertIn('when a single recipient country is declared, the percentage must either be omitted or set to 100', checks[0][1])

    def test_percentage_zero(self):
        RecipientCountry.objects.create(project=self.project, country="NL", percentage=0)
        all_checks_passed, _ = geo_checks(self.project)
        self.assertTrue(all_checks_passed)

    def test_percentage_100(self):
        RecipientCountry.objects.create(project=self.project, country="NL", percentage=100)
        all_checks_passed, _ = geo_checks(self.project)
        self.assertTrue(all_checks_passed)
