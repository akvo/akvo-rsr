from akvo.rsr.models import Project
from akvo.rsr.tests.base import BaseTestCase


class UsesSingleIndicatorPeriodTest(BaseTestCase):

    def setUp(self):
        self.project = Project.objects.create(title="Test project")

    def test_no_indicators(self):
        self.assertIsNone(self.project.uses_single_indicator_period())

    def test_uses_indicators(self):
        with self.settings(
                # Taken from 30-rsr.conf
                SINGLE_PERIOD_INDICATORS={
                    "root_projects": {self.project.pk: "TEST"},
                }
        ):
            self.assertEqual(self.project.uses_single_indicator_period(), "TEST")


class UsesSingleIndicatorPeriodWithParentTest(UsesSingleIndicatorPeriodTest):

    def setUp(self):
        self.program = Project.objects.create(title="Test program")
        self.project = Project.objects.create(title="Test project")
        self.project.set_parent(self.program).save()
