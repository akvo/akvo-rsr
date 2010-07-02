#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from web.home.home_page_test import HomePageTest
from web.home.footer_links_test import FooterLinksTest

def home_page_suite():
    return create_test_suite_from_classes([HomePageTest, FooterLinksTest])

if __name__ == "__main__":
    run_test_suite(home_page_suite())
    SeleniumClient().stop()
