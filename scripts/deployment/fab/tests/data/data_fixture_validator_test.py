#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.data.validator import DataFixtureValidator
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class DataFixtureValidatorTest(mox.MoxTestBase):

    def setUp(self):
        super(DataFixtureValidatorTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_host_controller.feedback = self.mock_feedback
        self.data_fixture_validator = DataFixtureValidator(self.mock_host_controller)

    def test_can_validate_given_xml_data_fixture(self):
        """fab.tests.data.data_fixture_validator_test  Can validate a given XML data fixture"""

        self.mock_feedback.comment('Validating data fixture: /path/to/data/fixture.xml')
        self.mock_host_controller.run('xmllint --noout --memory /path/to/data/fixture.xml')
        self.mox.ReplayAll()

        self.data_fixture_validator.validate('/path/to/data/fixture.xml')


def suite():
    return TestSuiteLoader().load_tests_from(DataFixtureValidatorTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
