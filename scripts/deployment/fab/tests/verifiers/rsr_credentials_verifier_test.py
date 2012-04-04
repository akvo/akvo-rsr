#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.os.filesystem import LocalFileSystem
from fab.verifiers.config import RSRCredentialsVerifier


class RSRCredentialsVerifierTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRCredentialsVerifierTest, self).setUp()

        self.deployment_host_config = CIDeploymentHostConfig.for_test()
        self.deployment_config = RSRDeploymentConfig.create_with(self.deployment_host_config)
        self.mock_file_system = self.mox.CreateMock(LocalFileSystem)

        self.credentials_verifier = RSRCredentialsVerifier(self.deployment_config, self.mock_file_system)

    def test_can_create_instance_for_local_deployment_host(self):
        """fab.tests.verifiers.rsr_credentials_verifier_test  Can create an RSRCredentialsVerifier instance for a local deployment host"""

        self._verify_instance_creation_for(LocalHostController)

    def test_can_create_instance_for_remote_deployment_host(self):
        """fab.tests.verifiers.rsr_credentials_verifier_test  Can create an RSRCredentialsVerifier instance for a remote deployment host"""

        self._verify_instance_creation_for(RemoteHostController)

    def _verify_instance_creation_for(self, host_controller_class):
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mox.ReplayAll()

        self.assertIsInstance(RSRCredentialsVerifier.create_with(self.deployment_host_config, mock_host_controller), RSRCredentialsVerifier)

    def test_will_exit_if_database_credentials_not_available(self):
        """fab.tests.verifiers.rsr_credentials_verifier_test  Will exit if database credentials are not available"""

        self.mock_file_system.exit_if_file_does_not_exist(self.deployment_config.deployed_database_credentials_file)
        self.mox.ReplayAll()

        self.credentials_verifier.exit_if_database_credentials_not_available()


def suite():
    return TestSuiteLoader().load_tests_from(RSRCredentialsVerifierTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
