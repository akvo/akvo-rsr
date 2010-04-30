# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from test_settings import RSR_API_PATH

def api_path(request_path):
    return "%s%s" % (RSR_API_PATH, request_path)
