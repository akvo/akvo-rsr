#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.config.rsr.data.populator_config_test import RSRDataPopulatorConfigTest
from fab.tests.config.rsr.data.retriever_config_test import RSRDataRetrieverConfigTest


def data_config_suite():
    return TestSuiteLoader().create_suite_from_classes([RSRDataRetrieverConfigTest, RSRDataPopulatorConfigTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(data_config_suite())
