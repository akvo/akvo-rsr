from datetime import date
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.models import IndicatorPeriodData
from akvo.rsr.usecases import indicator_contribution as usecases


class TestGetIndicatorUpdateContributionCount(BaseTestCase):
    INDICATOR_1 = "Indicator #1"
    INDICATOR_2 = "Indicator #2"

    def setUp(self):
        super().setUp()
        self.lead_project = (
            ProjectFixtureBuilder()
            .with_results(
                [
                    {
                        "title": "Result #1",
                        "indicators": [
                            {
                                "title": self.INDICATOR_1,
                                "periods": [
                                    {
                                        "period_start": date(2020, 1, 1),
                                        "period_end": date(2020, 12, 31),
                                    }
                                ],
                            },
                            {
                                "title": self.INDICATOR_2,
                                "periods": [
                                    {
                                        "period_start": date(2020, 1, 1),
                                        "period_end": date(2020, 12, 31),
                                    }
                                ],
                            },
                        ],
                    }
                ]
            )
            .with_contributors(
                [
                    {"title": "Contributor #1"},
                    {"title": "Contributor #2"},
                    {"title": "Contributor #3"},
                ]
            )
            .build()
        )
        self.indicator1 = self.lead_project.indicators.get(title=self.INDICATOR_1)
        self.indicator2 = self.lead_project.indicators.get(title=self.INDICATOR_2)

        contributor1 = self.lead_project.get_contributor(title="Contributor #1")
        contributor2 = self.lead_project.get_contributor(title="Contributor #2")
        contributor3 = self.lead_project.get_contributor(title="Contributor #3")
        user = self.create_user("test1@akvo.org", "password", is_admin=True)

        contributor1.get_period(indicator__title=self.INDICATOR_1).add_update(user=user)
        contributor2.get_period(indicator__title=self.INDICATOR_1).add_update(
            user=user, status=IndicatorPeriodData.STATUS_REVISION_CODE
        )
        contributor3.get_period(indicator__title=self.INDICATOR_1).add_update(user=user)

        contributor1.get_period(indicator__title=self.INDICATOR_2).add_update(
            user=user, status=IndicatorPeriodData.STATUS_PENDING_CODE
        )

    def test_has_updates(self):
        result = usecases.get_indicator_contribution_count(self.indicator1)
        self.assertEqual(2, result)

    def test_no_updates(self):
        result = usecases.get_indicator_contribution_count(self.indicator2)
        self.assertEqual(0, result)
