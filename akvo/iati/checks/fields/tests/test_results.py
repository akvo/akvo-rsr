from akvo.codelists.store.codelists_v203 import RESULT_TYPE_OUTPUT
from akvo.iati.checks.fields import results
from akvo.rsr.models import Indicator, Result
from akvo.rsr.models.result.utils import QUALITATIVE
from akvo.rsr.tests.base import BaseTestCase


class TestResults(BaseTestCase):
    def assertResultsOk(self, project):
        all_checks_passed, checks = results(project)
        self.assertEqual((all_checks_passed, checks), (True, [('success', 'has valid result(s)')]))

    def test_missing_indicator_baseline(self):
        """
        Ensure a missing indicator baseline doesn't create
        Baseline is optional in v203
        https://iatistandard.org/en/iati-standard/203/activity-standard/iati-activities/iati-activity/result/indicator/baseline/
        """
        project = self.create_project("Test project")
        result = Result.objects.create(
            project=project,
            title="Test result",
            type=RESULT_TYPE_OUTPUT
        )
        indicator = Indicator.objects.create(
            result=result,
            title="Test Indicator",
            type=QUALITATIVE,
        )
        self.assertEqual(indicator.baseline_value, "")
        self.assertResultsOk(project)
