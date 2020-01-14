# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
import json

from django.test import TestCase

from akvo.iati.checks.fields import results as results_checks
from akvo.rsr.models import (
    Project, Result, Indicator, IndicatorPeriod, ProjectEditorValidationSet, IndicatorReference
)
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE


class IatiChecksFieldsReultsTestCase(TestCase):
    """Tests the IATI checks."""

    def setUp(self):
        self.project = Project.objects.create()

        self.result = Result.objects.create(
            project=self.project,
            type="1",
            aggregation_status=True,
            title="Title",
            description="Description",
        )

    def test_iati_checks_fields_results_result_and_indicator_pass(self):
        # Given
        Indicator.objects.create(
            result=self.result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
            baseline_value="4711",
            baseline_year=2017,
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertTrue(all_checks_passed)
        self.assertEqual(len(checks), 1)
        self.assertIn('has valid result(s)', checks[0][1])

    def test_iati_results_checks_pass_with_qualitative_indicator_only(self):
        # Given
        Indicator.objects.create(
            result=self.result,
            type=QUALITATIVE,
            title="Title",
            description="Description",
            baseline_value="4711",
            baseline_year=2017,
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertTrue(all_checks_passed)
        self.assertEqual(len(checks), 1)
        self.assertIn('has valid result(s)', checks[0][1])

    def test_iati_checks_fields_results_result_errors(self):
        # When
        self.result.title = ''
        self.result.type = ''
        self.result.save()
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertFalse(all_checks_passed)
        self.assertEqual(len(checks), 3)
        self.assertIn('has no type specified', checks[0][1])
        self.assertIn('has no title specified', checks[1][1])
        self.assertIn('has no indicator', checks[2][1])

    def test_iati_checks_fields_results_indicator_error(self):
        # Given an indicator missing title, measure and baseline year and value
        Indicator.objects.create(
            result=self.result,
            type=QUANTITATIVE,
            ascending=True,
            description="Description",
            baseline_comment="Comment",
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertFalse(all_checks_passed)
        self.assertEqual(len(checks), 4)
        self.assertIn('has no measure specified', checks[0][1])
        self.assertIn('has no title specified', checks[1][1])
        self.assertEqual('error', checks[2][0])
        self.assertIn('baseline has no value specified', checks[2][1])
        self.assertEqual('error', checks[3][0])
        self.assertIn('baseline has no year specified', checks[3][1])

    def test_iati_checks_fields_results_indicator_dgis_error(self):
        # Given the use of the DGIS validation set
        validation = ProjectEditorValidationSet.objects.create(
            name="DGIS IATI", description="DGIS IATI"
        )
        self.project.validations.add(validation)

        Indicator.objects.create(
            result=self.result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertFalse(all_checks_passed)
        self.assertEqual(len(checks), 2)
        self.assertEqual('warning', checks[0][0])
        self.assertIn(
            'no value specified, however the value of "N/A"', json.loads(checks[0][1])['message'])
        self.assertEqual('warning', checks[1][0])
        self.assertIn(
            'no year specified, however the value of "1"', json.loads(checks[1][1])['message'])

    def test_iati_checks_fields_results_period_pass(self):
        # Given
        indicator = Indicator.objects.create(
            result=self.result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
            baseline_value="4711",
            baseline_year=2017,
        )

        IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertTrue(all_checks_passed)
        self.assertEqual(len(checks), 1)
        self.assertIn('has valid result(s)', checks[0][1])

    def test_iati_checks_fields_results_reference_pass(self):
        # Given
        indicator = Indicator.objects.create(
            result=self.result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
            baseline_value="4711",
            baseline_year=2017,
        )

        IndicatorReference.objects.create(
            indicator=indicator,
            reference="1",
            vocabulary="99",
            vocabulary_uri="https://akvo.org/vocabulary"
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertTrue(all_checks_passed)
        self.assertEqual(len(checks), 1)
        self.assertIn('has valid result(s)', checks[0][1])

    def test_iati_checks_fields_results_reference_error(self):
        # Given
        indicator = Indicator.objects.create(
            result=self.result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
            baseline_value="4711",
            baseline_year=2017,
        )

        IndicatorReference.objects.create(
            indicator=indicator,
            vocabulary="99",
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertFalse(all_checks_passed)
        self.assertEqual(len(checks), 2)
        self.assertIn('has no code', checks[0][1])
        self.assertIn('has vocabulary 99', checks[1][1])

    def test_iati_checks_fields_results_period_no_dates(self):
        # Given
        indicator = Indicator.objects.create(
            result=self.result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
            baseline_value="4711",
            baseline_year=2017,
        )

        IndicatorPeriod.objects.create(
            indicator=indicator,
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertFalse(all_checks_passed)
        self.assertEqual(len(checks), 2)
        self.assertIn('has no start date', checks[0][1])
        self.assertIn('has no end date', checks[1][1])

    def test_iati_checks_fields_results_period_bad_dates(self):
        # Given
        indicator = Indicator.objects.create(
            result=self.result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
            baseline_value="4711",
            baseline_year=2017,
        )

        IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today() + datetime.timedelta(days=1),
            period_end=datetime.date.today(),
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertFalse(all_checks_passed)
        self.assertEqual(len(checks), 1)
        self.assertIn('has a start date later than the end date', checks[0][1])

    def test_iati_checks_fields_results_period_values_error(self):
        # Given
        indicator = Indicator.objects.create(
            result=self.result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
            baseline_value="4711",
            baseline_year=2017,
        )

        IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_comment="Target",
            actual_comment="Actual",
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertFalse(all_checks_passed)
        self.assertEqual(len(checks), 2)
        self.assertIn('has no target value', checks[0][1])
        self.assertIn('has no actual value', checks[1][1])

    def test_iati_checks_fields_results_period_values_dgis_warning(self):
        # Given
        validation = ProjectEditorValidationSet.objects.create(
            name="DGIS IATI", description="DGIS IATI"
        )
        self.project.validations.add(validation)

        indicator = Indicator.objects.create(
            result=self.result,
            measure="1",
            ascending=True,
            title="Title",
            description="Description",
            baseline_value="4711",
            baseline_year=2017,
        )

        IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
        )

        # When
        all_checks_passed, checks = results_checks(self.project)

        # Then
        self.assertFalse(all_checks_passed)
        self.assertEqual(len(checks), 2)
        self.assertIn(
            'no target value specified. The value "N/A"', json.loads(checks[0][1])['message'])
        self.assertIn(
            'no actual value specified. The value "N/A"', json.loads(checks[1][1])['message'])
