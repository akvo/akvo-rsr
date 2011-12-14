# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, sys


DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))


class SysPath(object):

    @staticmethod
    def ensure_syspath_contains(expected_path):
        full_path = os.path.realpath(expected_path)
        if full_path not in sys.path:
            sys.path.insert(0, full_path)


class SysPathVerifier(object):

    def exit_if_deployment_scripts_home_not_on_syspath(self):
        self.exit_if_dir_not_on_syspath(DEPLOYMENT_SCRIPTS_HOME)

    def exit_if_dir_not_on_syspath(self, expected_dir):
        if expected_dir not in sys.path:
            self.display_python_path_instructions_and_exit()
        else:
            try:
                import verifiers.syspath
            except ImportError:
                self.display_python_path_instructions_and_exit()

    def display_python_path_instructions_and_exit(self):
        print ">> The [%s] directory should be on the system path" % DEPLOYMENT_SCRIPTS_HOME
        print ">> Add the missing path to your PYTHONPATH environment variable to run this script"
        sys.exit(1)
