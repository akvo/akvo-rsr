#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.environment.linux.systempackages import SystemPackageSpecifications
from fab.config.rsr.credentials.user import UserCredentials
from fab.config.spec import HostConfigSpecification
from fab.config.values.host import HostAlias
from fab.host.linux import LinuxHost
from fab.tasks.environment.linux.systempackages import VerifySystemPackages


class StubbedVerifySystemPackages(VerifySystemPackages):

    def __init__(self, linux_host):
        super(StubbedVerifySystemPackages, self).__init__()
        self.linux_host = linux_host

    def _configure_linux_host_with(self, host_config_specification):
        return self.linux_host


class VerifySystemPackagesTest(mox.MoxTestBase):

    def setUp(self):
        super(VerifySystemPackagesTest, self).setUp()
        self.mock_linux_host = self.mox.CreateMock(LinuxHost)

        self.verify_system_packages_task = StubbedVerifySystemPackages(self.mock_linux_host)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.environment.linux.verify_system_packages_test  Has expected task name"""

        self.assertEqual('verify_system_packages', VerifySystemPackages.name)

    def test_can_verify_expected_system_package_dependencies(self):
        """fab.tests.tasks.environment.linux.verify_system_packages_test  Can verify expected system package dependencies"""

        self.mock_linux_host.ensure_user_has_required_deployment_permissions(UserCredentials.CURRENT_USER)
        self.mock_linux_host.update_system_package_sources()

        for package_specifications in SystemPackageSpecifications.ALL_PACKAGES:
            self.mock_linux_host.exit_if_system_package_dependencies_not_met(package_specifications)

        self.mox.ReplayAll()

        self.verify_system_packages_task.run(HostConfigSpecification().create_preconfigured_with(HostAlias.TEST))


def suite():
    return TestSuiteLoader().load_tests_from(VerifySystemPackagesTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
