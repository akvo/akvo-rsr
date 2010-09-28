# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# The following values are used in the DWS acceptance tests

import os

# options are 'normal' or 'ci' for continuous integration
TEST_MODE = 'ci'

BROWSER_ENVIRONMENT = "*firefox /usr/bin/firefox-bin"
SELENIUM_RC_HOST = "localhost"
SELENIUM_RC_PORT = 4444

SUPERUSER_USERNAME = 'not_yet_allocated'
SUPERUSER_PASSWORD = 'not_yet_allocated'

UAT_EMAIL_ADDRESS = "akvo.uat@gmail.com"
GMAIL_USERNAME = "akvo.uat"
GMAIL_PASSWORD = "R4inDr0p"

SITE_UNDER_TEST = "http://pvw-dev.akvo.org"
ORGANISATION_NAME = "DutchWaterSector"

PAGE_LOAD_TIMEOUT_IN_SECONDS = 180
PAGE_LOAD_TIMEOUT = PAGE_LOAD_TIMEOUT_IN_SECONDS * 1000

TESTS_ROOT_DIR = os.path.realpath(os.path.dirname(__file__))
TEST_IMAGES_DIR = os.path.join(TESTS_ROOT_DIR, 'images')
