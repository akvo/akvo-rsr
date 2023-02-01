from datetime import date
from decimal import Decimal
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.models.result.utils import PERCENTAGE_MEASURE
from akvo.rsr.usecases.period_update_aggregation import aggregate


class CumulativeTestMixin:
    PERIOD_1_START = date(2020, 1, 1)
    PERIOD_2_START = date(2021, 1, 1)
    PERIOD_3_START = date(2022, 1, 1)
    DISAGGREGATION_CATEGORY = 'Gender'
    DISAGGREGATION_TYPE_1 = 'Male'
    DISAGGREGATION_TYPE_2 = 'Female'

    def setup_project(self, percentage=False, contributors=None):
        builder = ProjectFixtureBuilder().with_disaggregations({
            self.DISAGGREGATION_CATEGORY: [
                self.DISAGGREGATION_TYPE_1,
                self.DISAGGREGATION_TYPE_2,
            ]
        }).with_results([{
            'title': 'Result #1',
            'indicators': [{
                'title': 'Indicator #1',
                'measure': PERCENTAGE_MEASURE if percentage else '',
                'cumulative': True,
                'periods': [
                    {'period_start': self.PERIOD_1_START, 'period_end': date(2020, 12, 31)},
                    {'period_start': self.PERIOD_2_START, 'period_end': date(2021, 12, 31)},
                    {'period_start': self.PERIOD_3_START, 'period_end': date(2022, 12, 31)},
                ]
            }]
        }])
        if contributors:
            builder.with_contributors(contributors)
        return builder.build()


class SingleUserCumulativeUnitUpdatesTestCase(CumulativeTestMixin, BaseTestCase):

    def setUp(self):
        super().setUp()
        user = self.create_user('test@akvo.org', 'password', is_admin=True)
        self.project = self.setup_project()

        self.period1 = self.project.get_period(period_start=self.PERIOD_1_START)
        self.period1.add_update(user=user, value=1, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
            }
        })
        self.period1.add_update(user=user, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        aggregate(self.period1.object)

        self.period2 = self.project.get_period(period_start=self.PERIOD_2_START)
        self.period2.add_update(user=user, value=3, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 2},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        self.period2.add_update(user=user, value=5, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 3},
                self.DISAGGREGATION_TYPE_2: {'value': 2},
            }
        })
        aggregate(self.period2.object)

        self.period3 = self.project.get_period(period_start=self.PERIOD_3_START)
        aggregate(self.period3.object)

    def test_period1(self):
        period1 = self.project.periods.get(id=self.period1.id)
        self.assertEqual(2, Decimal(period1.actual_value))
        self.assertEqual(1, period1.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).value)
        self.assertEqual(1, period1.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_2).value)

    def test_period2(self):
        period2 = self.project.periods.get(id=self.period2.id)
        self.assertEqual(5, Decimal(period2.actual_value))
        self.assertEqual(3, period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).value)
        self.assertEqual(2, period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_2).value)

    def test_period_without_updates(self):
        """
        A cumulative indicator in a new period should carry over the value from the last period
        """
        period3 = self.project.periods.get(id=self.period3.id)
        self.assertEqual(5, Decimal(period3.actual_value))


class MultiUserCumulativeUnitUpdatesTestCase(CumulativeTestMixin, BaseTestCase):

    def setUp(self):
        super().setUp()
        user1 = self.create_user('test1@akvo.org', 'password', is_admin=True)
        user2 = self.create_user('test2@akvo.org', 'password', is_admin=True)
        self.project = self.setup_project()

        self.period1 = self.project.get_period(period_start=self.PERIOD_1_START)
        self.period1.add_update(user=user1, value=1, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
            }
        })
        self.period1.add_update(user=user1, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        self.period1.add_update(user=user2, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_2: {'value': 2},
            }
        })
        aggregate(self.period1.object)

        self.period2 = self.project.get_period(period_start=self.PERIOD_2_START)
        self.period2.add_update(user=user2, value=3, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 2},
            }
        })
        self.period2.add_update(user=user2, value=4, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 2},
                self.DISAGGREGATION_TYPE_2: {'value': 2},
            }
        })
        aggregate(self.period2.object)

    def test_period1(self):
        period1 = self.project.periods.get(id=self.period1.id)
        self.assertEqual(4, Decimal(period1.actual_value))
        self.assertEqual(1, period1.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).value)
        self.assertEqual(3, period1.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_2).value)

    def test_period2(self):
        period2 = self.project.periods.get(id=self.period2.id)
        self.assertEqual(6, Decimal(period2.actual_value))
        self.assertEqual(3, period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).value)
        self.assertEqual(3, period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_2).value)


class CumulativePercentageUpdatesTestCase(CumulativeTestMixin, BaseTestCase):
    '''
    Since updates can only be made once per period for percentage indicators,
    there is no difference in behavior between cumulative and non-cumulative.
    The following test is to make sure everything is still working as it should.
    '''

    def setUp(self):
        super().setUp()
        user1 = self.create_user('test1@akvo.org', 'password', is_admin=True)
        user2 = self.create_user('test2@akvo.org', 'password', is_admin=True)
        self.project = self.setup_project(percentage=True)

        self.period1 = self.project.get_period(period_start=self.PERIOD_1_START)
        self.period1.add_update(user=user1, numerator=1, denominator=4, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'numerator': 1, 'denominator': 4},
            }
        })
        aggregate(self.period1.object)

        self.period2 = self.project.get_period(period_start=self.PERIOD_2_START)
        self.period2.add_update(user=user2, numerator=2, denominator=4, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'numerator': 1, 'denominator': 4},
                self.DISAGGREGATION_TYPE_2: {'numerator': 1, 'denominator': 4},
            }
        })
        aggregate(self.period2.object)

    def test_period1(self):
        period1 = self.project.periods.get(id=self.period1.id)
        self.assertEqual(25, Decimal(period1.actual_value))
        self.assertEqual(1, Decimal(period1.numerator))
        self.assertEqual(4, Decimal(period1.denominator))
        self.assertEqual(1, period1.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).numerator)
        self.assertEqual(4, period1.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).denominator)

    def test_period2(self):
        period2 = self.project.periods.get(id=self.period2.id)
        self.assertEqual(50, Decimal(period2.actual_value))
        self.assertEqual(2, Decimal(period2.numerator))
        self.assertEqual(4, Decimal(period2.denominator))
        self.assertEqual(1, period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).numerator)
        self.assertEqual(4, period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).denominator)
        self.assertEqual(1, period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_2).numerator)
        self.assertEqual(4, period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_2).denominator)


class CumulativeAggregationTestCase(CumulativeTestMixin, BaseTestCase):

    def setUp(self):
        super().setUp()
        user1 = self.create_user('test1@akvo.org', 'password', is_admin=True)
        user2 = self.create_user('test2@akvo.org', 'password', is_admin=True)
        self.lead_project = self.setup_project(contributors=[
            {'title': 'Contrib #1'},
            {'title': 'Contrib #2'}
        ])

        contrib1_project = self.lead_project.get_contributor(title='Contrib #1')
        contrib2_project = self.lead_project.get_contributor(title='Contrib #2')
        contrib1_period1 = contrib1_project.get_period(period_start=self.PERIOD_1_START)
        contrib1_period2 = contrib1_project.get_period(period_start=self.PERIOD_2_START)
        contrib2_period1 = contrib2_project.get_period(period_start=self.PERIOD_1_START)
        contrib2_period2 = contrib2_project.get_period(period_start=self.PERIOD_2_START)

        contrib1_period1.add_update(user=user1, value=1, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 0},
            }
        })
        aggregate(contrib1_period1.object)
        contrib1_period2.add_update(user=user2, value=1, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 0},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        aggregate(contrib1_period2.object)

        contrib2_period1.add_update(user=user1, value=1, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 0},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        aggregate(contrib2_period1.object)
        contrib2_period2.add_update(user=user1, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        aggregate(contrib2_period2.object)

    def test_lead_period1(self):
        lead_period1 = self.lead_project.periods.get(period_start=self.PERIOD_1_START)
        self.assertEqual(2, Decimal(lead_period1.actual_value))
        self.assertEqual(1, lead_period1.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).value)
        self.assertEqual(1, lead_period1.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_2).value)

    def test_lead_period2(self):
        lead_period2 = self.lead_project.periods.get(period_start=self.PERIOD_2_START)
        self.assertEqual(4, Decimal(lead_period2.actual_value))
        self.assertEqual(2, lead_period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_1).value)
        self.assertEqual(2, lead_period2.disaggregations.get(dimension_value__value=self.DISAGGREGATION_TYPE_2).value)
