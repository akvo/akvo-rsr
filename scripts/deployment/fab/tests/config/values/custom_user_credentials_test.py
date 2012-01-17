#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

CUSTOM_CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/values/custom.py.template'))
imp.load_source('custom_config_values', CUSTOM_CONFIG_VALUES_TEMPLATE_PATH)

from custom_config_values import CustomUserCredentials

from fab.config.values.standard import UserCredentials


class CustomUserCredentialsTest(unittest2.TestCase):

    def test_can_create_custom_user_credentials(self):
        """fab.tests.config.values.custom_user_credentials_test  Can create custom user credentials"""

        self.assertEqual(UserCredentials(UserCredentials.CURRENT_USER, '~/.ssh/another_private_id_rsa'), CustomUserCredentials.create())


def suite():
    return TestSuiteLoader().load_tests_from(CustomUserCredentialsTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
