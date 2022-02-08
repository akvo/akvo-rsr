from akvo.rsr.management.commands.cleanup_indicator_periods import Command
from akvo.rsr.management.commands.tests.base import BaseCommandTestCase
from akvo.rsr.models import IndicatorPeriod
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder


class TestHierarchyBase(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.org = self.create_organisation('My Org')
        self.root_project_facade = ProjectFixtureBuilder() \
            .with_results(
            [{
                'title': 'Result #1',
                'indicators': [
                    {'title': 'Indicator #1', 'periods': [{'period_start': '2020-01-01', 'period_end': '2020-01-31'}]},
                    {'title': 'Indicator #2', 'periods': [{'period_start': '2020-03-01', 'period_end': '2020-03-31'}]},
                ]
            }]
        ) \
            .with_contributors(
            [
                {'title': 'Contrib #1'},
            ]
        ) \
            .build()
        self.program = self.create_project_hierarchy(self.org, self.root_project_facade.object, 2)
        self.root_project = self.root_project_facade.object
        self.contributor_project = self.root_project_facade.get_contributor(title="Contrib #1").object
        self.parent_period = IndicatorPeriod.objects.filter(indicator__result=self.root_project.results.first()).first()
        self.child_period = IndicatorPeriod.objects.filter(
            indicator__result=self.contributor_project.results.first()
        ).first()

    def create_orphan(self):
        # Create orphan
        self.child_period.parent_period = None
        self.child_period.save()
        self.parent_period.delete()


class TestFindOrphan(TestHierarchyBase):

    def test_find_orphan(self):
        self.create_orphan()

        # Ensure our orphan can be found
        self.assertIn(self.child_period, Command.get_orphans())

    def test_cannot_find_orphans(self):
        self.assertEqual(Command.get_orphans().count(), 0)


class TestDeleteOrphans(BaseCommandTestCase, TestHierarchyBase):
    command_class = Command

    def test_with_orphan(self):
        self.create_orphan()

        self.run_command()
        self.assertIn("Would've deleted 1 orphaned period(s)", self.stdout.getvalue())

        # Ensure our orphan can still be found
        self.assertIn(self.child_period, Command.get_orphans())

    def test_with_exec(self):
        self.create_orphan()

        self.run_command("--exec")
        self.assertIn("Deleted 1 orphaned period(s)", self.stdout.getvalue())

        # Ensure our orphan can still be found
        self.assertEqual(Command.get_orphans().count(), 0)

    def test_without_orphan(self):
        self.run_command()
        self.assertIn("No orphaned periods to delete", self.stdout.getvalue())


class TestNoOrphans(BaseTestCase):

    def test_cannot_find_orphans(self):
        ProjectFixtureBuilder() \
            .with_results(
            [{
                'title': 'Result #1',
                'indicators': [
                    {'title': 'Indicator #1', 'periods': [{'period_start': '2020-01-01', 'period_end': '2020-01-31'}]},
                ]
            }]
        ) \
            .build()

        self.assertEqual(Command.get_orphans().count(), 0)
