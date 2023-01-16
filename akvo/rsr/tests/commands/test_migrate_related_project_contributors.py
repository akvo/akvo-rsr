from akvo.rsr.management.commands.migrate_related_project_contributors import (
    Command,
)
from akvo.rsr.management.commands.tests.base import BaseCommandTestCase
from akvo.rsr.models import Project, RelatedProject


class InternalParentTest(BaseCommandTestCase[Command]):
    """
    Test migrating from internal contributing parent in RelatedProject
    to Project.contributes_to_project
    """
    command_class = Command

    def setUp(self) -> None:
        super().setUp()
        self.maxDiff = None

        self.project = Project.objects.create(title="A project")
        self.contributing_parent = Project.objects.create(
            title="Contributing parent",
            iati_activity_id="IATI-PARENT-12345",
        )

        # The parent being contributed to
        RelatedProject.objects.create(
            project=self.project,
            related_project=self.contributing_parent,
            relation=RelatedProject.PROJECT_RELATION_PARENT,
            related_iati_id=self.contributing_parent.iati_activity_id,
        )

    def test_apply(self):
        self.run_command("--apply")

        self.project.refresh_from_db()

        self.assertEqual(self.project.contributes_to_project_id, self.contributing_parent.id)

    def test_no_apply(self):
        self.run_command()

        self.project.refresh_from_db()

        self.assertIsNone(self.project.contributes_to_project_id)


class ExternalParentTest(BaseCommandTestCase[Command]):
    """
    Test migrating from external contributing parent in RelatedProject
    to Project.external_parent_iati_activity_id
    """

    command_class = Command

    def setUp(self) -> None:
        super().setUp()
        self.maxDiff = None

        self.project = Project.objects.create(title="A project")

        self.iati_id = "IATI-test-12345"
        RelatedProject.objects.create(
            project=self.project,
            relation=RelatedProject.PROJECT_RELATION_PARENT,
            related_iati_id=self.iati_id  # this indicates a "contributes to" relationship
        )

    def test_apply(self):
        self.run_command("--apply")

        self.project.refresh_from_db()

        self.assertEqual(self.project.external_parent_iati_activity_id, self.iati_id)

    def test_no_apply(self):
        self.run_command()

        self.project.refresh_from_db()

        self.assertIsNone(self.project.external_parent_iati_activity_id)
