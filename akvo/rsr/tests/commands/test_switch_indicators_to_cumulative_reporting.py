from datetime import date
from akvo.rsr.management.commands.switch_indicators_to_cumulative_reporting import (
    Command,
)
from akvo.rsr.management.commands.tests.base import BaseCommandTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.models import Indicator
from akvo.rsr.models.result.utils import QUALITATIVE, QUANTITATIVE


class CommandTestCase(BaseCommandTestCase[Command]):
    INDICATOR_1 = "Indicator #1"
    INDICATOR_2 = "Indicator #2"
    INDICATOR_3 = "Indicator #3"
    INDEPENDENT_INDICATOR = "Independent indicator"
    CONTRIBUTOR_1 = "Contributor #1"

    command_class = Command

    def setUp(self):
        super().setUp()
        user = self.create_user("test1@akvo.org", "password", is_admin=True)
        self.project = (
            ProjectFixtureBuilder()
            .with_results(
                [
                    {
                        "title": "Result #1",
                        "indicators": [
                            {
                                "title": self.INDICATOR_1,
                                "type": QUANTITATIVE,
                                "cumulative": False,
                                "periods": [
                                    {
                                        "period_start": date(2020, 1, 1),
                                        "period_end": date(2020, 12, 31),
                                    }
                                ],
                            },
                            {
                                "title": self.INDICATOR_2,
                                "type": QUANTITATIVE,
                                "cumulative": False,
                                "periods": [
                                    {
                                        "period_start": date(2020, 1, 1),
                                        "period_end": date(2020, 12, 31),
                                    }
                                ],
                            },
                            {
                                "title": self.INDICATOR_3,
                                "type": QUALITATIVE,
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
            .with_contributors([{"title": self.CONTRIBUTOR_1}])
            .build()
        )
        self.contributor = self.project.get_contributor(title=self.CONTRIBUTOR_1)

        # simulate indicator that has an update
        self.contributor.get_period(indicator__title=self.INDICATOR_1).add_update(
            user=user
        )

        # simulate indicator in the contributor project that doesn't inherit from the lead project
        contrib_result = self.contributor.results.first()
        Indicator.objects.create(
            result=contrib_result,
            title=self.INDEPENDENT_INDICATOR,
            type=QUANTITATIVE,
            cumulative=False,
        )

        self.c.login(username=user.email, password="password")

    def test_run(self):
        self.run_command(str(self.project.object.id))

        self.assertTrue(self.project.indicators.get(title=self.INDICATOR_1).cumulative)
        self.assertTrue(self.project.indicators.get(title=self.INDICATOR_2).cumulative)
        self.assertFalse(self.project.indicators.get(title=self.INDICATOR_3).cumulative)

        self.assertTrue(
            self.contributor.indicators.get(title=self.INDICATOR_1).cumulative
        )
        self.assertTrue(
            self.contributor.indicators.get(title=self.INDICATOR_2).cumulative
        )
        self.assertFalse(
            self.contributor.indicators.get(title=self.INDICATOR_3).cumulative
        )
        self.assertTrue(
            self.contributor.indicators.get(title=self.INDEPENDENT_INDICATOR).cumulative
        )

    def test_dry_run(self):
        self.run_command(str(self.project.object.id), "--dry-run")

        self.assertFalse(self.project.indicators.get(title=self.INDICATOR_1).cumulative)
        self.assertFalse(self.project.indicators.get(title=self.INDICATOR_2).cumulative)

        self.assertFalse(
            self.contributor.indicators.get(title=self.INDICATOR_1).cumulative
        )
        self.assertFalse(
            self.contributor.indicators.get(title=self.INDICATOR_2).cumulative
        )
