#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os
import simplejson as json

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.credentials.reader import CredentialsFileReader, RemoteCredentialsFileReader
from fab.config.values.host import DataHostPaths, DeploymentHostPaths
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.os.filesystem import FileSystem, LocalFileSystem
from fab.tests.template.loader import TemplateLoader


class CredentialsFileReaderTest(mox.MoxTestBase):

    def setUp(self):
        super(CredentialsFileReaderTest, self).setUp()
        self.host_paths = DeploymentHostPaths.default()
        self.mock_host_file_system = self.mox.CreateMock(FileSystem)
        self.mock_local_file_system = self.mox.CreateMock(LocalFileSystem)

        self.credentials_file_reader = CredentialsFileReader(DeploymentHostPaths.default(),
                                                             self.mock_host_file_system,
                                                             self.mock_local_file_system)

    def test_can_create_instance_for_local_deployment_host(self):
        """fab.tests.config.rsr.credentials.credentials_file_reader_test  Can create CredentialsFileReader instance for a local deployment host"""

        self._verify_instance_creation_for(DeploymentHostPaths.default(), LocalHostController)

    def test_can_create_instance_for_remote_deployment_host(self):
        """fab.tests.config.rsr.credentials.credentials_file_reader_test  Can create CredentialsFileReader instance for a remote deployment host"""

        self._verify_instance_creation_for(DeploymentHostPaths.default(), RemoteHostController)

    def test_can_create_instance_for_local_data_host(self):
        """fab.tests.config.rsr.credentials.credentials_file_reader_test  Can create CredentialsFileReader instance for a local data host"""

        self._verify_instance_creation_for(DataHostPaths(), LocalHostController)

    def test_can_create_instance_for_remote_data_host(self):
        """fab.tests.config.rsr.credentials.credentials_file_reader_test  Can create CredentialsFileReader instance for a remote data host"""

        self._verify_instance_creation_for(DataHostPaths(), RemoteHostController)

    def _verify_instance_creation_for(self, host_paths, host_controller_class):
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mox.ReplayAll()

        CredentialsFileReader.create_with(host_paths, mock_host_controller)

    def test_can_create_remote_credentials_file_reader_instance_for_data_host(self):
        """fab.tests.config.rsr.credentials.credentials_file_reader_test  Can create a RemoteCredentialsFileReader instance for a data host"""

        RemoteCredentialsFileReader.create_with(DataHostPaths())

    def test_can_read_deployed_credentials_file(self):
        """fab.tests.config.rsr.credentials.credentials_file_reader_test  Can read a deployed credentials file"""

        deployed_credentials_file = os.path.join(self.host_paths.config_home, 'credentials/some_credentials_file.json')
        local_credentials_home = os.path.join(self.host_paths.deployment_processing_home, 'credentials')
        local_credentials_file = os.path.join(local_credentials_home, 'some_credentials_file.json')

        self.mock_host_file_system.exit_if_file_does_not_exist(deployed_credentials_file)
        self.mock_host_file_system.download_file(deployed_credentials_file, local_credentials_home)
        self.mock_local_file_system.open_file(local_credentials_file).AndReturn(self._open_credentials_data_file())
        self.mock_local_file_system.delete_file(local_credentials_file)
        self.mox.ReplayAll()

        self.assertEqual(json.load(self._open_credentials_data_file()),
                         self.credentials_file_reader.read_deployed_credentials('some_credentials_file.json'))

    def _open_credentials_data_file(self):
        return open(TemplateLoader.CREDENTIALS_TEMPLATE_PATH, 'r')

    def test_will_exit_if_deployed_credentials_file_is_unavailable(self):
        """fab.tests.config.rsr.credentials.credentials_file_reader_test  Will exit if deployed credentials file is unavailable"""

        deployed_credentials_file = os.path.join(self.host_paths.config_home, 'credentials/non_existent_credentials_file.json')
        file_not_found_message = 'Some file not found message'

        self.mock_host_file_system.exit_if_file_does_not_exist(deployed_credentials_file).AndRaise(SystemExit(file_not_found_message))
        self.mox.ReplayAll()

        with self.assertRaises(SystemExit) as raised:
            self.credentials_file_reader.read_deployed_credentials('non_existent_credentials_file.json')

        self.assertEqual(file_not_found_message, raised.exception.message)


def suite():
    return TestSuiteLoader().load_tests_from(CredentialsFileReaderTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
