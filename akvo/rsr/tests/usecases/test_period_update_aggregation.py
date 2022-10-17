from datetime import date
from unittest.mock import patch
from akvo.utils import maybe_decimal
from akvo.rsr.models import IndicatorPeriod
from akvo.rsr.usecases.period_update_aggregation import aggregate
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder


class PeriodUpdateAggregationTestCase(BaseTestCase):
    CONTRIBUTOR_LEVEL_1 = 'L1 contributor'
    CONTRIBUTOR_LEVEL_2_1 = 'L2 contributor #1'
    CONTRIBUTOR_LEVEL_2_2 = 'L2 contributor #2'
    DISAGGREGATION_CATEGORY = 'Gender'
    DISAGGREGATION_TYPE_1 = 'Male'
    DISAGGREGATION_TYPE_2 = 'Female'
    PERIOD_START = date(2020, 1, 1)

    def setUp(self):
        super().setUp()
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)
        self.lead_project = ProjectFixtureBuilder().with_contributors([{
            'title': self.CONTRIBUTOR_LEVEL_1,
            'contributors': [
                {'title': self.CONTRIBUTOR_LEVEL_2_1},
                {'title': self.CONTRIBUTOR_LEVEL_2_2},
            ]
        }]).with_disaggregations({
            self.DISAGGREGATION_CATEGORY: [
                self.DISAGGREGATION_TYPE_1,
                self.DISAGGREGATION_TYPE_2,
            ]
        }).with_results([{
            'title': 'Result #1',
            'indicators': [{
                'title': 'Indicator #1',
                'periods': [
                    {'period_start': self.PERIOD_START, 'period_end': date(2020, 12, 31)},
                ]
            }]
        }]).build()

        self.l1_contributor = self.lead_project.get_contributor(title=self.CONTRIBUTOR_LEVEL_1)
        self.l2_1_contributor = self.l1_contributor.get_contributor(title=self.CONTRIBUTOR_LEVEL_2_1)
        self.l2_2_contributor = self.l1_contributor.get_contributor(title=self.CONTRIBUTOR_LEVEL_2_2)
        self.l2_1_period = self.l2_1_contributor.get_period(period_start=self.PERIOD_START)
        self.l2_2_period = self.l2_2_contributor.get_period(period_start=self.PERIOD_START)

        self.l2_1_period.add_update(user=self.user, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        self.l2_2_period.add_update(user=self.user, value=3, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 2},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })

    def get_disaggregation_value(self, period, disaggregation_type):
        return period.disaggregations.get(dimension_value__value=disaggregation_type).value

    def test_not_automatically_aggregated(self):
        ''' Ensure the legacy behavior that performs aggregation when period updates are saved is not running '''
        l2_1_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual('', l2_1_period.actual_value)
        self.assertEqual(0, l2_1_period.disaggregations.count())

        l2_2_period = self.l2_2_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual('', l2_2_period.actual_value)
        self.assertEqual(0, l2_2_period.disaggregations.count())

        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual('', l1_period.actual_value)
        self.assertEqual(0, l1_period.disaggregations.count())

        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        self.assertEqual('', lead_period.actual_value)
        self.assertEqual(0, lead_period.disaggregations.count())

    def test_aggregation(self):
        ''' Aggregated update from all Level 2 contributors '''
        l2_1_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        l2_2_period = self.l2_2_contributor.periods.get(period_start=self.PERIOD_START)
        aggregate(l2_1_period)
        aggregate(l2_2_period)

        l2_1_period.refresh_from_db()
        self.assertEqual(2, maybe_decimal(l2_1_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(l2_1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l2_1_period, self.DISAGGREGATION_TYPE_2))

        l2_2_period.refresh_from_db()
        self.assertEqual(3, maybe_decimal(l2_2_period.actual_value))
        self.assertEqual(2, self.get_disaggregation_value(l2_2_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l2_2_period, self.DISAGGREGATION_TYPE_2))

        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(5, maybe_decimal(l1_period.actual_value))
        self.assertEqual(3, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(2, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_2))

        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(5, maybe_decimal(lead_period.actual_value))
        self.assertEqual(3, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(2, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_2))

    def test_rollback(self):
        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        l2_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        orig = IndicatorPeriod.save

        def mocked_indicator_period_save(self, *args, **kwargs):
            if self == lead_period:
                raise Exception('Rollback transaction!')
            return orig(self, *args, **kwargs)

        with patch('akvo.rsr.models.result.indicator_period.IndicatorPeriod.save', new=mocked_indicator_period_save):
            try:
                aggregate(l2_period)
            except Exception:
                pass

        l2_period.refresh_from_db()
        self.assertEqual('', l2_period.actual_value)
        self.assertEqual(0, l2_period.disaggregations.count())

        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual('', l1_period.actual_value)
        self.assertEqual(0, l1_period.disaggregations.count())

        lead_period.refresh_from_db()
        self.assertEqual('', lead_period.actual_value)
        self.assertEqual(0, lead_period.disaggregations.count())

    def test_level_1_has_update(self):
        ''' Updates on level 1 project should be aggregated '''
        self.l1_contributor.get_period(period_start=self.PERIOD_START).add_update(
            user=self.user,
            value=3,
            disaggregations={
                self.DISAGGREGATION_CATEGORY: {
                    self.DISAGGREGATION_TYPE_1: {'value': 2},
                    self.DISAGGREGATION_TYPE_2: {'value': 1},
                }
            }
        )
        l2_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        aggregate(l2_period)
        aggregate(l1_period)

        l2_period.refresh_from_db()
        self.assertEqual(2, maybe_decimal(l2_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(l2_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l2_period, self.DISAGGREGATION_TYPE_2))

        l1_period.refresh_from_db()
        self.assertEqual(5, maybe_decimal(l1_period.actual_value))
        self.assertEqual(3, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(2, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_2))

        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(5, maybe_decimal(lead_period.actual_value))
        self.assertEqual(3, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(2, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_2))

    def test_delete_update(self):
        ''' Simulate indicator update deletion '''
        l2_1_period = self.l2_1_contributor.periods.get(period_start=self.PERIOD_START)
        l2_2_period = self.l2_2_contributor.periods.get(period_start=self.PERIOD_START)
        aggregate(l2_1_period)
        aggregate(l2_2_period)

        l2_2_update = l2_2_period.data.first()
        l2_2_update.delete()
        aggregate(l2_2_period)

        l2_1_period.refresh_from_db()
        self.assertEqual(2, maybe_decimal(l2_1_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(l2_1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l2_1_period, self.DISAGGREGATION_TYPE_2))

        l2_2_period.refresh_from_db()
        self.assertEqual('', l2_2_period.actual_value)
        self.assertEqual(None, self.get_disaggregation_value(l2_2_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(None, self.get_disaggregation_value(l2_2_period, self.DISAGGREGATION_TYPE_2))

        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(2, maybe_decimal(l1_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(l1_period, self.DISAGGREGATION_TYPE_2))

        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        self.assertEqual(2, maybe_decimal(lead_period.actual_value))
        self.assertEqual(1, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, self.get_disaggregation_value(lead_period, self.DISAGGREGATION_TYPE_2))
