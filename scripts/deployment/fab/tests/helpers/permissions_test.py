#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.hosts import RemoteHost
from fab.helpers.permissions import Permissions


class PermissionsTest(mox.MoxTestBase):

    def setUp(self):
        super(PermissionsTest, self).setUp()
        self.expected_akvo_permissions_group = "some-akvo-group"
        self.mock_deployment_host = self.mox.CreateMock(RemoteHost)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.permissions = Permissions(self.expected_akvo_permissions_group, self.mock_deployment_host, self.mock_feedback)

    def test_can_ensure_user_is_member_of_specified_group(self):
        """fab.tests.helpers.permissions_test  Can ensure user is a member of the specified system group"""

        groups_for_joe = "joesoap accounts everyone editors"
        self.mock_deployment_host.run(Permissions.GROUPS_COMMAND).AndReturn(groups_for_joe)
        self.mock_feedback.comment(mox.StrContains("User [joesoap] is a member of expected group [editors]"))
        self.mox.ReplayAll()

        self.permissions.ensure_user_is_member_of_group("joesoap", "editors")

    def test_abort_if_user_is_not_a_member_of_specified_group(self):
        """fab.tests.helpers.permissions_test  Abort if the user is not a member of the specified system group"""

        groups_for_joe = "joesoap accounts everyone writers"
        self.mock_deployment_host.run(Permissions.GROUPS_COMMAND).AndReturn(groups_for_joe)
        expected_user_not_in_group_message = mox.StrContains("User [joesoap] should be a member of group [editors]")
        self.mock_feedback.abort(expected_user_not_in_group_message).AndRaise(SystemExit(expected_user_not_in_group_message))
        self.mox.ReplayAll()

        try:
            self.permissions.ensure_user_is_member_of_group("joesoap", "editors")
            self.fail("Should have raised a SystemExit exception if member is not in expected system group")
        except SystemExit:
            pass # expected

    def test_can_set_akvo_ownership_on_specified_path(self):
        """fab.tests.helpers.permissions_test  Can set Akvo permission group ownership on specified path"""

        self.mock_deployment_host.sudo("chown -R root:%s /some/path" % self.expected_akvo_permissions_group)
        self.mox.ReplayAll()

        self.permissions.set_akvo_ownership_on_path("/some/path")

    def test_can_set_akvo_group_permissions_on_specified_path(self):
        """fab.tests.helpers.permissions_test  Can set Akvo group permissions on specified path"""

        self.mock_deployment_host.sudo("chown -R root:%s /some/path" % self.expected_akvo_permissions_group)
        self.mock_deployment_host.sudo("chmod -R g+rws /some/path")
        self.mox.ReplayAll()

        self.permissions.set_akvo_group_permissions_on_path("/some/path")


def suite():
    return TestSuiteLoader().load_tests_from(PermissionsTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
