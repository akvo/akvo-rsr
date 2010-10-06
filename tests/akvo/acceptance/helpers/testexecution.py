# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from test_settings import TEST_MODE


def create_test_suite_from_classes(test_class_list):
    return create_test_suite_from_suites(map(lambda test_class: load_tests_from(test_class), test_class_list))

def create_test_suite_from_suites(test_suite_list):
    return nose.suite.LazySuite(test_suite_list)

def load_tests_from(test_case):
    return nose.loader.TestLoader().loadTestsFromTestCase(test_case)

def run_test_suite(suite):
    test_runner = nose.core.TextTestRunner(verbosity=2)

    if TEST_MODE == 'ci':
        from teamcity.unittestpy import TeamcityTestRunner
        test_runner = TeamcityTestRunner()

    return test_runner.run(suite)
