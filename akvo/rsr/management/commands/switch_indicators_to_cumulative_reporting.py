import argparse
from io import TextIOBase
from typing import List
from django.core.management.base import BaseCommand
from django.db import transaction
from akvo.rsr.models import Project, Indicator
from akvo.rsr.models.result.utils import QUANTITATIVE


class Command(BaseCommand):
    help = "Switch all quantitative indicators of the given project and its descendants to cumulative reporting"

    def add_arguments(self, parser: argparse.ArgumentParser):
        parser.add_argument("project_id", type=int)
        parser.add_argument(
            "--exclude", nargs="+", help="ID of indicators that should not be changed"
        )
        parser.add_argument(
            "--dry-run", action="store_true", help="Don not actually apply the changes"
        )

    def handle(self, *args, **options):
        project = Project.objects.get(id=int(options["project_id"]))
        excludes = [int(id) for id in options["exclude"]] if options["exclude"] else []
        runner = CommandRunner(self.stdout, project, excludes, options["dry_run"])

        try:
            runner.run()
        except InterruptedError:
            self.stdout.write("Changes not applied\n")
        else:
            self.stdout.write("Changes applied\n")
        self.stdout.write("DONE!\n")


class CommandRunner:
    def __init__(
        self, stdout: TextIOBase, project: Project, excludes: List[int], dry_run=False
    ):
        self.stdout = stdout
        self.project = project
        self.excludes = excludes
        self.dry_run = dry_run

    @transaction.atomic
    def run(self):
        indicators = Indicator.objects.filter(
            result__project=self.project, type=QUANTITATIVE
        )
        if self.excludes:
            indicators = indicators.exclude(id__in=self.excludes)
        self.stdout.write(
            f"Switching {indicators.count()} indicators to cumulative reporting\n"
        )
        for indicator in indicators:
            indicator.cumulative = True
            indicator.save()
        if self.dry_run:
            raise InterruptedError()
