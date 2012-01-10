# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, sys


DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))
TEST_EXECUTION_HELPERS_HOME = os.path.realpath(os.path.join(DEPLOYMENT_SCRIPTS_HOME, '../../tests/shared'))


class SysPathVerifier(object):

    def ensure_syspath_contains_deployment_scripts_home(self):
        self.ensure_syspath_contains(DEPLOYMENT_SCRIPTS_HOME)

    def ensure_syspath_contains_testing_helpers_home(self):
        self.ensure_syspath_contains(TEST_EXECUTION_HELPERS_HOME)

    def ensure_syspath_contains(self, expected_path):
        full_path = os.path.realpath(expected_path)
        if full_path not in sys.path:
            sys.path.insert(0, full_path)
