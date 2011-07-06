# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import nose


class TestSuiteLoader(object):

    def create_suite_from_classes(self, test_class_list):
        return create_suite_from_list(map(lambda test_class: load_tests_from(test_class), test_class_list))

    def create_suite_from_list(self, test_suite_list):
        return nose.suite.LazySuite(test_suite_list)

    def load_tests_from(self, test_case):
        return nose.loader.TestLoader().loadTestsFromTestCase(test_case)


class TestRunner(object):

    def __init__(self, test_mode):
        self.test_mode = test_mode

    def run_test_suite(self, suite):
        test_runner = nose.core.TextTestRunner(verbosity=2)

        if self.test_mode == 'ci':
            import teamcity.unittestpy
            test_runner = teamcity.unittestpy.TeamcityTestRunner()

        return test_runner.run(suite)
