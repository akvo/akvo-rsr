#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.values.host import HostAlias
from fab.config.rsr.host import CIDeploymentHostConfig, DeploymentHostConfig, RepositoryBranch


class CIDeploymentHostConfigTest(unittest2.TestCase):

    def test_can_create_deployment_host_config_for_test_host(self):
        """fab.tests.config.rsr.ci_deployment_host_config_test  Can create CI deployment host config for test host"""

        expected_test_host_config = DeploymentHostConfig.create_with(HostAlias.TEST, RepositoryBranch.DEVELOP, 'rsrdb_develop')

        self.assertEqual(expected_test_host_config, CIDeploymentHostConfig.for_test())

    def test_can_create_deployment_host_config_for_test2_host(self):
        """fab.tests.config.rsr.ci_deployment_host_config_test  Can create CI deployment host config for test2 host"""

        expected_test2_host_config = DeploymentHostConfig.create_with(HostAlias.TEST2, RepositoryBranch.DEVELOP, 'test2_rsrdb_develop')

        self.assertEqual(expected_test2_host_config, CIDeploymentHostConfig.for_test2())


def suite():
    return TestSuiteLoader().load_tests_from(CIDeploymentHostConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
