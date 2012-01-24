#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import ConfigType


class ConfigTypeTest(unittest2.TestCase):

    def test_has_expected_config_types(self):
        """fab.tests.config.loader.config_type_test  Has expected configuration types"""

        self.assertEqual('custom', ConfigType.CUSTOM)
        self.assertEqual('preconfigured', ConfigType.PRECONFIGURED)
        self.assertEqual('standard', ConfigType.STANDARD)

    def test_can_identify_custom_config_type(self):
        """fab.tests.config.loader.config_type_test  Can identify custom configuration type"""

        self.assertTrue(ConfigType(ConfigType.CUSTOM).is_custom())

    def test_can_identify_preconfigured_config_type(self):
        """fab.tests.config.loader.config_type_test  Can identify preconfigured configuration type"""

        self.assertTrue(ConfigType(ConfigType.PRECONFIGURED).is_preconfigured())

    def test_can_identify_standard_config_type(self):
        """fab.tests.config.loader.config_type_test  Can identify standard configuration type"""

        self.assertTrue(ConfigType(ConfigType.STANDARD).is_standard())


def suite():
    return TestSuiteLoader().load_tests_from(ConfigTypeTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
