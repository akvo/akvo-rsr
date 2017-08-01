# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the
# Akvo RSR module. For additional details on the GNU license please see <
# http://www.gnu.org/licenses/agpl.html >.

"""Script to run tests using Browserstack

Currently, the script is meant to be run locally by the developers, but it can
be easily extended to be run on Travis, etc.

RSR_ENV and BROWSERSTACK_URL need to be set as environment variables for the
script to run.

When logged in to Browserstack,
https://www.browserstack.com/automate/python has the url in the examples.

RSR_ENV should be set to "uat" if these tests are being run before a
deployment, "live" after a deployment and "dev" to test a PR on the dev server.

"""

# *FIXME*: The file, even though in the tests directory, has been named such
# *that it doesn't automatically run on Travis. This script currently needs to
# *be run manually by developers.


import os
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

# FIXME: Make the URL storable on Travis, etc.
BROWSERSTACK_URL = os.environ.get('BROWSERSTACK_URL')
ENV_URLS = {
    'dev': 'https://rsr-dev.test.akvo.org',
    'test': 'https://rsr.test.akvo.org',
    'uat': 'https://rsr.uat.akvo.org',
    'live': 'https://rsr.akvo.org',
}
rsr_env = os.environ.get('RSR_ENV', 'dev')
BASE_URL = ENV_URLS.get(rsr_env, ENV_URLS['dev'])
# FIXME: make it easier to use other browsers
desired_cap = {
    'browser': 'IE',
    'browser_version': '11.0',
    'os': 'Windows',
    'os_version': '10',
    'resolution': '1024x768'
}


class DeployedCodeTestCase(unittest.TestCase):

    def setUp(self):
        # FIXME: Make it easy to test using local chrome/firefox
        # self.driver = webdriver.Chrome()
        self.driver = webdriver.Remote(
            command_executor=BROWSERSTACK_URL,
            desired_capabilities=desired_cap,
        )

    def test_advanced_search_data_fetched(self):
        status_selector = 'li#advanced-filter-status'

        driver = self.driver
        driver.get(BASE_URL)
        self.close_password_modal()
        search = driver.find_element_by_css_selector('#search .showFilters')
        search_view = driver.find_element_by_id('search-view')
        driver.execute_script(
            "arguments[0].scrollIntoView(true);", search_view
        )
        search.click()
        try:
            WebDriverWait(self.driver, 10).until(
                EC.text_to_be_present_in_element(
                    (By.CSS_SELECTOR, status_selector), 'Projects'
                )
            )
        except:
            status = driver.find_element_by_css_selector(status_selector)
            raise AssertionError(
                'Element Text: {}. Failed to get projects'.format(status.text)
            )

    def tearDown(self):
        self.driver.quit()

    def close_password_modal(self):
        element = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, ".modal-content input[type=password]")
            )
        )
        element.send_keys('TesTing!')
        self.driver.find_element_by_css_selector(
            '.modal-footer > button'
        ).click()

if __name__ == "__main__":
    unittest.main()
