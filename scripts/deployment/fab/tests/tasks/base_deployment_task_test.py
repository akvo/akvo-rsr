#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import DeploymentConfigLoader
from fab.config.rsr.credentials.user import UserCredentials
from fab.tasks.base import BaseDeploymentTask


class BaseDeploymentTaskTest(unittest2.TestCase):

    def test_initialiser_sets_deployment_user(self):
        """fab.tests.tasks.base_deployment_task_test  Initialiser sets deployment user"""

        self.assertEquals(UserCredentials.CURRENT_USER, BaseDeploymentTask().deployment_user)

    def test_initialiser_sets_deployment_config_loader(self):
        """fab.tests.tasks.base_deployment_task_test  Initialiser sets config loader"""

        self.assertIsInstance(BaseDeploymentTask().config_loader, DeploymentConfigLoader)


def suite():
    return TestSuiteLoader().load_tests_from(BaseDeploymentTaskTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
