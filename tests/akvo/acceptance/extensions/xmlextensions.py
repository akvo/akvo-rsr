# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import urllib
import xml.etree.cElementTree as ET

def element_root_from(url):
    return ET.parse(urllib.urlopen(url)).getroot()
