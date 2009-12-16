#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os

os.chdir(os.path.realpath(os.path.dirname(__file__)))
os.system("bash ./run_django_tests ci_mode")

from ci_cleanup import *

remove_project_links_to_prevent_subsequent_build_failure()

