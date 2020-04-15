# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.result.utils import QUANTITATIVE, PERCENTAGE_MEASURE
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.views.py_reports.results_indicators_with_map_pdf_reports import build_view_object
from datetime import date


class ResultsIndicatorsViewModelTestCase(BaseTestCase):
    def test_view_object_structure(self):
        project = ProjectFixtureBuilder()\
            .with_title('Project #1')\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'periods': [
                                {
                                    'period_start': date(2010, 1, 1),
                                    'period_end': date(2010, 12, 31)
                                },
                                {
                                    'period_start': date(2011, 1, 1),
                                    'period_end': date(2011, 12, 31)
                                },
                            ]
                        }
                    ]
                },
            ])\
            .build()

        vm = build_view_object(project.object)

        self.assertEqual(vm.title, 'Project #1')
        self.assertEqual(len(vm.results), 1)
        result = vm.results[0]
        self.assertEqual(result.title, 'Result #1')
        self.assertEqual(len(result.indicators), 1)
        indicator = result.indicators[0]
        self.assertEqual(indicator.title, 'Indicator #1')
        self.assertEqual(len(indicator.periods), 2)
        period = indicator.periods[0]
        self.assertEqual(period.period_start, date(2010, 1, 1))

    def test_result_ordering(self):
        project = ProjectFixtureBuilder()\
            .with_results([
                {'title': 'Result #2'},
                {'title': 'Result #3'},
                {'title': 'Result #1'},
            ])\
            .build()

        project.results.filter(title='Result #1').update(order=1)
        project.results.filter(title='Result #2').update(order=2)
        project.results.filter(title='Result #3').update(order=3)

        vm = build_view_object(project.object)

        self.assertEqual(vm.results[0].title, 'Result #1')
        self.assertEqual(vm.results[1].title, 'Result #2')
        self.assertEqual(vm.results[2].title, 'Result #3')

    def test_indicator_ordering(self):
        project = ProjectFixtureBuilder()\
            .with_results([
                {
                    'title': 'Result',
                    'indicators': [
                        {'title': 'Indicator #3'},
                        {'title': 'Indicator #1'},
                        {'title': 'Indicator #2'},
                    ]
                }
            ])\
            .build()

        project.indicators.filter(title='Indicator #1').update(order=1)
        project.indicators.filter(title='Indicator #2').update(order=2)
        project.indicators.filter(title='Indicator #3').update(order=3)

        vm = build_view_object(project.object)

        self.assertEqual(vm.results[0].indicators[0].title, 'Indicator #1')
        self.assertEqual(vm.results[0].indicators[1].title, 'Indicator #2')
        self.assertEqual(vm.results[0].indicators[2].title, 'Indicator #3')

    def test_indicator_disaggregations(self):
        user = self.create_user('test@akvo.org', 'password', is_admin=True)
        project = ProjectFixtureBuilder()\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
                'Age': ['Children', 'Adults']
            })\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'periods': [
                                {
                                    'period_start': date(2010, 1, 1),
                                    'period_end': date(2010, 12, 31)
                                },
                                {
                                    'period_start': date(2011, 1, 1),
                                    'period_end': date(2011, 12, 31)
                                },
                            ]
                        }
                    ]
                }
            ])\
            .build()
        project.get_period(period_start=date(2010, 1, 1)).add_update(
            user, value=10,
            disaggregations={
                'Gender': {
                    'Male': {'value': 3},
                    'Female': {'value': 7},
                }
            }
        )
        project.get_period(period_start=date(2011, 1, 1)).add_update(
            user, value=5,
            disaggregations={
                'Gender': {
                    'Male': {'value': 3},
                    'Female': {'value': 2},
                }
            }
        )

        vm = build_view_object(project.object)
        disaggregations = vm.results[0].indicators[0].disaggregations

        self.assertEqual(disaggregations, {
            'Gender': {
                'Male': {'value': 6, 'numerator': 0, 'denominator': 0},
                'Female': {'value': 9, 'numerator': 0, 'denominator': 0},
            }
        })

    def test_percentage_indicator(self):
        user = self.create_user('test@akvo.org', 'password', is_admin=True)
        project = ProjectFixtureBuilder()\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
                'Age': ['Children', 'Adults']
            })\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'type': QUANTITATIVE,
                            'measure': PERCENTAGE_MEASURE,
                            'periods': [
                                {
                                    'period_start': date(2010, 1, 1),
                                    'period_end': date(2010, 12, 31)
                                },
                                {
                                    'period_start': date(2011, 1, 1),
                                    'period_end': date(2011, 12, 31)
                                },
                            ]
                        }
                    ]
                }
            ])\
            .build()
        project.get_period(period_start=date(2010, 1, 1)).add_update(
            user, numerator=10, denominator=10,
            disaggregations={
                'Gender': {
                    'Male': {'numerator': 3, 'denominator': 10},
                    'Female': {'numerator': 7, 'denominator': 10},
                }
            }
        )
        project.get_period(period_start=date(2011, 1, 1)).add_update(
            user, numerator=5, denominator=10,
            disaggregations={
                'Gender': {
                    'Male': {'numerator': 3, 'denominator': 10},
                    'Female': {'numerator': 2, 'denominator': 10},
                }
            }
        )

        vm = build_view_object(project.object)
        disaggregations = vm.results[0].indicators[0].disaggregations

        self.assertEqual(disaggregations, {
            'Gender': {
                'Male': {'value': 30, 'numerator': 6, 'denominator': 20},
                'Female': {'value': 45, 'numerator': 9, 'denominator': 20},
            }
        })

    def test_date_filter(self):
        project = ProjectFixtureBuilder()\
            .with_title('Project #1')\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'periods': [
                                {
                                    'period_start': date(2010, 1, 1),
                                    'period_end': date(2010, 12, 31)
                                },
                            ]
                        }
                    ]
                },
                {
                    'title': 'Result #2',
                    'indicators': [
                        {
                            'title': 'Indicator #2',
                            'periods': [
                                {
                                    'period_start': date(2011, 1, 1),
                                    'period_end': date(2011, 12, 31)
                                },
                                {
                                    'period_start': date(2012, 1, 1),
                                    'period_end': date(2012, 12, 31)
                                },
                            ]
                        }
                    ]
                },
                {
                    'title': 'Result #3',
                    'indicators': [
                        {
                            'title': 'Indicator #3',
                            'periods': [
                                {
                                    'period_start': date(2012, 1, 1),
                                    'period_end': date(2012, 12, 31)
                                },
                            ]
                        }
                    ]
                },
            ])\
            .build()

        vm = build_view_object(project.object, date(2010, 6, 1), date(2012, 6, 30))

        self.assertEqual(len(vm.results), 1)
        result = vm.results[0]
        self.assertEqual(result.title, 'Result #2')
        periods = result.indicators[0].periods
        self.assertEqual(len(periods), 1)
        self.assertEqual(periods[0].period_start, date(2011, 1, 1))
