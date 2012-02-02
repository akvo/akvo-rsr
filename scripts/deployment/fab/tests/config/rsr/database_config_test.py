#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

import fab.tests.templates.database_credentials_template
from database_credentials import DatabaseCredentials

from fab.config.rsr.database import RSRDatabaseConfig



class RSRDatabaseConfigTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDatabaseConfigTest, self).setUp()
        self.database_credentials = DatabaseCredentials()

        self.database_config = RSRDatabaseConfig(self.database_credentials, 'some_rsrdb')

    def test_has_admin_user_name(self):
        """fab.tests.config.rsr.database_config_test  Has admin user name"""

        self.assertEqual(self.database_credentials.admin_user, self.database_config.admin_user)

    def test_has_admin_password(self):
        """fab.tests.config.rsr.database_config_test  Has admin password"""

        self.assertEqual(self.database_credentials.admin_password, self.database_config.admin_password)

    def test_has_rsr_database_name(self):
        """fab.tests.config.rsr.database_config_test  Has RSR database name"""

        self.assertEqual('some_rsrdb', self.database_config.rsr_database)

    def test_has_rsr_database_user(self):
        """fab.tests.config.rsr.database_config_test  Has RSR database user"""

        self.assertEqual(self.database_credentials.rsr_user, self.database_config.rsr_user)

    def test_has_rsr_database_password(self):
        """fab.tests.config.rsr.database_config_test  Has RSR database password"""

        self.assertEqual(self.database_credentials.rsr_password, self.database_config.rsr_password)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDatabaseConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
