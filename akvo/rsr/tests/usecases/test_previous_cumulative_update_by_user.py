from datetime import date
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.models.result.utils import PERCENTAGE_MEASURE, calculate_percentage
from akvo.rsr.usecases.previous_cumulative_update_by_user import get_previous_cumulative_update_value, empty_result


class NonCumulativeIndicatorTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)
        self.project = ProjectFixtureBuilder()\
            .with_disaggregations({
                'Gender': ['Male', 'Female']
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
                                    'period_end': date(2010, 12, 31),
                                },
                                {
                                    'period_start': date(2011, 1, 1),
                                    'period_end': date(2011, 12, 31),
                                },
                            ]
                        }
                    ]
                }
            ])\
            .build()
        self.indicator = self.project.indicators.get(title='Indicator #1')

    def test_no_cumulative_update(self):
        self.project.get_period(period_start=date(2010, 1, 1)).add_update(
            self.user, value=10, disaggregations={
                'Gender': {
                    'Male': {'value': 3},
                    'Female': {'value': 7},
                }
            }
        )
        result = get_previous_cumulative_update_value(self.user, self.indicator)
        self.assertEqual(result, empty_result())


class CumulativeUnitIndicatorUserUpdateTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.user = self.create_user('test_user@akvo.org', 'password', is_admin=True)
        self.project = ProjectFixtureBuilder()\
            .with_disaggregations({
                'Gender': ['Male', 'Female']
            })\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'cumulative': True,
                            'periods': [
                                {
                                    'period_start': date(2010, 1, 1),
                                    'period_end': date(2010, 12, 31),
                                },
                                {
                                    'period_start': date(2011, 1, 1),
                                    'period_end': date(2011, 12, 31),
                                },
                            ]
                        }
                    ]
                }
            ])\
            .build()
        self.indicator = self.project.indicators.get(title='Indicator #1')

    def test_no_updates(self):
        result = get_previous_cumulative_update_value(self.user, self.indicator)
        self.assertEqual(result, empty_result())

    def test_multiple_updates_one_period(self):
        self.project.get_period(period_start=date(2010, 1, 1)).add_update(
            self.user, value=10,
            disaggregations={
                'Gender': {
                    'Male': {'value': 3},
                    'Female': {'value': 7},
                }
            }
        )
        self.project.get_period(period_start=date(2010, 1, 1)).add_update(
            self.user, value=15,
            disaggregations={
                'Gender': {
                    'Male': {'value': 5},
                    'Female': {'value': 10},
                }
            }
        )
        result = get_previous_cumulative_update_value(self.user, self.indicator)
        self.assertEqual(result, {
            'value': 15,
            'numerator': None,
            'denominator': None,
            'disaggregations': {
                'Gender': {
                    'Male': {'value': 5, 'numerator': None, 'denominator': None},
                    'Female': {'value': 10, 'numerator': None, 'denominator': None},
                }
            }
        })

    def test_multiple_period(self):
        ''' The updates are simulated in reverse order to ensure that the the values are accumulated correctly '''
        self.project.get_period(period_start=date(2011, 1, 1)).add_update(
            self.user, value=15,
            disaggregations={
                'Gender': {
                    'Male': {'value': 5},
                    'Female': {'value': 10},
                }
            }
        )
        self.project.get_period(period_start=date(2010, 1, 1)).add_update(
            self.user, value=10,
            disaggregations={
                'Gender': {
                    'Male': {'value': 3},
                    'Female': {'value': 7},
                }
            }
        )
        result = get_previous_cumulative_update_value(self.user, self.indicator)
        self.assertEqual(result, {
            'value': 15,
            'numerator': None,
            'denominator': None,
            'disaggregations': {
                'Gender': {
                    'Male': {'value': 5, 'numerator': None, 'denominator': None},
                    'Female': {'value': 10, 'numerator': None, 'denominator': None},
                }
            }
        })

    def test_multiple_user(self):
        other_user = self.create_user('other_user@akvo.org', 'password', is_admin=True)
        self.project.get_period(period_start=date(2010, 1, 1)).add_update(
            self.user, value=10,
            disaggregations={
                'Gender': {
                    'Male': {'value': 3},
                    'Female': {'value': 7},
                }
            }
        )
        self.project.get_period(period_start=date(2010, 1, 1)).add_update(
            other_user, value=15,
            disaggregations={
                'Gender': {
                    'Male': {'value': 5},
                    'Female': {'value': 10},
                }
            }
        )
        result = get_previous_cumulative_update_value(self.user, self.indicator)
        self.assertEqual(result, {
            'value': 10,
            'numerator': None,
            'denominator': None,
            'disaggregations': {
                'Gender': {
                    'Male': {'value': 3, 'numerator': None, 'denominator': None},
                    'Female': {'value': 7, 'numerator': None, 'denominator': None},
                }
            }
        })


class CumulativePercentageIndicatorUpdateTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.user = self.create_user('test_user@akvo.org', 'password', is_admin=True)
        self.project = ProjectFixtureBuilder()\
            .with_disaggregations({
                'Gender': ['Male', 'Female']
            })\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {
                            'title': 'Indicator #1',
                            'cumulative': True,
                            'measure': PERCENTAGE_MEASURE,
                            'periods': [
                                {
                                    'period_start': date(2010, 1, 1),
                                    'period_end': date(2010, 12, 31),
                                },
                                {
                                    'period_start': date(2011, 1, 1),
                                    'period_end': date(2011, 12, 31),
                                },
                            ]
                        }
                    ]
                }
            ])\
            .build()
        self.indicator = self.project.indicators.get(title='Indicator #1')

    def test_multiple_period(self):
        self.project.get_period(period_start=date(2010, 1, 1)).add_update(
            self.user, numerator=10, denominator=10,
            disaggregations={
                'Gender': {
                    'Male': {'numerator': 3, 'denominator': 10},
                    'Female': {'numerator': 7, 'denominator': 10},
                }
            }
        )
        self.project.get_period(period_start=date(2011, 1, 1)).add_update(
            self.user, numerator=15, denominator=20,
            disaggregations={
                'Gender': {
                    'Male': {'numerator': 5, 'denominator': 20},
                    'Female': {'numerator': 10, 'denominator': 20},
                }
            }
        )
        result = get_previous_cumulative_update_value(self.user, self.indicator)
        self.assertEqual(result, {
            'value': calculate_percentage(15, 20),
            'numerator': 15,
            'denominator': 20,
            'disaggregations': {
                'Gender': {
                    'Male': {'value': None, 'numerator': 5, 'denominator': 20},
                    'Female': {'value': None, 'numerator': 10, 'denominator': 20},
                }
            }
        })
