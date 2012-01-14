#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.values.shared import DataHostPaths, Hosts


class SharedConfigValuesTest(unittest2.TestCase):

    def setUp(self):
        super(SharedConfigValuesTest, self).setUp()
        
        self.hosts_config = Hosts()
        self.data_host_paths = DataHostPaths()

    def test_hosts_has_data_host_with_ssh_port(self):
        """fab.tests.config.values.shared_config_values_test  Hosts has data host with SSH port"""

        self.assertEqual('www.akvo.org:22', self.hosts_config.data_host)

    def test_hosts_has_media_host_with_ssh_port(self):
        """fab.tests.config.values.shared_config_values_test  Hosts has media host with SSH port"""

        self.assertEqual('89.233.254.43:2268', self.hosts_config.media_host)

    def test_datahostpaths_has_django_apps_home(self):
        """fab.tests.config.values.shared_config_values_test  DataHostPaths has Django apps home"""

        self.assertEqual('/var/lib/django', self.data_host_paths.django_apps_home)

    def test_datahostpaths_has_virtualenvs_home(self):
        """fab.tests.config.values.shared_config_values_test  DataHostPaths has virtualenvs home"""

        self.assertEqual('/var/virtualenvs', self.data_host_paths.virtualenvs_home)


def suite():
    return TestSuiteLoader().load_tests_from(SharedConfigValuesTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
