#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.deployer import DeployerConfig
from fab.helpers.virtualenv import VirtualEnv
from fab.tasks.virtualenv import RebuildRSRVirtualEnv


class RebuildRSRVirtualEnvTest(mox.MoxTestBase):

    def setUp(self):
        super(RebuildRSRVirtualEnvTest, self).setUp()
        self.mock_config = self.mox.CreateMock(DeployerConfig)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)

        self.rebuild_virtualenv_task = RebuildRSRVirtualEnv(self.mock_config, self.mock_virtualenv)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.rebuild_rsr_virtualenv_test.RebuildRSRVirtualEnvTest  Has expected task name"""

        self.assertEqual("rebuild_rsr_virtualenv", RebuildRSRVirtualEnv.name)

    def test_can_rebuild_rsr_virtualenv(self):
        """fab.tests.tasks.rebuild_rsr_virtualenv_test.RebuildRSRVirtualEnvTest  Can rebuild an RSR virtualenv"""

        pip_log_file = "/some/log/path/pip.log"
        pip_requirements_home = "/path/to/pip/requirements"
        rsr_requirements_path = os.path.join(pip_requirements_home, RebuildRSRVirtualEnv.RSR_REQUIREMENTS_FILE)
        self.mock_config.pip_install_log_file = pip_log_file
        self.mock_config.pip_requirements_home = pip_requirements_home

        self.mock_virtualenv.create_empty_virtualenv(pip_log_file)
        self.mock_virtualenv.install_packages(rsr_requirements_path, pip_log_file)
        self.mox.ReplayAll()

        self.rebuild_virtualenv_task.run()


def suite():
    return TestSuiteLoader().load_tests_from(RebuildRSRVirtualEnvTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
