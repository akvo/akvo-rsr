# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import date
from akvo.rsr.models.result.utils import QUANTITATIVE, PERCENTAGE_MEASURE, calculate_percentage
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.views.py_reports.program_period_labels_overview_pdf_report import get_program_indicators_with_labeled_periods_aggregate


def build_view_object(program):
    return get_program_indicators_with_labeled_periods_aggregate(program)

class TestProjectPeriodLabelsOverview(BaseTestCase):
    def test_aggregate_quantitative_unit(self):
        # Given
        root = ProjectFixtureBuilder()\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [
                        {
                            'period_start': date(2010, 1, 1),
                            'period_end': date(2010, 12, 31),
                            'label': 'L1',
                        },
                        {
                            'period_start': date(2011, 1, 1),
                            'period_end': date(2011, 12, 31),
                            'label': 'L2',
                        },
                        {
                            'period_start': date(2012, 1, 1),
                            'period_end': date(2012, 12, 31),
                            'label': 'L3',
                        },
                    ]
                }]
            }])\
            .with_contributors([
                {'title': 'Contrib #1', 'contributors': [{'title': 'Subcon #1.1'}]},
                {'title': 'Contrib #2'}
            ])\
            .build()

        l1 = root.get_label('L1')
        l2 = root.get_label('L2')
        l3 = root.get_label('L3')
        contrib2 = root.get_contributor(title='Contrib #2')
        subcon1_1 = root.get_contributor(title='Subcon #1.1')

        user = self.create_user('test@akvo.org', 'password', is_admin=True)

        contrib2.get_period(period_start=date(2010, 1, 1)).set_label(l1).add_update(user, value=1)
        contrib2.get_period(period_start=date(2011, 1, 1)).set_label(l2).add_update(user, value=2)
        contrib2.get_period(period_start=date(2012, 1, 1)).set_label(l3).add_update(user, value=3)

        subcon1_1.get_period(period_start=date(2010, 1, 1)).add_update(user, value=4)
        subcon1_1.get_period(period_start=date(2011, 1, 1)).set_label(l1).add_update(user, value=5)
        subcon1_1.get_period(period_start=date(2012, 1, 1)).set_label(l2).add_update(user, value=6)

        # When
        indicators = build_view_object(root.object)

        # Then
        self.assertEqual(1, len(indicators))
        indicator = indicators[0]
        self.assertEqual(6, indicator.get_labeled_period('L1').actual_value)
        self.assertEqual(8, indicator.get_labeled_period('L2').actual_value)
        self.assertEqual(3, indicator.get_labeled_period('L3').actual_value)

    def test_aggregate_quantitative_percentage(self):
        # Given
        root = ProjectFixtureBuilder()\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'type': QUANTITATIVE,
                    'measure': PERCENTAGE_MEASURE,
                    'periods': [
                        {
                            'period_start': date(2010, 1, 1),
                            'period_end': date(2010, 12, 31),
                            'label': 'L1',
                        },
                        {
                            'period_start': date(2011, 1, 1),
                            'period_end': date(2011, 12, 31),
                            'label': 'L2',
                        },
                        {
                            'period_start': date(2012, 1, 1),
                            'period_end': date(2012, 12, 31),
                            'label': 'L3',
                        },
                    ]
                }]
            }])\
            .with_contributors([
                {'title': 'Contrib #1', 'contributors': [{'title': 'Subcon #1.1'}]},
                {'title': 'Contrib #2'}
            ])\
            .build()

        l1 = root.get_label('L1')
        l2 = root.get_label('L2')
        l3 = root.get_label('L3')
        contrib2 = root.get_contributor(title='Contrib #2')
        subcon1_1 = root.get_contributor(title='Subcon #1.1')

        user = self.create_user('test@akvo.org', 'password', is_admin=True)

        contrib2.get_period(period_start=date(2010, 1, 1)).set_label(l1).add_update(user, numerator=1, denominator=10)
        contrib2.get_period(period_start=date(2011, 1, 1)).set_label(l2).add_update(user, numerator=2, denominator=10)
        contrib2.get_period(period_start=date(2012, 1, 1)).set_label(l3).add_update(user, numerator=3, denominator=10)

        subcon1_1.get_period(period_start=date(2010, 1, 1)).add_update(user, numerator=4, denominator=10)
        subcon1_1.get_period(period_start=date(2011, 1, 1)).set_label(l1).add_update(user, numerator=5, denominator=10)
        subcon1_1.get_period(period_start=date(2012, 1, 1)).set_label(l2).add_update(user, numerator=6, denominator=10)

        # When
        indicators = build_view_object(root.object)

        # Then
        self.assertEqual(1, len(indicators))
        indicator = indicators[0]
        pl1 = indicator.get_labeled_period('L1')
        pl2 = indicator.get_labeled_period('L2')
        pl3 = indicator.get_labeled_period('L3')

        self.assertEqual((6, 20, 30), (pl1.numerator, pl1.denominator, pl1.actual_value))
        self.assertEqual((8, 20, 40), (pl2.numerator, pl2.denominator, pl2.actual_value))
        self.assertEqual((3, 10, 30), (pl3.numerator, pl3.denominator, pl3.actual_value))

    def test_aggregate_quantitative_unit_with_disaggregation(self):
        # Given
        root = ProjectFixtureBuilder()\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [
                        {
                            'period_start': date(2010, 1, 1),
                            'period_end': date(2010, 12, 31),
                            'label': 'L1',
                        },
                        {
                            'period_start': date(2011, 1, 1),
                            'period_end': date(2011, 12, 31),
                            'label': 'L2',
                        },
                        {
                            'period_start': date(2012, 1, 1),
                            'period_end': date(2012, 12, 31),
                            'label': 'L3',
                        },
                    ]
                }]
            }])\
            .with_contributors([
                {'title': 'Contrib #1', 'contributors': [{'title': 'Subcon #1.1'}]},
                {'title': 'Contrib #2'}
            ])\
            .build()

        l1 = root.get_label('L1')
        l2 = root.get_label('L2')
        l3 = root.get_label('L3')
        contrib2 = root.get_contributor(title='Contrib #2')
        subcon1_1 = root.get_contributor(title='Subcon #1.1')

        user = self.create_user('test@akvo.org', 'password', is_admin=True)

        contrib2.get_period(period_start=date(2010, 1, 1)).set_label(l1)\
            .add_update(user, value=1, disaggregations={
                'Gender': {
                    'Male': {'value': 1},
                }
            })
        contrib2.get_period(period_start=date(2011, 1, 1)).set_label(l2)\
            .add_update(user, value=2, disaggregations={
                'Gender': {
                    'Male': {'value': 1},
                    'Female': {'value': 1},
                }
            })
        contrib2.get_period(period_start=date(2012, 1, 1)).set_label(l3)\
            .add_update(user, value=3, disaggregations={
                'Gender': {
                    'Male': {'value': 1},
                    'Female': {'value': 2},
                }
            })

        subcon1_1.get_period(period_start=date(2010, 1, 1))\
            .add_update(user, value=4, disaggregations={
                'Gender': {
                    'Male': {'value': 2},
                    'Female': {'value': 2},
                }
            })
        subcon1_1.get_period(period_start=date(2011, 1, 1)).set_label(l1)\
            .add_update(user, value=5, disaggregations={
                'Gender': {
                    'Male': {'value': 2},
                    'Female': {'value': 3},
                }
            })
        subcon1_1.get_period(period_start=date(2012, 1, 1)).set_label(l2)\
            .add_update(user, value=6, disaggregations={
                'Gender': {
                    'Male': {'value': 2},
                    'Female': {'value': 4},
                }
            })

        # When
        indicators = build_view_object(root.object)

        # Then
        self.assertEqual(1, len(indicators))
        indicator = indicators[0]
        pl1 = indicator.get_labeled_period('L1')
        pl2 = indicator.get_labeled_period('L2')
        pl3 = indicator.get_labeled_period('L3')

        self.assertEqual(3, pl1.get_disaggregation_of('Gender', 'Male'))
        self.assertEqual(3, pl1.get_disaggregation_of('Gender', 'Female'))
        self.assertEqual(3, pl2.get_disaggregation_of('Gender', 'Male'))
        self.assertEqual(5, pl2.get_disaggregation_of('Gender', 'Female'))
        self.assertEqual(1, pl3.get_disaggregation_of('Gender', 'Male'))
        self.assertEqual(2, pl3.get_disaggregation_of('Gender', 'Female'))

    def test_aggregate_quantitative_percentage_with_disaggregation(self):
        # Given
        root = ProjectFixtureBuilder()\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'type': QUANTITATIVE,
                    'measure': PERCENTAGE_MEASURE,
                    'periods': [
                        {
                            'period_start': date(2010, 1, 1),
                            'period_end': date(2010, 12, 31),
                            'label': 'L1',
                        },
                        {
                            'period_start': date(2011, 1, 1),
                            'period_end': date(2011, 12, 31),
                            'label': 'L2',
                        },
                        {
                            'period_start': date(2012, 1, 1),
                            'period_end': date(2012, 12, 31),
                            'label': 'L3',
                        },
                    ]
                }]
            }])\
            .with_contributors([
                {'title': 'Contrib #1', 'contributors': [{'title': 'Subcon #1.1'}]},
                {'title': 'Contrib #2'}
            ])\
            .build()

        l1 = root.get_label('L1')
        l2 = root.get_label('L2')
        l3 = root.get_label('L3')
        contrib2 = root.get_contributor(title='Contrib #2')
        subcon1_1 = root.get_contributor(title='Subcon #1.1')

        user = self.create_user('test@akvo.org', 'password', is_admin=True)

        contrib2.get_period(period_start=date(2010, 1, 1)).set_label(l1)\
            .add_update(user, numerator=1, denominator=10, disaggregations={
                'Gender': {
                    'Female': {'numerator': 1, 'denominator': 10}
                }
            })
        contrib2.get_period(period_start=date(2011, 1, 1)).set_label(l2)\
            .add_update(user, numerator=2, denominator=10, disaggregations={
                'Gender': {
                    'Male': {'numerator': 1, 'denominator': 5},
                    'Female': {'numerator': 1, 'denominator': 5}
                }
            })
        contrib2.get_period(period_start=date(2012, 1, 1)).set_label(l3)\
            .add_update(user, numerator=3, denominator=10, disaggregations={
                'Gender': {
                    'Male': {'numerator': 1, 'denominator': 5},
                    'Female': {'numerator': 2, 'denominator': 5}
                }
            })

        subcon1_1.get_period(period_start=date(2010, 1, 1))\
            .add_update(user, numerator=4, denominator=10, disaggregations={
                'Gender': {
                    'Male': {'numerator': 2, 'denominator': 5},
                    'Female': {'numerator': 2, 'denominator': 5}
                }
            })
        subcon1_1.get_period(period_start=date(2011, 1, 1)).set_label(l1)\
            .add_update(user, numerator=5, denominator=10, disaggregations={
                'Gender': {
                    'Male': {'numerator': 2, 'denominator': 5},
                    'Female': {'numerator': 3, 'denominator': 5}
                }
            })
        subcon1_1.get_period(period_start=date(2012, 1, 1)).set_label(l2)\
            .add_update(user, numerator=6, denominator=10, disaggregations={
                'Gender': {
                    'Male': {'numerator': 3, 'denominator': 5},
                    'Female': {'numerator': 3, 'denominator': 5}
                }
            })

        # When
        indicators = build_view_object(root.object)

        # Then
        self.assertEqual(1, len(indicators))
        indicator = indicators[0]
        pl1 = indicator.get_labeled_period('L1')
        pl2 = indicator.get_labeled_period('L2')
        pl3 = indicator.get_labeled_period('L3')

        self.assertEqual(calculate_percentage(2, 5), pl1.get_disaggregation_of('Gender', 'Male'))
        self.assertEqual(calculate_percentage(4, 15), pl1.get_disaggregation_of('Gender', 'Female'))
        self.assertEqual(calculate_percentage(4, 10), pl2.get_disaggregation_of('Gender', 'Male'))
        self.assertEqual(calculate_percentage(4, 10), pl2.get_disaggregation_of('Gender', 'Female'))
        self.assertEqual(calculate_percentage(1, 5), pl3.get_disaggregation_of('Gender', 'Male'))
        self.assertEqual(calculate_percentage(2, 5), pl3.get_disaggregation_of('Gender', 'Female'))
