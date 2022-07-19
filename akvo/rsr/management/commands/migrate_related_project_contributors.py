# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from argparse import ArgumentParser
from typing import TextIO, Type

from django.apps import apps
from django.core.management.base import BaseCommand
from django.db import transaction

from akvo.rsr.models import Project, RelatedProject


class Command(BaseCommand):
    help = "Move Project contributors from RelatedProject to .contributes_to_project " \
           "and external_parent_iati_activity_id"

    def add_arguments(self, parser: ArgumentParser):
        parser.add_argument(
            "--apply", action="store_true",
            help="Actually apply the changes"
        )

    def handle(self, *args, **options):
        migrator = Migrator(
            self.stdout, self.stderr,
            apps.get_model("rsr", "Project"),
            apps.get_model("rsr", "RelatedProject"),
            options.get("apply", False),
        )
        migrator.run()


class Migrator:

    def __init__(
            self,
            stdout: TextIO,
            stderr: TextIO,
            project_model: Type[Project],
            related_project_model: Type[RelatedProject],
            apply: bool = False
    ):
        self.stdout = stdout
        self.stderr = stderr
        self.project_model = project_model
        self.related_project_model = related_project_model
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
        self.out("===Migrating contributing projects from RelatedProject")
        apply = self.apply

        self.migrate_related_parents()
        self.migrate_external_related_parents()

        if not apply:
            raise InterruptedError()

    def migrate_related_parents(self):
        """
        Internal (in RSR) parent projects that are contributed to are migrated to the Project model
        """
        related_parents = RelatedProject.objects.filter(
            relation=RelatedProject.PROJECT_RELATION_PARENT,
            related_project__isnull=False,
        ).exclude(
            related_iati_id=""  # when blank it mean it doesn't "contribute"
        ).select_related("project")

        projects = []
        for related_parent in related_parents:
            project = related_parent.project
            project.external_parent_iati_activity_id = None
            project.contributes_to_project = related_parent.related_project
            projects.append(project)

        self.project_model.objects.bulk_update(projects, ["contributes_to_project"])

        self.out("Updated %s external contributing parents for projects:" % len(projects))
        for project in projects:
            self.out("\t%s: %s" % (project, project.contributes_to_project))

    def migrate_external_related_parents(self):
        """
        External (outside of RSR) parent projects that are contributed to are migrated to the Project model
        """
        external_related_parents = RelatedProject.objects.filter(
            relation=RelatedProject.PROJECT_RELATION_PARENT,
            related_project__isnull=True,
        ).exclude(
            related_iati_id=""  # when blank it mean it doesn't "contribute"
        ).select_related("project")

        projects = []
        for external_related_parent in external_related_parents:
            project = external_related_parent.project
            project.external_parent_iati_activity_id = external_related_parent.related_iati_id
            project.contributes_to_project = None
            projects.append(project)

        self.project_model.objects.bulk_update(projects, ["external_parent_iati_activity_id"])
        self.out("Updated %s external contributing parents for projects:" % len(projects))
        for project in projects:
            self.out("\t%s: %s" % (project, project.external_parent_iati_activity_id))
