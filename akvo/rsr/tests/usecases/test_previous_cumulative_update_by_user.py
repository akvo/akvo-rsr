from datetime import date
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.models.result.utils import PERCENTAGE_MEASURE, calculate_percentage
from akvo.rsr.usecases.previous_cumulative_update_by_user import get_previous_cumulative_update_value, empty_result

INDICATOR_TITLE = 'Indicator #1'
PERIOD_START_1 = date(2010, 1, 1)
PERIOD_START_2 = date(2011, 1, 1)
DISAGGREGATION_CATEGORY = 'Gender'
DISAGGREGATION_TYPE_1 = 'Male'
DISAGGREGATION_TYPE_2 = 'Female'


class BaseCumulativeTestCase(BaseTestCase):
    def setup_fixture(self, cumulative=False, percentage=False):
        indicator = {'title': INDICATOR_TITLE}
        if cumulative:
            indicator['cumulative'] = True
        if percentage:
            indicator['measure'] = PERCENTAGE_MEASURE
        indicator['periods'] = [
            {
                'period_start': PERIOD_START_1,
                'period_end': date(2010, 12, 31),
            },
            {
                'period_start': PERIOD_START_2,
                'period_end': date(2011, 12, 31),
            },
        ]
        self.project = ProjectFixtureBuilder()\
            .with_disaggregations({
                DISAGGREGATION_CATEGORY: [DISAGGREGATION_TYPE_1, DISAGGREGATION_TYPE_2]
            })\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [indicator]
                }
            ])\
            .build()
        self.indicator = self.project.indicators.get(title=INDICATOR_TITLE)

    def add_update(self, user, period_start, value=None, numerator=None, denominator=None, disaggregations=None):
        disaggregations_value = {}
        if disaggregations:
            disaggregations_value[DISAGGREGATION_CATEGORY] = disaggregations
        self.project.get_period(period_start=period_start).add_update(
            user=user,
            value=value,
            numerator=numerator,
            denominator=denominator,
            disaggregations=disaggregations_value
        )

    def get_previous_cumulative_update_value(self, user):
        return get_previous_cumulative_update_value(user, self.indicator)


class NonCumulativeIndicatorTestCase(BaseCumulativeTestCase):

    def setUp(self):
        super().setUp()
        self.setup_fixture()
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)

    def test_no_cumulative_update(self):
        self.add_update(self.user, PERIOD_START_1, value=10, disaggregations={
            DISAGGREGATION_TYPE_1: {'value': 3},
            DISAGGREGATION_TYPE_2: {'value': 7},
        })
        result = self.get_previous_cumulative_update_value(self.user)
        self.assertEqual(result, empty_result())


class CumulativeUnitIndicatorUserUpdateTestCase(BaseCumulativeTestCase):

    def setUp(self):
        super().setUp()
        self.setup_fixture(cumulative=True)
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)

    def test_no_updates(self):
        result = self.get_previous_cumulative_update_value(self.user)
        self.assertEqual(result, empty_result())

    def test_multiple_updates_one_period(self):
        self.add_update(self.user, PERIOD_START_1, value=10, disaggregations={
            DISAGGREGATION_TYPE_1: {'value': 3},
            DISAGGREGATION_TYPE_2: {'value': 7},
        })
        self.add_update(self.user, PERIOD_START_1, value=15, disaggregations={
            DISAGGREGATION_TYPE_1: {'value': 5},
            DISAGGREGATION_TYPE_2: {'value': 10},
        })
        result = self.get_previous_cumulative_update_value(self.user)
        self.assertEqual(result, {
            'value': 15,
            'numerator': None,
            'denominator': None,
            'disaggregations': {
                DISAGGREGATION_CATEGORY: {
                    DISAGGREGATION_TYPE_1: {'value': 5, 'numerator': None, 'denominator': None},
                    DISAGGREGATION_TYPE_2: {'value': 10, 'numerator': None, 'denominator': None},
                }
            }
        })

    def test_multiple_period(self):
        ''' The updates are simulated in reverse order to ensure that the the values are accumulated correctly '''
        self.add_update(self.user, PERIOD_START_2, value=15, disaggregations={
            DISAGGREGATION_TYPE_1: {'value': 5},
            DISAGGREGATION_TYPE_2: {'value': 10},
        })
        self.add_update(self.user, PERIOD_START_1, value=10, disaggregations={
            DISAGGREGATION_TYPE_1: {'value': 3},
            DISAGGREGATION_TYPE_2: {'value': 7},
        })
        result = self.get_previous_cumulative_update_value(self.user)
        self.assertEqual(result, {
            'value': 15,
            'numerator': None,
            'denominator': None,
            'disaggregations': {
                DISAGGREGATION_CATEGORY: {
                    DISAGGREGATION_TYPE_1: {'value': 5, 'numerator': None, 'denominator': None},
                    DISAGGREGATION_TYPE_2: {'value': 10, 'numerator': None, 'denominator': None},
                }
            }
        })

    def test_multiple_user(self):
        other_user = self.create_user('other_user@akvo.org', 'password', is_admin=True)
        self.add_update(self.user, PERIOD_START_1, value=10, disaggregations={
            DISAGGREGATION_TYPE_1: {'value': 3},
            DISAGGREGATION_TYPE_2: {'value': 7},
        })
        self.add_update(other_user, PERIOD_START_1, value=15, disaggregations={
            DISAGGREGATION_TYPE_1: {'value': 5},
            DISAGGREGATION_TYPE_2: {'value': 10},
        })
        result = self.get_previous_cumulative_update_value(self.user)
        self.assertEqual(result, {
            'value': 10,
            'numerator': None,
            'denominator': None,
            'disaggregations': {
                DISAGGREGATION_CATEGORY: {
                    DISAGGREGATION_TYPE_1: {'value': 3, 'numerator': None, 'denominator': None},
                    DISAGGREGATION_TYPE_2: {'value': 7, 'numerator': None, 'denominator': None},
                }
            }
        })


class CumulativePercentageIndicatorUpdateTestCase(BaseCumulativeTestCase):

    def setUp(self):
        super().setUp()
        self.setup_fixture(cumulative=True, percentage=True)
        self.user = self.create_user('test_user@akvo.org', 'password', is_admin=True)

    def test_multiple_period(self):
        self.add_update(self.user, PERIOD_START_1, numerator=10, denominator=10, disaggregations={
            DISAGGREGATION_TYPE_1: {'numerator': 3, 'denominator': 10},
            DISAGGREGATION_TYPE_2: {'numerator': 7, 'denominator': 10},
        })
        self.add_update(self.user, PERIOD_START_2, numerator=15, denominator=20, disaggregations={
            DISAGGREGATION_TYPE_1: {'numerator': 5, 'denominator': 20},
            DISAGGREGATION_TYPE_2: {'numerator': 10, 'denominator': 20},
        })
        result = self.get_previous_cumulative_update_value(self.user)
        self.assertEqual(result, {
            'value': calculate_percentage(15, 20),
            'numerator': 15,
            'denominator': 20,
            'disaggregations': {
                DISAGGREGATION_CATEGORY: {
                    DISAGGREGATION_TYPE_1: {'value': None, 'numerator': 5, 'denominator': 20},
                    DISAGGREGATION_TYPE_2: {'value': None, 'numerator': 10, 'denominator': 20},
                }
            }
        })
