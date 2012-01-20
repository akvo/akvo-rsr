#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

import fab.tests.templates.config_loaders_template
from config_loaders import UserCredentialsLoader

from fab.config.rsr.credentials.user import UserCredentials


class UserCredentialsLoaderTest(unittest2.TestCase):

    def test_can_load_custom_user_credentials(self):
        """fab.tests.config.loaders.user_credentials_loader_test  Can load custom user credentials"""

        expected_user_credentials = UserCredentials(UserCredentials.CURRENT_USER, 'your_sudo_password', UserCredentials.DEFAULT_SSH_ID_PATH)

        self.assertEqual(expected_user_credentials, UserCredentialsLoader.load())


def suite():
    return TestSuiteLoader().load_tests_from(UserCredentialsLoaderTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
