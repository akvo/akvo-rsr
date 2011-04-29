#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.testexecution import *

from helpers.unittests.akvopaths_test import AkvoPathsTest
from helpers.unittests.akvourls_test import AkvoURLsTest
from helpers.unittests.externalurls_test import ExternalURLsTest
from helpers.unittests.rsrpath_test import RSRPathTest


def helpers_suite():
    return create_test_suite_from_classes([AkvoPathsTest, AkvoURLsTest, ExternalURLsTest, RSRPathTest])

if __name__ == "__main__":
    run_test_suite(helpers_suite())
