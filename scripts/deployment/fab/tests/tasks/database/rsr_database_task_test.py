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
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import HostControllerMode, RemoteHostController
from fab.host.database import DatabaseHost
from fab.tasks.database.basetask import RSRDatabaseTask


class StubbedRSRDatabaseTask(RSRDatabaseTask):

    def __init__(self, config_loader, database_host):
        super(StubbedRSRDatabaseTask, self).__init__(config_loader)
        self.configured_database_host = database_host

    def _configure_database_host_with(self, host_controller, host_config):
        return self.configured_database_host


class RSRDatabaseTaskTest(mox.MoxTestBase):

    def test_will_raise_not_implemented_error_if_no_database_actions_defined(self):
        """fab.tests.tasks.database.rsr_database_task_test  Will raise NotImplementedError if no database actions have been defined"""

        mock_config_loader = self.mox.CreateMock(DeploymentConfigLoader)
        mock_database_host = self.mox.CreateMock(DatabaseHost)
        host_config_spec = HostConfigSpecification().create_preconfigured_with(HostAlias.TEST)

        mock_config_loader.parse(host_config_spec).AndReturn(CIDeploymentHostConfig.for_test())
        self.mox.ReplayAll()

        database_task = StubbedRSRDatabaseTask(mock_config_loader, mock_database_host)

        with self.assertRaises(NotImplementedError) as raised:
            database_task.run(HostControllerMode.REMOTE, host_config_spec)

        self.assertEqual('No database actions defined', raised.exception.message)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDatabaseTaskTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
