#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.os.command.groups import GroupsCommand
from fab.host.controller import RemoteHostController


class GroupsCommandTest(mox.MoxTestBase):

    def setUp(self):
        super(GroupsCommandTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

        self.groups_command = GroupsCommand(self.mock_host_controller)

    def test_can_identify_when_user_is_a_group_member(self):
        """fab.tests.os.command.groups_test  Can identify when a user is a group member"""

        self.mock_host_controller.run("groups jane").AndReturn("jane editors writers general")
        self.mox.ReplayAll()

        self.assertTrue(self.groups_command.user("jane").is_a_member_of("editors"), "Expected user to be a group member")

    def test_can_identify_when_user_is_not_a_group_member(self):
        """fab.tests.os.command.groups_test  Can identify when a user is not a group member"""

        self.mock_host_controller.run("groups jane").AndReturn("jane editors writers general")
        self.mox.ReplayAll()

        self.assertFalse(self.groups_command.user("jane").is_a_member_of("admin"), "Expected user not to be a group member")


def suite():
    return TestSuiteLoader().load_tests_from(GroupsCommandTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
