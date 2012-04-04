#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.credentials.database import DatabaseCredentials
from fab.verifiers.config import RSRCredentialsVerifier
from fab.tests.template.loader import TemplateLoader


class FakeDeploymentConfig(object):

    def __init__(self):
        self.deployed_database_credentials_file = TemplateLoader.CREDENTIALS_TEMPLATE_PATH


class DatabaseCredentialsTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseCredentialsTest, self).setUp()

        self.database_credentials = TemplateLoader.load_database_credentials()

    def test_can_load_with_given_deployment_config(self):
        """fab.tests.config.rsr.credentials.database_credentials_test  Can load with given deployment config"""

        mock_credentials_verifier = self.mox.CreateMock(RSRCredentialsVerifier)

        mock_credentials_verifier.exit_if_database_credentials_not_available()
        self.mox.ReplayAll()

        DatabaseCredentials.load_with(FakeDeploymentConfig(), mock_credentials_verifier)

    def test_has_admin_user(self):
        """fab.tests.config.rsr.credentials.database_credentials_test  Has database admin user"""

        self._verify_expected_config_value(self.database_credentials.admin_user, "admin user")

    def test_has_admin_password(self):
        """fab.tests.config.rsr.credentials.database_credentials_test  Has database admin password"""

        self._verify_expected_config_value(self.database_credentials.admin_password, "admin password")

    def test_has_rsr_user(self):
        """fab.tests.config.rsr.credentials.database_credentials_test  Has RSR database user"""

        self._verify_expected_config_value(self.database_credentials.rsr_user, "RSR user")

    def test_has_rsr_password(self):
        """fab.tests.config.rsr.credentials.database_credentials_test  Has RSR database password"""

        self._verify_expected_config_value(self.database_credentials.rsr_password, "RSR password")

    def _verify_expected_config_value(self, config_value, config_value_description):
        self.assertTrue(len(config_value) > 0, "Expected %s config value" % config_value_description)


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseCredentialsTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
