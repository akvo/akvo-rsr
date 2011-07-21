#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.hosts import RemoteHost
from fab.helpers.path import Path
from fab.helpers.permissions import Permissions


class PathTest(mox.MoxTestBase):

    def setUp(self):
        super(PathTest, self).setUp()
        self.mock_deployment_host = self.mox.CreateMock(RemoteHost)
        self.mock_permissions = self.mox.CreateMock(Permissions)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.path = Path(self.mock_deployment_host, self.mock_permissions, self.mock_feedback)

    def test_can_exit_if_path_does_not_exist(self):
        """fab.tests.helpers.path_test  Can exit if path does not exist"""

        non_existent_path = "/some/nonexistent/path"
        self.mock_deployment_host.path_exists(non_existent_path).AndReturn(False)
        expected_missing_path_message = mox.StrContains("Expected path does not exist: /some/nonexistent/path")
        self.mock_feedback.abort(expected_missing_path_message).AndRaise(SystemExit(expected_missing_path_message))
        self.mox.ReplayAll()

        try:
            self.path.exit_if_path_does_not_exist(non_existent_path)
            self.fail("Should have raised a SystemExit exception for a nonexistent path")
        except SystemExit:
            pass # expected

    def test_does_not_exit_if_path_exists(self):
        """fab.tests.helpers.path_test  Does not exit if path exists"""

        valid_path = "/usr/bin"
        self.mock_deployment_host.path_exists(valid_path).AndReturn(True)
        self.mox.ReplayAll()

        self.path.exit_if_path_does_not_exist(valid_path)

    def test_can_ensure_path_exists(self):
        """fab.tests.helpers.path_test  Can ensure path exists"""

        existing_path = "/var"
        self.mock_deployment_host.path_exists(existing_path).AndReturn(True)
        self.mock_feedback.comment(mox.StrContains("Found expected path: /var"))
        self.mox.ReplayAll()

        self.path.ensure_path_exists(existing_path)

    def test_can_ensure_a_missing_path_is_created(self):
        """fab.tests.helpers.path_test  Can ensure a missing path is created"""

        new_path = "/var/tmp/foo"
        self.mock_deployment_host.path_exists(new_path).AndReturn(False)
        self.mock_feedback.comment(mox.StrContains("Creating path: %s" % new_path))
        self.mock_deployment_host.run("mkdir %s" % new_path)
        self.mock_deployment_host.run("chmod 755 %s" % new_path)
        self.mox.ReplayAll()

        self.path.ensure_path_exists(new_path)

    def test_can_ensure_path_exists_with_sudo(self):
        """fab.tests.helpers.path_test  Can ensure path exists with sudo"""

        existing_path = "/var"
        self.mock_deployment_host.path_exists(existing_path).AndReturn(True)
        self.mock_feedback.comment(mox.StrContains("Found expected path: /var"))
        self.mox.ReplayAll()

        self.path.ensure_path_exists_with_sudo(existing_path)

    def test_can_ensure_a_missing_path_is_created_with_sudo(self):
        """fab.tests.helpers.path_test  Can ensure a missing path is created with sudo"""

        new_path = "/var/tmp/foo"
        self.mock_deployment_host.path_exists(new_path).AndReturn(False)
        self.mock_feedback.comment(mox.StrContains("Creating path: %s" % new_path))
        self.mock_deployment_host.sudo("mkdir %s" % new_path)
        self.mock_deployment_host.sudo("chmod 755 %s" % new_path)
        self.mox.ReplayAll()

        self.path.ensure_path_exists_with_sudo(new_path)

    def test_can_ensure_path_exists_with_akvo_group_permissions(self):
        """fab.tests.helpers.path_test  Can ensure path exists with Akvo group permissions"""

        existing_path = "/var/tmp/akvo"
        self.mock_deployment_host.path_exists(existing_path).AndReturn(True)
        self.mock_feedback.comment(mox.StrContains("Found expected path: %s" % existing_path))
        self.mox.ReplayAll()

        self.path.ensure_path_exists_with_akvo_group_permissions(existing_path)

    def test_can_ensure_a_missing_path_is_created_with_akvo_group_permissions(self):
        """fab.tests.helpers.path_test  Can ensure a missing path is created with Akvo group permissions"""

        new_path = "/var/tmp/foo"
        self.mock_deployment_host.path_exists(new_path).MultipleTimes().AndReturn(False)
        self.mock_feedback.comment(mox.StrContains("Creating path: %s" % new_path))
        self.mock_deployment_host.sudo("mkdir %s" % new_path)
        self.mock_deployment_host.sudo("chmod 755 %s" % new_path)
        self.mock_permissions.set_akvo_group_permissions_on_path(new_path)
        self.mox.ReplayAll()

        self.path.ensure_path_exists_with_akvo_group_permissions(new_path)


def suite():
    return TestSuiteLoader().load_tests_from(PathTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
