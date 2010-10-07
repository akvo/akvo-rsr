#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from web.general.general_test_suite import general_suite
from web.navigation.navigation_test_suite import navigation_suite
from web.content.page_content_test_suite import page_content_suite


def web_suite():
    return create_test_suite_from_suites([general_suite(), navigation_suite(), page_content_suite()])

if __name__ == "__main__":
    run_test_suite(web_suite())
    SeleniumClient().stop()
