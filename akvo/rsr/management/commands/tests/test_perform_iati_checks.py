import datetime

from akvo.rsr.management.commands.perform_iati_checks import Command
from akvo.rsr.management.commands.tests.base import BaseCommandTestCase
from akvo.rsr.models import Project


class TestPerformIatiChecks(BaseCommandTestCase[Command]):
    command_class = Command

    def test_no_options(self):
        project_ids_to_check = [
            Project.objects.create(title=f"Check Project {i}", run_iati_checks=True).pk
            for i in range(10)
        ]
        for i in range(10):
            Project.objects.create(title=f"No check Project {i}", run_iati_checks=False)

        self.run_command()
        self.assertIn("No options provided:", self.stdout.getvalue())

        self.assertEqual(
            Project.objects.filter(
                pk__in=project_ids_to_check,
                run_iati_checks=True,
            ).count(), 0
        )

    def test_option_all(self):
        """pass --all to check all projects"""
        for i in range(10):
            Project.objects.create(title=f"Project {i}", run_iati_checks=True)

        self.run_command("--all")
        self.assertIn("Checking ALL projects", self.stdout.getvalue())

        self.assertEqual(Project.objects.filter(run_iati_checks=True).count(), 0)


class TestDateFilters(BaseCommandTestCase[Command]):
    command_class = Command

    def setUp(self):
        super().setUp()
        # 10 projects marked to be checked
        self.projects = []
        for i in range(1, 11):
            project = self.create_project(f"Project {i}", created_at=datetime.datetime(2010, 10, i))
            project.run_iati_checks = True
            self.projects.append(project)
        Project.objects.bulk_update(self.projects, ["run_iati_checks"])

    def test_option_date_start(self):
        """Projects after the given date should be checked"""

        self.run_command("--date-start", "2010-10-6")
        self.assertIn("Filtering projects on and after", self.stdout.getvalue())

        # Half of the project should've been checked
        self.assertEqual(Project.objects.filter(run_iati_checks=True).count(), 5)

    def test_option_date_end(self):
        """Projects after the given date should be checked"""

        self.run_command("--date-end", "2010-10-5")
        self.assertIn("Filtering projects on and after", self.stdout.getvalue())

        # Half of the project should've been checked
        self.assertEqual(Project.objects.filter(run_iati_checks=True).count(), 5)

    def test_date_range(self):
        """Project between two dates should be checked"""

        self.run_command("--date-start", "2010-10-4", "--date-end", "2010-10-6")
        self.assertIn("Filtering projects before", self.stdout.getvalue())
        self.assertIn("Filtering projects after", self.stdout.getvalue())

        # Half of the project should've been checked
        self.assertEqual(Project.objects.filter(run_iati_checks=False).count(), 3)
