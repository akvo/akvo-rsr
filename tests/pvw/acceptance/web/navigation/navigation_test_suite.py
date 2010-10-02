#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from web.navigation.menu_navigation_test import MenuNavigationTest

def navigation_suite():
    return create_test_suite_from_classes([MenuNavigationTest])

if __name__ == "__main__":
    run_test_suite(navigation_suite())
    SeleniumClient().stop()
