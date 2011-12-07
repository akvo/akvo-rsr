#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, subprocess, sys

from ci_environment import *
from ci_settings import *


def display_usage_and_exit():
    print "Usage: ci_wrapper [acceptance_test_project_name]"
    print "Optionally specify an acceptance test project name, e.g. akvo"
    sys.exit(1)


TEST_PROJECT_NAME = 'akvo'

if len(sys.argv) > 2:
    print ">> Unexpected number of parameters: %s" % (sys.argv[1:])
    display_usage_and_exit()
elif len(sys.argv) == 2:
    TEST_PROJECT_NAME = sys.argv[1]


def run_django_tests():
    print "Using virtualenv path: %s" % VIRTUAL_ENV_PATH
    subprocess.call(["./run_django_tests.sh", VIRTUAL_ENV_PATH, "ci_mode"])

def run_acceptance_tests():
    configure_acceptance_test_settings_for_ci()
    print "Running acceptance tests for project: %s" % TEST_PROJECT_NAME
    subprocess.call(["./run_acceptance_tests.sh", TEST_PROJECT_NAME, SELENIUM_SERVER_LOG_PATH, XVFB_LOG_PATH])


if __name__ == "__main__":
    os.chdir(TESTING_SCRIPTS_PATH)
    run_django_tests()
    run_acceptance_tests()
