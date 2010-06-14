# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os

INTEGRATION_SCRIPTS_PATH = os.path.realpath(os.path.dirname(__file__))
TESTING_SCRIPTS_PATH = os.path.realpath(os.path.join(INTEGRATION_SCRIPTS_PATH, '..', 'testing'))
TOOLS_PATH = os.path.realpath(os.path.join(INTEGRATION_SCRIPTS_PATH, '..', '..', 'tools'))

JAVA_RUNTIME_PATH = "/usr/bin/java"
SELENIUM_SERVER_JAR_PATH = os.path.join(TOOLS_PATH, "selenium/1.0.3/rc-server/selenium-server.jar")
SELENIUM_SERVER_LOG_PATH = "/var/tmp/log/selenium"
