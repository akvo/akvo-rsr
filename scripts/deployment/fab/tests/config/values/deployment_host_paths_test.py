#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.values.host import DeploymentHostPaths, HostAlias, HostPathValues


class DeploymentHostPathsTest(unittest.TestCase):

    def test_can_use_default_host_paths(self):
        """fab.tests.config.values.deployment_host_paths_test  Can use default host paths"""

        self.assertEqual(DeploymentHostPaths(HostPathValues.DEFAULT), DeploymentHostPaths.default())

    def test_has_host_paths_for_live_server(self):
        """fab.tests.config.values.deployment_host_paths_test  Has host paths for live server"""

        self.assertEqual(DeploymentHostPaths(HostPathValues.LIVE), DeploymentHostPaths.for_host(HostAlias.LIVE))

    def test_has_host_paths_for_test_server(self):
        """fab.tests.config.values.deployment_host_paths_test  Has host paths for test server"""

        self.assertEqual(DeploymentHostPaths(HostPathValues.DEFAULT), DeploymentHostPaths.for_host(HostAlias.TEST))

    def test_has_host_paths_for_test2_server(self):
        """fab.tests.config.values.deployment_host_paths_test  Has host paths for test2 server"""

        self.assertEqual(DeploymentHostPaths(HostPathValues.TEST2), DeploymentHostPaths.for_host(HostAlias.TEST2))

    def test_has_host_paths_for_uat_server(self):
        """fab.tests.config.values.deployment_host_paths_test  Has host paths for uat server"""

        self.assertEqual(DeploymentHostPaths(HostPathValues.DEFAULT), DeploymentHostPaths.for_host(HostAlias.UAT))

    def test_has_host_paths_for_ci_server(self):
        """fab.tests.config.values.deployment_host_paths_test  Has host paths for ci server"""

        self.assertEqual(DeploymentHostPaths(HostPathValues.DEFAULT), DeploymentHostPaths.for_host(HostAlias.CI))

    def test_raises_lookup_error_for_unrecognised_host_alias(self):
        """fab.tests.config.values.deployment_host_paths_test  Raises LookupError for unrecognised host alias"""

        with self.assertRaises(LookupError) as raised:
            DeploymentHostPaths.for_host('nonexistent_host')

        self.assertEqual('No host path configuration for: nonexistent_host', raised.exception.message)


def suite():
    return TestSuiteLoader().load_tests_from(DeploymentHostPathsTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
