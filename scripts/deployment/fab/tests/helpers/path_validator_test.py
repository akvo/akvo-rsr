#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.hosts import DeploymentHost
from fab.helpers.path import PathValidator


class PathValidatorTest(mox.MoxTestBase):

    def setUp(self):
        super(PathValidatorTest, self).setUp()
        self.mock_deployment_host = self.mox.CreateMock(DeploymentHost)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.path_validator = PathValidator(self.mock_deployment_host, self.mock_feedback)

    def test_will_exit_if_file_does_not_exist(self):
        """fab.tests.helpers.path_validator_test  Will exit if file does not exist"""

        non_existent_file = "/some/path/nonexistent_file.txt"
        self.mock_deployment_host.path_exists(non_existent_file).AndReturn(False)
        expected_missing_file_message = mox.StrContains("Expected file does not exist: %s" % non_existent_file)
        self.mock_feedback.abort(expected_missing_file_message).AndRaise(SystemExit(expected_missing_file_message))
        self.mox.ReplayAll()

        try:
            self.path_validator.exit_if_file_does_not_exist(non_existent_file)
            self.fail("Should have raised a SystemExit exception for a nonexistent file")
        except SystemExit:
            pass # expected

    def test_will_confirm_existing_path_and_does_not_exit_if_file_exists(self):
        """fab.tests.helpers.path_validator_test  Will confirm existing file and does not exit if file exists"""

        valid_file_path = "/usr/bin/man"
        self.mock_deployment_host.path_exists(valid_file_path).AndReturn(True)
        self.mock_feedback.comment("Found expected file: %s" % valid_file_path)
        self.mox.ReplayAll()

        self.path_validator.exit_if_file_does_not_exist(valid_file_path)

    def test_will_exit_if_path_does_not_exist(self):
        """fab.tests.helpers.path_validator_test  Will exit if path does not exist"""

        non_existent_path = "/some/nonexistent/path"
        self.mock_deployment_host.path_exists(non_existent_path).AndReturn(False)
        expected_missing_path_message = mox.StrContains("Expected path does not exist: %s" % non_existent_path)
        self.mock_feedback.abort(expected_missing_path_message).AndRaise(SystemExit(expected_missing_path_message))
        self.mox.ReplayAll()

        try:
            self.path_validator.exit_if_path_does_not_exist(non_existent_path)
            self.fail("Should have raised a SystemExit exception for a nonexistent path")
        except SystemExit:
            pass # expected

    def test_will_confirm_existing_path_and_does_not_exit_if_path_exists(self):
        """fab.tests.helpers.path_validator_test  Will confirm existing path and does not exit if path exists"""

        valid_path = "/usr/bin"
        self.mock_deployment_host.path_exists(valid_path).AndReturn(True)
        self.mock_feedback.comment("Found expected path: %s" % valid_path)
        self.mox.ReplayAll()

        self.path_validator.exit_if_path_does_not_exist(valid_path)

    def test_can_ensure_path_exists(self):
        """fab.tests.helpers.path_validator_test  Can ensure path exists"""

        existing_path = "/var"
        self.mock_deployment_host.path_exists(existing_path).AndReturn(True)
        self.mock_feedback.comment(mox.StrContains("Found expected path: /var"))
        self.mox.ReplayAll()

        self.path_validator.ensure_path_exists(existing_path)

    def test_can_ensure_a_missing_path_is_created(self):
        """fab.tests.helpers.path_validator_test  Can ensure a missing path is created"""

        new_path = "/var/tmp/foo"
        self.mock_deployment_host.path_exists(new_path).AndReturn(False)
        self.mock_feedback.comment(mox.StrContains("Creating path: %s" % new_path))
        self.mock_deployment_host.run("mkdir %s" % new_path)
        self.mock_deployment_host.run("chmod 755 %s" % new_path)
        self.mox.ReplayAll()

        self.path_validator.ensure_path_exists(new_path)

    def test_can_ensure_path_exists_with_sudo(self):
        """fab.tests.helpers.path_validator_test  Can ensure path exists with sudo"""

        existing_path = "/var"
        self.mock_deployment_host.path_exists(existing_path).AndReturn(True)
        self.mock_feedback.comment(mox.StrContains("Found expected path: /var"))
        self.mox.ReplayAll()

        self.path_validator.ensure_path_exists_with_sudo(existing_path)

    def test_can_ensure_a_missing_path_is_created_with_sudo(self):
        """fab.tests.helpers.path_validator_test  Can ensure a missing path is created with sudo"""

        new_path = "/var/tmp/foo"
        self.mock_deployment_host.path_exists(new_path).AndReturn(False)
        self.mock_feedback.comment(mox.StrContains("Creating path: %s" % new_path))
        self.mock_deployment_host.sudo("mkdir %s" % new_path)
        self.mock_deployment_host.sudo("chmod 755 %s" % new_path)
        self.mox.ReplayAll()

        self.path_validator.ensure_path_exists_with_sudo(new_path)

    def test_can_ensure_path_exists_with_web_group_permissions(self):
        """fab.tests.helpers.path_validator_test  Can ensure path exists with web group permissions"""

        existing_path = "/var/tmp/akvo"
        self.mock_deployment_host.path_exists(existing_path).AndReturn(True)
        self.mock_feedback.comment(mox.StrContains("Found expected path: %s" % existing_path))
        self.mox.ReplayAll()

        self.path_validator.ensure_path_exists_with_web_group_permissions(existing_path)

    def test_can_ensure_a_missing_path_is_created_with_web_group_permissions(self):
        """fab.tests.helpers.path_validator_test  Can ensure a missing path is created with web group permissions"""

        new_path = "/var/tmp/foo"
        self.mock_deployment_host.path_exists(new_path).MultipleTimes().AndReturn(False)
        self.mock_feedback.comment(mox.StrContains("Creating path: %s" % new_path))
        self.mock_deployment_host.sudo("mkdir %s" % new_path)
        self.mock_deployment_host.sudo("chmod 755 %s" % new_path)
        self.mock_deployment_host.set_web_group_permissions_on_path(new_path)
        self.mox.ReplayAll()

        self.path_validator.ensure_path_exists_with_web_group_permissions(new_path)


def suite():
    return TestSuiteLoader().load_tests_from(PathValidatorTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
