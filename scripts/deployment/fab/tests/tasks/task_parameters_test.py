#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import ConfigType
from fab.config.values.host import HostAlias
from fab.tasks.parameters import TaskParameters


class TaskParametersTest(unittest2.TestCase):

    CUSTOM_DEPLOYMENT_CONFIG_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../config/custom.py.template'))

    def test_has_expected_task_parameter_options(self):
        """fab.tests.tasks.task_parameters_test  Has expected task parameter options"""

        self.assertEqual('', TaskParameters.NONE)
        self.assertEqual('host_controller_mode=remote', TaskParameters.REMOTE_HOST_CONTROLLER_MODE)

    def test_can_compose_parameter_list_for_standard_host_configuration(self):
        """fab.tests.tasks.task_parameters_test  Can compose parameter list for a standard host configuration"""

        expected_parameter_list = 'host_alias=uat,repository_branch=some_repo_branch,database_name=some_rsrdb'

        self.assertEqual(expected_parameter_list, self._compose_parameters(ConfigType.STANDARD, TaskParameters.NONE, HostAlias.UAT,
                                                                           'some_repo_branch', 'some_rsrdb'))

    def test_can_compose_parameter_list_for_standard_host_configuration_with_additional_task_parameters(self):
        """fab.tests.tasks.task_parameters_test  Can compose parameter list for a standard host configuration with additional task parameters"""

        expected_parameter_list = '%s,host_alias=uat,repository_branch=some_repo_branch,database_name=some_rsrdb' % TaskParameters.REMOTE_HOST_CONTROLLER_MODE

        self.assertEqual(expected_parameter_list, self._compose_parameters(ConfigType.STANDARD, TaskParameters.REMOTE_HOST_CONTROLLER_MODE,
                                                                           HostAlias.UAT, 'some_repo_branch', 'some_rsrdb'))

    def test_can_compose_parameter_list_for_preconfigured_host_configuration(self):
        """fab.tests.tasks.task_parameters_test  Can compose parameter list for a preconfigured host configuration"""

        expected_parameter_list = 'host_alias=test2'

        self.assertEqual(expected_parameter_list, self._compose_parameters(ConfigType.PRECONFIGURED, TaskParameters.NONE, HostAlias.TEST2))

    def test_can_compose_parameter_list_for_preconfigured_host_configuration_with_additional_task_parameters(self):
        """fab.tests.tasks.task_parameters_test  Can compose parameter list for a preconfigured host configuration with additional task parameters"""

        expected_parameter_list = '%s,host_alias=test2' % TaskParameters.REMOTE_HOST_CONTROLLER_MODE

        self.assertEqual(expected_parameter_list, self._compose_parameters(ConfigType.PRECONFIGURED, TaskParameters.REMOTE_HOST_CONTROLLER_MODE, HostAlias.TEST2))

    def test_can_compose_parameter_list_for_custom_host_configuration(self):
        """fab.tests.tasks.task_parameters_test  Can compose parameter list for a custom host configuration"""

        expected_parameter_list = 'custom_config_module_path=%s' % self.CUSTOM_DEPLOYMENT_CONFIG_TEMPLATE_PATH

        self.assertEqual(expected_parameter_list, self._compose_parameters(ConfigType.CUSTOM, TaskParameters.NONE,
                                                                           custom_config_module_path=self.CUSTOM_DEPLOYMENT_CONFIG_TEMPLATE_PATH))

    def test_can_compose_parameter_list_for_custom_host_configuration_with_additional_task_parameters(self):
        """fab.tests.tasks.task_parameters_test  Can compose parameter list for a custom host configuration with additional task parameters"""

        expected_parameter_list = '%s,custom_config_module_path=%s' % (TaskParameters.REMOTE_HOST_CONTROLLER_MODE, self.CUSTOM_DEPLOYMENT_CONFIG_TEMPLATE_PATH)

        self.assertEqual(expected_parameter_list, self._compose_parameters(ConfigType.CUSTOM, TaskParameters.REMOTE_HOST_CONTROLLER_MODE,
                                                                           custom_config_module_path=self.CUSTOM_DEPLOYMENT_CONFIG_TEMPLATE_PATH))

    def _compose_parameters(self, config_type,
                                  additional_task_parameters,
                                  host_alias=None,
                                  repository_branch=None,
                                  database_name=None,
                                  custom_config_module_path=None):
        return TaskParameters(config_type).compose_parameter_list(additional_task_parameters,
                                                                  host_alias,
                                                                  repository_branch,
                                                                  database_name,
                                                                  custom_config_module_path)


def suite():
    return TestSuiteLoader().load_tests_from(TaskParametersTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
