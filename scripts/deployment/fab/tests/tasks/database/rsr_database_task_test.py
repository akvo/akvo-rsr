#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import DeploymentConfigLoader
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.config.spec import HostConfigSpecification
from fab.config.values.host import HostAlias
from fab.host.controller import HostControllerMode
from fab.host.database import DatabaseHost
from fab.tasks.database.basetask import RSRDatabaseTask
from fab.verifiers.config import ConfigFileVerifier


class StubbedRSRDatabaseTask(RSRDatabaseTask):

    def __init__(self, config_verifier, config_loader):
        super(StubbedRSRDatabaseTask, self).__init__(config_verifier)
        self.config_loader = config_loader


class RSRDatabaseTaskTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDatabaseTaskTest, self).setUp()
        self.mock_config_verifier = self.mox.CreateMock(ConfigFileVerifier)
        self.mock_config_loader = self.mox.CreateMock(DeploymentConfigLoader)
        self.mock_database_host = self.mox.CreateMock(DatabaseHost)

    def test_can_configure_database_host_for_task_execution(self):
        """fab.tests.tasks.database.rsr_database_task_test  Can configure database host for task execution"""

        self.mock_config_verifier.exit_if_database_credentials_not_found()
        self.mox.ReplayAll()

        database_task = RSRDatabaseTask(self.mock_config_verifier)

        configured_database_host = database_task._configure_database_host_with(HostControllerMode.REMOTE, CIDeploymentHostConfig.for_test())

        self.assertIsInstance(configured_database_host, DatabaseHost)

    def test_will_raise_not_implemented_error_if_no_database_actions_defined(self):
        """fab.tests.tasks.database.rsr_database_task_test  Will raise NotImplementedError if no database actions have been defined"""

        host_config_spec = HostConfigSpecification().create_preconfigured_with(HostAlias.TEST)

        self.mock_config_verifier.exit_if_database_credentials_not_found()
        self.mock_config_loader.parse(host_config_spec).AndReturn(CIDeploymentHostConfig.for_test())
        self.mox.ReplayAll()

        database_task = StubbedRSRDatabaseTask(self.mock_config_verifier, self.mock_config_loader)

        with self.assertRaises(NotImplementedError) as raised:
            database_task.run(HostControllerMode.REMOTE, host_config_spec)

        self.assertEqual('No database actions defined', raised.exception.message)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDatabaseTaskTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
