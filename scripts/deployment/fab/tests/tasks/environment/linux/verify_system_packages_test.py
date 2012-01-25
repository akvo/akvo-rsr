#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.environment.linux.systempackages import SystemPackageSpecifications
from fab.config.loader import ConfigType, DeploymentConfigLoader
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.config.values.host import HostAlias
from fab.host.linux import LinuxHost
from fab.tasks.environment.linux.systempackages import VerifySystemPackages


class StubbedVerifySystemPackages(VerifySystemPackages):

    def __init__(self, deployment_user, linux_host):
        super(StubbedVerifySystemPackages, self).__init__(deployment_user)
        self.linux_host = linux_host

    def _configure_linux_host_with(self, host_config):
        self.actual_host_config_used = host_config
        return self.linux_host


class VerifySystemPackagesTest(mox.MoxTestBase):

    def setUp(self):
        super(VerifySystemPackagesTest, self).setUp()
        self.mock_linux_host = self.mox.CreateMock(LinuxHost)

        self.deployment_user = "rupaul"

        self.verify_system_packages_task = StubbedVerifySystemPackages(self.deployment_user, self.mock_linux_host)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.environment.linux.verify_system_packages_test  Has expected task name"""

        self.assertEqual("verify_system_packages", VerifySystemPackages.name)

    def test_initialiser_sets_default_config_loader(self):
        """fab.tests.tasks.environment.linux.verify_system_packages_test  Initialiser sets default config loader"""

        self.assertIsInstance(VerifySystemPackages(self.deployment_user).config_loader, DeploymentConfigLoader)

    def test_can_verify_expected_system_package_dependencies(self):
        """fab.tests.tasks.environment.linux.verify_system_packages_test  Can verify expected system package dependencies"""

        self.mock_linux_host.ensure_user_has_required_deployment_permissions(self.deployment_user)
        self.mock_linux_host.update_system_package_sources()

        for package_specifications in SystemPackageSpecifications.ALL_PACKAGES:
            self.mock_linux_host.exit_if_system_package_dependencies_not_met(package_specifications)

        self.mox.ReplayAll()

        self.verify_system_packages_task.run(ConfigType.PRECONFIGURED, HostAlias.TEST)
        self.assertEqual(CIDeploymentHostConfig.for_test(), self.verify_system_packages_task.actual_host_config_used)


def suite():
    return TestSuiteLoader().load_tests_from(VerifySystemPackagesTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
