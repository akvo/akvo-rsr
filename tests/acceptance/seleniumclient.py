# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# SeleniumClient provides a singleton wrapper to manage starting and stopping a Selenium RC client
# more easily for the duration of a single test case or over a suite of tests

from selenium import selenium

from test_settings import *

class SeleniumClient:

    __instance = None

    def __init__(self):
        if SeleniumClient.__instance is None:
            self.start()

    def instance(self):
        return SeleniumClient.__instance

    def start(self):
        if SeleniumClient.__instance is None:
            try:
                print "Running tests on: %s" % (SITE_UNDER_TEST)
                SeleniumClient.__instance = selenium(SELENIUM_RC_HOST, SELENIUM_RC_PORT, BROWSER_ENVIRONMENT, SITE_UNDER_TEST)
                SeleniumClient.__instance.start()
            except Exception, exception:
                print ">> Unable to start Selenium RC client: %s" % (exception)
                raise exception

    def stop(self):
        try:
            SeleniumClient.__instance.stop()
        except Exception, exception:
            print ">> Unable to stop Selenium RC client: %s" % (exception)
