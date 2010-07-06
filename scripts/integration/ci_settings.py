# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os


INTEGRATION_SCRIPTS_PATH = os.path.realpath(os.path.dirname(__file__))
TESTING_SCRIPTS_PATH = os.path.realpath(os.path.join(INTEGRATION_SCRIPTS_PATH, '..', 'testing'))

# Django settings
VIRTUAL_ENV_PATH="/var/django/akvo"

# Selenium settings
SELENIUM_SERVER_LOG_PATH = "/var/tmp/log/selenium"
SELENIUM_RC_HOST = "localhost"
SELENIUM_RC_PORT = 4444
BROWSER_ENVIRONMENT = "*firefox /usr/bin/firefox-bin"

# Virtual frame buffer settings for headless mode
XVFB_LOG_PATH = "/var/tmp/log/xvfb"
