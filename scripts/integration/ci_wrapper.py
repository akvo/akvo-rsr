#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, sys

if len(sys.argv) <= 1:
    print 'Usage: ci_wrapper <virtualenv_path>'
    sys.exit(1)

os.chdir(os.path.realpath(os.path.dirname(__file__)))
os.system("bash ../testing/run_django_tests %s ci_mode" % (sys.argv[1]))

from ci_cleanup import *

remove_project_links_to_prevent_subsequent_build_failure()

