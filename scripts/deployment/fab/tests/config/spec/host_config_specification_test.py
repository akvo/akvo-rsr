#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import ConfigType
from fab.config.rsr.host import RepositoryBranch
from fab.config.spec import HostConfigSpecification
from fab.config.values.host import HostAlias


class HostConfigSpecificationTest(unittest2.TestCase):

    def test_can_create_preconfigured_host_config_specification(self):
        """fab.tests.config.spec.host_config_specification_test  Can create a preconfigured host configuration specification"""

        self.assertEqual(self._expected_spec(ConfigType.PRECONFIGURED, [HostAlias.TEST]),
                         HostConfigSpecification().create_preconfigured_with(HostAlias.TEST))

    def test_can_create_standard_host_config_specification(self):
        """fab.tests.config.spec.host_config_specification_test  Can create a standard host configuration specification"""

        self.assertEqual(self._expected_spec(ConfigType.STANDARD, [HostAlias.UAT, RepositoryBranch.DEVELOP, 'some_rsr_db']),
                         HostConfigSpecification().create_standard_with(HostAlias.UAT, RepositoryBranch.DEVELOP, 'some_rsr_db'))

    def test_can_create_custom_host_config_specification(self):
        """fab.tests.config.spec.host_config_specification_test  Can create a custom host configuration specification"""

        self.assertEqual(self._expected_spec(ConfigType.CUSTOM, ['/path/to/custom_host_config_module.py']),
                         HostConfigSpecification().create_custom_with('/path/to/custom_host_config_module.py'))

    def _expected_spec(self, config_type_specifier, config_values):
        return "%s:%s" % (config_type_specifier, ';'.join(config_values))


def suite():
    return TestSuiteLoader().load_tests_from(HostConfigSpecificationTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
