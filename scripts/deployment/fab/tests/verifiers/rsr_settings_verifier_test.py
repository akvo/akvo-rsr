#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.app.settings import DjangoSettingsReader
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.os.filesystem import FileSystem
from fab.verifiers.config import RSRSettingsVerifier


class RSRSettingsVerifierTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRSettingsVerifierTest, self).setUp()
        self.deployment_host_config = CIDeploymentHostConfig.for_test()
        self.deployment_config = RSRDeploymentConfig.create_with(self.deployment_host_config)
        self.mock_settings_reader = self.mox.CreateMock(DjangoSettingsReader)
        self.mock_host_file_system = self.mox.CreateMock(FileSystem)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.settings_verifier = RSRSettingsVerifier(self.deployment_host_config, self.deployment_config, self.mock_settings_reader,
                                                     self.mock_host_file_system, self.mock_feedback)

    def test_can_create_instance_for_local_deployment_host(self):
        """fab.tests.verifiers.rsr_settings_verifier_test  Can create an RSRSettingsVerifier instance for a local deployment host"""

        self._verify_instance_creation_for(LocalHostController)

    def test_can_create_instance_for_remote_deployment_host(self):
        """fab.tests.verifiers.rsr_settings_verifier_test  Can create an RSRSettingsVerifier instance for a remote deployment host"""

        self._verify_instance_creation_for(RemoteHostController)

    def _verify_instance_creation_for(self, host_controller_class):
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mock_feedback
        self.mox.ReplayAll()

        self.assertIsInstance(RSRSettingsVerifier.create_with(self.deployment_host_config, mock_host_controller), RSRSettingsVerifier)

    def test_will_exit_if_local_rsr_settings_not_deployed(self):
        """fab.tests.verifiers.rsr_settings_verifier_test  Will exit if local RSR settings have not been deployed"""

        self.mock_host_file_system.exit_if_directory_does_not_exist(self.deployment_config.host_config_home)
        self.mock_host_file_system.exit_if_file_does_not_exist(self.deployment_config.deployed_rsr_settings_file)
        self.mox.ReplayAll()

        self.settings_verifier.exit_if_local_rsr_settings_not_deployed()

    def test_will_exit_if_settings_do_not_match_expected_database_name(self):
        """fab.tests.verifiers.rsr_settings_verifier_test  Will exit if deployed settings do not match expected database name"""

        mismatched_database_settings_message = 'Cannot deploy to database [%s] when deployed RSR settings use [deployed_database_name]' % \
                                                self.deployment_host_config.rsr_database_name

        self.mock_settings_reader.rsr_database_name().AndReturn('deployed_database_name')
        self.mock_feedback.abort(mismatched_database_settings_message).AndRaise(SystemExit(mismatched_database_settings_message))
        self.mox.ReplayAll()

        with self.assertRaises(SystemExit) as raised:
            self.settings_verifier.exit_if_settings_have_mismatched_database_name()

        self.assertEqual(mismatched_database_settings_message, raised.exception.message)

    def test_will_confirm_if_deployment_database_name_matches_expected_database_name_from_settings(self):
        """fab.tests.verifiers.rsr_settings_verifier_test  Will confirm if deployment database name matches expected database name from settings"""

        self.mock_settings_reader.rsr_database_name().AndReturn(self.deployment_host_config.rsr_database_name)
        self.mock_feedback.comment('Deployment database name matches expected RSR database name in settings: %s' % \
                                    self.deployment_host_config.rsr_database_name)
        self.mox.ReplayAll()

        self.settings_verifier.exit_if_settings_have_mismatched_database_name()


def suite():
    return TestSuiteLoader().load_tests_from(RSRSettingsVerifierTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
