#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, subprocess, sys

from ci_cleanup import *
from ci_environment import *
from ci_paths import *
from commandline import *


def verify_script_parameters():
    if len(sys.argv) <= 1:
        print 'Usage: ci_wrapper <virtualenv_path>'
        sys.exit(1)

def run_django_tests():
    shell_call("./run_django_tests %s ci_mode" % (sys.argv[1]))
    remove_project_links_to_prevent_subsequent_build_failure()

def run_acceptance_tests():
    setup_acceptance_test_environment()
    shell_call("./run_acceptance_tests")


if __name__ == "__main__":
    verify_script_parameters()
    os.chdir(TESTING_SCRIPTS_PATH)
    run_django_tests()
    run_acceptance_tests()
