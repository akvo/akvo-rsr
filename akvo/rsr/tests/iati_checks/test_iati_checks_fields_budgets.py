# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime

from django.conf import settings
from akvo.rsr.tests.base import BaseTestCase
from akvo.iati.checks.fields import budgets as budgets_checks
from akvo.rsr.models import BudgetItem, BudgetItemLabel, ProjectEditorValidationSet


class IatiCheckBudgetPeriodNotLongerThanOneYearTestCase(BaseTestCase):

    def setUp(self):
        self.project = self.create_project("Test project")
        self.label = BudgetItemLabel.objects.create(label="Test")

        BudgetItem.objects.create(
            project=self.project,
            label=self.label,
            amount=1,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=366),
            value_date=datetime.date.today(),
        )

    def test_dgis_validation_set(self):
        validation, _ = ProjectEditorValidationSet.objects.get_or_create(name=settings.VALIDATION_SET['DGIS'])
        self.project.validations.add(validation)
        all_checks_passed, checks = budgets_checks(self.project)
        self.assertFalse(all_checks_passed)
        self.assertEqual('warning', checks[0][0])
        self.assertIn('period must not be longer than one year', checks[0][1])

    def test_dgis_modified_validation_set(self):
        validation, _ = ProjectEditorValidationSet.objects.get_or_create(name=settings.VALIDATION_SET['DGIS_MODIFIED'])
        self.project.validations.add(validation)
        all_checks_passed, checks = budgets_checks(self.project)
        self.assertFalse(all_checks_passed)
        self.assertEqual('warning', checks[0][0])
        self.assertIn('period must not be longer than one year', checks[0][1])

    def test_other_validation_set(self):
        all_checks_passed, checks = budgets_checks(self.project)
        self.assertFalse(all_checks_passed)
        self.assertEqual('error', checks[0][0])
        self.assertIn('period must not be longer than one year', checks[0][1])
