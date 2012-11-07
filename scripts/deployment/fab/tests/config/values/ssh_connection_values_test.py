#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.values.host import HostAlias, SSHConnection


class SSHConnectionValuesTest(unittest.TestCase):

    def test_has_connection_string_for_live_host(self):
        """fab.tests.config.values.ssh_connection_values_test  Has SSH connection string for live host"""

        self.assertEqual('www.akvo.org:22', SSHConnection.for_host(HostAlias.LIVE))

    def test_has_connection_string_for_data_host(self):
        """fab.tests.config.values.ssh_connection_values_test  Has SSH connection string for data host"""

        self.assertEqual('www.akvo.org:22', SSHConnection.for_host(HostAlias.DATA))

    def test_has_connection_string_for_media_host(self):
        """fab.tests.config.values.ssh_connection_values_test  Has SSH connection string for media host"""

        self.assertEqual('89.233.254.43:2268', SSHConnection.for_host(HostAlias.MEDIA))

    def test_has_connection_string_for_test_host(self):
        """fab.tests.config.values.ssh_connection_values_test  Has SSH connection string for test host"""

        self.assertEqual('test.akvo.org:2270', SSHConnection.for_host(HostAlias.TEST))

    def test_has_connection_string_for_test2_host(self):
        """fab.tests.config.values.ssh_connection_values_test  Has SSH connection string for test2 host"""

        self.assertEqual('test2.akvo.org:2273', SSHConnection.for_host(HostAlias.TEST2))

    def test_has_connection_string_for_uat_host(self):
        """fab.tests.config.values.ssh_connection_values_test  Has SSH connection string for uat host"""

        self.assertEqual('uat.akvo.org:2279', SSHConnection.for_host(HostAlias.UAT))

    def test_has_connection_string_for_ci_host(self):
        """fab.tests.config.values.ssh_connection_values_test  Has SSH connection string for ci host"""

        self.assertEqual('ci.akvo.org:2275', SSHConnection.for_host(HostAlias.CI))

    def test_raises_lookup_error_for_unrecognised_host_alias(self):
        """fab.tests.config.values.ssh_connection_values_test  Raises LookupError for unrecognised host alias"""

        with self.assertRaises(LookupError) as raised:
            SSHConnection.for_host('nonexistent_host')

        self.assertEqual('No SSH connection details for: nonexistent_host', raised.exception.message)


def suite():
    return TestSuiteLoader().load_tests_from(SSHConnectionValuesTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
