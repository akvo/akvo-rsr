#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import ConfigType
from fab.config.values.host import HostAlias
from fab.tasks.parameters import TaskParameters


class TaskParametersTest(unittest.TestCase):

    CUSTOM_DEPLOYMENT_CONFIG_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../config/custom.py.template'))

    def test_has_remote_host_controller_mode_parameter(self):
        """fab.tests.tasks.task_parameters_test  Has remote host controller mode parameter"""

        self.assertEqual('host_controller_mode=remote', TaskParameters.REMOTE_HOST_CONTROLLER_MODE)

    def test_can_compose_parameter_list_from_host_config_specification(self):
        """fab.tests.tasks.task_parameters_test  Can compose parameter list from a given host configuration specification"""

        host_config_specification = 'standard:uat;some_repo_branch;some_rsrdb'
        expected_parameter_list = 'host_config_specification=%s' % host_config_specification

        self.assertEqual(expected_parameter_list, TaskParameters().compose_from(host_config_specification))

    def test_can_compose_parameter_list_from_host_config_specification_and_additional_task_parameters(self):
        """fab.tests.tasks.task_parameters_test  Can compose parameter list from a given host configuration specification and additional task parameters"""

        host_config_specification = 'standard:uat;some_repo_branch;some_rsrdb'
        expected_parameter_list = 'host_config_specification=%s,%s,other=parameter' % (host_config_specification, TaskParameters.REMOTE_HOST_CONTROLLER_MODE)

        self.assertEqual(expected_parameter_list, TaskParameters().compose_from(host_config_specification,
                                                                                [TaskParameters.REMOTE_HOST_CONTROLLER_MODE, 'other=parameter']))


def suite():
    return TestSuiteLoader().load_tests_from(TaskParametersTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
