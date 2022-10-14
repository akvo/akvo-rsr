from datetime import date
from akvo.rsr.usecases.period_update_aggregation import aggregate
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder


class PeriodUpdateAggregationTestCase(BaseTestCase):
    CONTRIBUTOR_LEVEL_1 = 'L1 contributor'
    CONTRIBUTOR_LEVEL_2 = 'L2 contributor'
    DISAGGREGATION_CATEGORY = 'Gender'
    DISAGGREGATION_TYPE_1 = 'Male'
    DISAGGREGATION_TYPE_2 = 'Female'
    PERIOD_START = date(2020, 1, 1)

    def setUp(self):
        super().setUp()
        user = self.create_user('test@akvo.org', 'password', is_admin=True)
        self.lead_project = ProjectFixtureBuilder().with_contributors([{
            'title': self.CONTRIBUTOR_LEVEL_1,
            'contributors': [
                {'title': self.CONTRIBUTOR_LEVEL_2}
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
        self.l2_contributor = self.l1_contributor.get_contributor(title=self.CONTRIBUTOR_LEVEL_2)
        self.l2_period = self.l2_contributor.get_period(period_start=self.PERIOD_START)

        self.l2_period.add_update(user=user, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })

    def test_not_automatically_aggregated(self):
        ''' Ensure the legacy behavior that performs aggregation when period updates are saved is not running '''
        lead_period = self.lead_project.periods.get(period_start=self.PERIOD_START)
        l1_period = self.l1_contributor.periods.get(period_start=self.PERIOD_START)
        l2_period = self.l2_contributor.periods.get(period_start=self.PERIOD_START)

        self.assertEqual('', l2_period.actual_value)
        self.assertEqual(0, l2_period.disaggregations.count())
        self.assertEqual('', l1_period.actual_value)
        self.assertEqual(0, l1_period.disaggregations.count())
        self.assertEqual('', lead_period.actual_value)
        self.assertEqual(0, lead_period.disaggregations.count())
