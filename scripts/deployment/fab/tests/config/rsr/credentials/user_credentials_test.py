#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.credentials.user import SSHIDPath, SudoPassword, User, UserCredentials


class UserCredentialsTest(unittest.TestCase):

    def test_has_current_user_name(self):
        """fab.tests.config.rsr.credentials.user_credentials_test  Has current user name"""

        self.assertEqual(subprocess.check_output('whoami').strip(), User.CURRENT)

    def test_has_deployment_user_name(self):
        """fab.tests.config.rsr.credentials.user_credentials_test  Has deployment user name"""

        self.assertEqual('deployer', User.DEPLOYER)

    def test_default_sudo_password_is_empty(self):
        """fab.tests.config.rsr.credentials.user_credentials_test  Default sudo password is empty"""

        self.assertEqual('', SudoPassword.NONE)

    def test_has_default_ssh_id_path(self):
        """fab.tests.config.rsr.credentials.user_credentials_test  Has default SSH ID file path"""

        self.assertEqual('~/.ssh/id_rsa', SSHIDPath.DEFAULT)

    def test_has_ssh_id_path_for_deployment(self):
        """fab.tests.config.rsr.credentials.user_credentials_test  Has SSH ID file path for deployment"""

        self.assertEqual('~/.ssh/deployer', SSHIDPath.DEPLOYER)

    def test_can_create_default_user_credentials(self):
        """fab.tests.config.rsr.credentials.user_credentials_test  Can create default user credentials"""

        self.assertEqual(UserCredentials(User.CURRENT, SudoPassword.NONE, SSHIDPath.DEFAULT),
                         UserCredentials.default())

    def test_can_create_credentials_for_specified_deployment_user_ssh_id(self):
        """fab.tests.config.rsr.credentials.user_credentials_test  Can create credentials for a given deployment user's SSH ID"""

        self.assertEqual(UserCredentials(User.DEPLOYER, SudoPassword.NONE, SSHIDPath.DEFAULT),
                         UserCredentials.for_deployer_with_ssh_id(SSHIDPath.DEFAULT))

    def test_ssh_id_path_has_expanded_user_directory_instead_of_tilde(self):
        """fab.tests.config.rsr.credentials.user_credentials_test  SSH ID path has expanded user directory instead of tilde"""

        self.assertEqual(os.path.expanduser(SSHIDPath.DEFAULT), UserCredentials.default().ssh_id_file_path)

    def test_will_exit_if_ssh_key_not_found(self):
        """fab.tests.config.rsr.credentials.user_credentials_test  Will exit if the SSH key cannot be found"""

        with self.assertRaises(SystemExit) as raised:
            UserCredentials(User.CURRENT, SudoPassword.NONE, '.non_existent/ssh_id')

        self.assertEqual('\n## SSH key not found: .non_existent/ssh_id\n', raised.exception.message)


def suite():
    return TestSuiteLoader().load_tests_from(UserCredentialsTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
