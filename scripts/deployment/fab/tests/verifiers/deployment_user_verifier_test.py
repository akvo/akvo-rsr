#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.verifiers.user import DeploymentUserVerifier
from fab.os.permissions import AkvoPermissions


class DeploymentUserVerifierTest(mox.MoxTestBase):

    def setUp(self):
        super(DeploymentUserVerifierTest, self).setUp()
        self.mock_permissions = self.mox.CreateMock(AkvoPermissions)

        self.deployment_user_verifier = DeploymentUserVerifier(self.mock_permissions)

    def test_can_verify_expected_sudo_permission_for_sepcified_user(self):
        """fab.tests.verifiers.deployment_user_verifier_test  Can verify expected sudo permission for a specified user"""

        self.mock_permissions.exit_if_user_does_not_have_sudo_permission("jane")
        self.mox.ReplayAll()

        self.deployment_user_verifier.verify_sudo_permission_for("jane")

    def test_can_verify_expected_sudo_and_web_admin_permissions_for_sepcified_user(self):
        """fab.tests.verifiers.deployment_user_verifier_test  Can verify expected sudo and web admin permissions for a specified user"""

        self.mock_permissions.exit_if_user_does_not_have_sudo_permission("jane")
        self.mock_permissions.exit_if_user_is_not_member_of_web_group("jane")
        self.mox.ReplayAll()

        self.deployment_user_verifier.verify_sudo_and_web_admin_permissions_for("jane")


def suite():
    return TestSuiteLoader().load_tests_from(DeploymentUserVerifierTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
