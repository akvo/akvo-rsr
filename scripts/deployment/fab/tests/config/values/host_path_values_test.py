#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.values.host import HostPathValues


class HostPathValuesTest(unittest2.TestCase):

    def test_has_default_host_paths(self):
        """fab.tests.config.values.host_path_values_test  Has default host paths"""

        expected_path_values    = { 'config_home':                  '/usr/local/etc/akvo',
                                    'repo_checkout_home':           '/var/git',
                                    'virtualenvs_home':             '/var/virtualenvs',
                                    'static_media_home':            '/var/www',
                                    'logging_home':                 '/var/log/akvo',
                                    'deployment_processing_home':   '/var/tmp/rsr'}

        self.assertEqual(expected_path_values, HostPathValues.DEFAULT)

    def test_has_live_host_paths(self):
        """fab.tests.config.values.host_path_values_test  Has live host paths"""

        expected_path_values    = { 'config_home':                  HostPathValues.DEFAULT['config_home'],
                                    'repo_checkout_home':           '/var/lib/django',
                                    'virtualenvs_home':             HostPathValues.DEFAULT['virtualenvs_home'],
                                    'static_media_home':            HostPathValues.DEFAULT['static_media_home'],
                                    'logging_home':                 HostPathValues.DEFAULT['logging_home'],
                                    'deployment_processing_home':   HostPathValues.DEFAULT['deployment_processing_home']}

        self.assertEqual(expected_path_values, HostPathValues.LIVE)

    def test_has_test2_host_paths(self):
        """fab.tests.config.values.host_path_values_test  Has test2 host paths"""

        expected_path_values    = { 'config_home':                  '/usr/local/etc/akvo/test2',
                                    'repo_checkout_home':           '/var/dev/test2',
                                    'virtualenvs_home':             '/var/dev/virtualenvs/test2',
                                    'static_media_home':            '/var/www/test2',
                                    'logging_home':                 '/var/log/akvo',
                                    'deployment_processing_home':   '/var/tmp/rsr/test2'}

        self.assertEqual(expected_path_values, HostPathValues.TEST2)


def suite():
    return TestSuiteLoader().load_tests_from(HostPathValuesTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
