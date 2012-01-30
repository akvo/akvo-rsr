#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.values.host import DataHostPaths, HostAlias
from fab.config.rsr.host import DataHostConfig, SSHConnection


class DataHostConfigTest(unittest2.TestCase):

    def test_can_create_deployment_host_config_for_test_host(self):
        """fab.tests.config.rsr.data_host_config_test  Can create data host config"""

        data_host_config = DataHostConfig()

        self.assertEqual(DataHostPaths(), data_host_config.host_paths)
        self.assertEqual(SSHConnection.for_host(HostAlias.DATA), data_host_config.ssh_connection)


def suite():
    return TestSuiteLoader().load_tests_from(DataHostConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
