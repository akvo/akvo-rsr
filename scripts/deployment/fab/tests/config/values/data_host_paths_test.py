#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.values.host import DataHostPaths, HostPathValues


class DataHostPathsTest(unittest.TestCase):

    def test_has_config_home(self):
        """fab.tests.config.values.data_host_paths_test  Has configuration home"""

        self.assertEqual(HostPathValues.LIVE['config_home'], DataHostPaths().config_home)

    def test_has_django_apps_home(self):
        """fab.tests.config.values.data_host_paths_test  Has Django apps home"""

        self.assertEqual(HostPathValues.LIVE['repo_checkout_home'], DataHostPaths().django_apps_home)

    def test_has_virtualenvs_home(self):
        """fab.tests.config.values.data_host_paths_test  Has virtualenvs home"""

        self.assertEqual(HostPathValues.LIVE['virtualenvs_home'], DataHostPaths().virtualenvs_home)

    def test_has_logging_home(self):
        """fab.tests.config.values.data_host_paths_test  Has logging home"""

        self.assertEqual(HostPathValues.LIVE['logging_home'], DataHostPaths().logging_home)

    def test_has_deployment_processing_home(self):
        """fab.tests.config.values.data_host_paths_test  Has deployment processing home"""

        self.assertEqual(HostPathValues.LIVE['deployment_processing_home'], DataHostPaths().deployment_processing_home)


def suite():
    return TestSuiteLoader().load_tests_from(DataHostPathsTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
