import argparse

import tablib
from django.core.management import BaseCommand
from django.db.models import QuerySet

from akvo.rsr.models import IndicatorPeriod


class Command(BaseCommand):
    help = "Find and delete problematic indicator periods"

    def add_arguments(self, parser: argparse.ArgumentParser):
        parser.add_argument("--exec", action="store_true")

    def handle(self, *args, **options):
        execute = options["exec"]
        self.handle_orphans(execute)

    def write(self, msg: str):
        self.stdout.write(msg)

    def handle_orphans(self, execute=False):
        orphans = self.get_orphans()
        distinct_orphans = orphans.distinct()  # can't call delete after distinct()
        distinct_orphan_count = distinct_orphans.count()
        if distinct_orphan_count <= 0:
            self.write("No orphaned periods to delete")
            return

        tabber = tablib.Dataset(
            headers=[
                "Period ID",
                "Indicator ID",
                "Project ID",
                "Parent Indicator ID",
                "Parent Project ID",
                "Start date",
                "End date",
            ]
        )
        period_orphans_w_related = distinct_orphans.select_related(
            "indicator",
            "indicator__result__project",
            "indicator__parent_indicator",
            "indicator__parent_indicator__result__project",
        )
        for period in period_orphans_w_related:
            tabber.append(
                [
                    period.id,
                    period.indicator.id,
                    period.indicator.result.project.id,
                    period.indicator.parent_indicator.id,
                    period.indicator.parent_indicator.result.project.id,
                    period.period_start,
                    period.period_end,
                ]
            )
        self.write(tabber.export('csv'))

        if execute:
            orphans.delete()
            self.write(f"Deleted {distinct_orphan_count} orphaned period(s)")
        else:
            self.write(f"Would've deleted {distinct_orphan_count} orphaned period(s)")

    @staticmethod
    def get_orphans() -> QuerySet[IndicatorPeriod]:
        """
        Leftover periods from when parent periods were deleted but the children stayed
        """
        return IndicatorPeriod.objects.filter(
            parent_period__isnull=True,
            indicator__parent_indicator__isnull=False,
            data__isnull=True,  # Can't delete periods with data
        ).order_by("id")
