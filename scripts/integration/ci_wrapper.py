#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, subprocess, sys

from ci_cleanup import *
from ci_environment import *
from ci_settings import *


def verify_script_parameters():
    if len(sys.argv) <= 1:
        print 'Usage: ci_wrapper <virtualenv_path>'
        sys.exit(1)

def run_django_tests():
    print "Using virtualenv path: %s" % sys.argv[1]
    subprocess.call(["./run_django_tests", sys.argv[1], "ci_mode"])
    remove_project_links_to_prevent_subsequent_build_failure()

def run_acceptance_tests():
    configure_acceptance_test_settings_for_ci()
    subprocess.call(["./run_acceptance_tests", SELENIUM_SERVER_LOG_PATH])


if __name__ == "__main__":
    verify_script_parameters()
    os.chdir(TESTING_SCRIPTS_PATH)
    run_django_tests()
    run_acceptance_tests()
