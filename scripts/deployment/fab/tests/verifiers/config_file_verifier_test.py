#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.os.filesystem import LocalFileSystem
from fab.verifiers.config import ConfigFileVerifier


class ConfigFileVerifierTest(mox.MoxTestBase):

    def setUp(self):
        super(ConfigFileVerifierTest, self).setUp()
        self.mock_local_file_system = self.mox.CreateMock(LocalFileSystem)

        self.expected_deployment_scripts_home = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../..'))

        self.config_file_verifier = ConfigFileVerifier(self.mock_local_file_system)

    def test_has_path_to_deployment_scripts_home(self):
        """fab.tests.verifiers.config_file_verifier_test  Has path to deployment scripts home"""

        self.assertEqual(self.expected_deployment_scripts_home, ConfigFileVerifier.DEPLOYMENT_SCRIPTS_HOME)

    def test_can_create_instance(self):
        """fab.tests.verifiers.config_file_verifier_test  Can create ConfigFileVerifier instance"""

        config_file_verifier = ConfigFileVerifier()

        self.assertIsInstance(config_file_verifier, ConfigFileVerifier)
        self.assertIsInstance(config_file_verifier.local_file_system, LocalFileSystem)

    def test_will_exit_if_database_credentials_not_found(self):
        """fab.tests.verifiers.config_file_verifier_test  Will exit if database credentials are not found"""

        expected_database_credentials_path = os.path.join(self.expected_deployment_scripts_home, 'fab/config/rsr/credentials/database.py')
        self.mock_local_file_system.exit_if_file_does_not_exist(expected_database_credentials_path)
        self.mox.ReplayAll()

        self.config_file_verifier.exit_if_database_credentials_not_found()

    def test_will_exit_if_config_loaders_are_missing(self):
        """fab.tests.verifiers.config_file_verifier_test  Will exit if config loaders are missing"""

        expected_deployment_config_values_path = os.path.join(self.expected_deployment_scripts_home, 'fab/config/loaders.py')
        self.mock_local_file_system.exit_if_file_does_not_exist(expected_deployment_config_values_path)
        self.mox.ReplayAll()

        self.config_file_verifier.exit_if_config_loaders_not_found()


def suite():
    return TestSuiteLoader().load_tests_from(ConfigFileVerifierTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
