# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from argparse import ArgumentParser
from typing import TextIO

from django.core.management.base import BaseCommand
from django.db import transaction

from akvo.rsr.models import ExternalProject, RelatedProject


class Command(BaseCommand):
    help = "Move external projects in RelatedProjects to the ExternalProject model"

    def add_arguments(self, parser: ArgumentParser):
        parser.add_argument(
            "--apply", action="store_true",
            help="Actually apply the changes"
        )

    def handle(self, *args, **options):
        migrator = Migrator(self.stdout, self.stderr, options.get("apply", False))
        migrator.run()


class Migrator:

    def __init__(self, stdout: TextIO, stderr: TextIO, apply: bool):
        self.stdout = stdout
        self.stderr = stderr
        self.apply = apply

    def run(self):
        try:
            self.migrate()
        except InterruptedError:
            self.out("Changes not applied")
        else:
            self.out("Changes applied")
        self.out("DONE!")

    def out(self, msg: str):
        self._write_to_stream(self.stdout, msg)

    def err(self, msg: str):
        self._write_to_stream(self.stderr, msg)

    def _write_to_stream(self, stream: TextIO, msg: str):
        ending = "" if msg.endswith("\n") else "\n"
        stream.write(msg + ending)
        stream.flush()

    @transaction.atomic
    def migrate(self):
        apply = self.apply
        # External projects don't have a related project attribute
        #  as only the IATI ID is entered in the frontend
        external_related_projects = RelatedProject.objects.filter(
            relation=RelatedProject.PROJECT_RELATION_CHILD,
            related_project__isnull=True,
            related_iati_id__isnull=False,
        )
        self.out("===Migrating external RelatedProjects")
        for rp in external_related_projects:
            self.migrate_related_project(rp)

        if not apply:
            raise InterruptedError()

    def migrate_related_project(self, rp: RelatedProject):
        try:
            ExternalProject.objects.create(
                related_project=rp.project,
                iati_id=rp.related_iati_id,
            )
        except ValueError:
            self.err("ExternalProject already exists: %s" % rp.related_iati_id)
