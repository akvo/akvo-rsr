#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

CUSTOM_USER_CREDENTIALS_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../../config/rsr/credentials/custom.py.template'))
imp.load_source('user_credentials', CUSTOM_USER_CREDENTIALS_TEMPLATE_PATH)

from user_credentials import CustomUserCredentials

from fab.config.rsr.credentials.user import SSHIDPath, User, UserCredentials


class CustomUserCredentialsTest(unittest2.TestCase):

    def test_can_create_custom_user_credentials(self):
        """fab.tests.config.rsr.credentials.custom_user_credentials_test  Can create custom user credentials"""

        expected_user_credentials = UserCredentials(User.CURRENT, 'your_sudo_password', SSHIDPath.DEFAULT)

        self.assertEqual(expected_user_credentials, CustomUserCredentials.create())


def suite():
    return TestSuiteLoader().load_tests_from(CustomUserCredentialsTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
